import { db, auth } from '../configs/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  limit,
} from 'firebase/firestore';
import {
  UserProfile,
  StudentProfile,
  TeacherProfile,
  ParentProfile,
  SchoolProfile,
  ClassData,
} from './userService';
import { LeaderBoardEntry } from './leaderBoardService';

// Teacher Dashboard Data Interface
export interface TeacherDashboardData {
  profile: TeacherProfile;
  totalStudents: number;
  totalClasses: number;
  students: StudentProfile[];
  classes: ClassData[];
  recentActivity: {
    newStudents: StudentProfile[];
    topPerformers: LeaderBoardEntry[];
    strugglingStudents: LeaderBoardEntry[];
  };
  classPerformance: {
    [classId: string]: {
      className: string;
      totalStudents: number;
      averageScore: number;
      averageTimePlayed: number;
    };
  };
}

// Parent Dashboard Data Interface
export interface ParentDashboardData {
  profile: ParentProfile;
  children: StudentProfile[];
  childrenPerformance: {
    [childId: string]: {
      name: string;
      assessmentScore: number;
      totalTimePlayed: number;
      totalSuccessfulMissions: number;
      level: number;
      recentAchievements: string[];
    };
  };
  overallProgress: {
    totalTimePlayed: number;
    totalSuccessfulMissions: number;
    averageScore: number;
  };
}

// School Dashboard Data Interface
export interface SchoolDashboardData {
  profile: SchoolProfile;
  totalTeachers: number;
  totalStudents: number;
  totalParents: number;
  totalClasses: number;
  teachers: TeacherProfile[];
  students: StudentProfile[];
  parents: ParentProfile[];
  classes: ClassData[];
  schoolPerformance: {
    totalTimePlayed: number;
    totalSuccessfulMissions: number;
    averageScore: number;
    topPerformingClasses: {
      classId: string;
      className: string;
      averageScore: number;
      studentCount: number;
    }[];
  };
  recentActivity: {
    newRegistrations: UserProfile[];
    topPerformers: LeaderBoardEntry[];
  };
}

// Get Teacher Dashboard Data
export const getTeacherDashboardService = async (
  teacherId: string
): Promise<TeacherDashboardData> => {
  try {
    // Get teacher profile
    const teacherDoc = await getDoc(doc(db, 'users', teacherId));
    if (!teacherDoc.exists() || teacherDoc.data().role !== 'teacher') {
      throw new Error('Teacher not found');
    }

    const teacherProfile = {
      ...teacherDoc.data(),
      uid: teacherId,
      createdAt: teacherDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: teacherDoc.data().updatedAt?.toDate() || new Date(),
    } as TeacherProfile;

    // Get teacher's students
    const studentsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'student'),
      where('teacherId', '==', teacherId)
    );
    const studentsSnapshot = await getDocs(studentsQuery);
    const students: StudentProfile[] = [];

    studentsSnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StudentProfile);
    });

    // Get teacher's classes
    const classesQuery = query(
      collection(db, 'classes'),
      where('teacherId', '==', teacherId)
    );
    const classesSnapshot = await getDocs(classesQuery);
    const classes: ClassData[] = [];

    classesSnapshot.forEach((doc) => {
      const data = doc.data();
      classes.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ClassData);
    });

    // Get recent activity
    const newStudents = students
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    const topPerformers = students
      .sort((a, b) => b.totalSuccessfulMissions - a.totalSuccessfulMissions)
      .slice(0, 5)
      .map(
        (student) =>
          ({
            uid: student.uid,
            displayName: student.displayName,
            totalTimePlayed: student.totalTimePlayed,
            totalSuccessfulMissions: student.totalSuccessfulMissions,
            totalFailedMissions: student.totalFailedMissions,
            year: student.year,
            level: student.level,
            character: student.character,
            gender: student.gender,
            skin: student.skin,
            fishGameInfo: student.fishGameInfo,
            carGameInfo: student.carGameInfo,
            items: student.items,
            assessmentScore: student.assessmentScore,
            schoolId: student.schoolId,
            classId: student.classId,
            teacherId: student.teacherId,
          } as LeaderBoardEntry)
      );

    const strugglingStudents = students
      .sort((a, b) => a.totalSuccessfulMissions - b.totalSuccessfulMissions)
      .slice(0, 5)
      .map(
        (student) =>
          ({
            uid: student.uid,
            displayName: student.displayName,
            totalTimePlayed: student.totalTimePlayed,
            totalSuccessfulMissions: student.totalSuccessfulMissions,
            totalFailedMissions: student.totalFailedMissions,
            year: student.year,
            level: student.level,
            character: student.character,
            gender: student.gender,
            skin: student.skin,
            fishGameInfo: student.fishGameInfo,
            carGameInfo: student.carGameInfo,
            items: student.items,
            assessmentScore: student.assessmentScore,
            schoolId: student.schoolId,
            classId: student.classId,
            teacherId: student.teacherId,
          } as LeaderBoardEntry)
      );

    // Calculate class performance
    const classPerformance: { [classId: string]: any } = {};
    for (const classData of classes) {
      const classStudents = students.filter((s) => s.classId === classData.id);
      const averageScore =
        classStudents.length > 0
          ? classStudents.reduce((sum, s) => sum + s.assessmentScore, 0) /
            classStudents.length
          : 0;
      const averageTimePlayed =
        classStudents.length > 0
          ? classStudents.reduce((sum, s) => sum + s.totalTimePlayed, 0) /
            classStudents.length
          : 0;

      classPerformance[classData.id] = {
        className: classData.className,
        totalStudents: classStudents.length,
        averageScore,
        averageTimePlayed,
      };
    }

    return {
      profile: teacherProfile,
      totalStudents: students.length,
      totalClasses: classes.length,
      students,
      classes,
      recentActivity: {
        newStudents,
        topPerformers,
        strugglingStudents,
      },
      classPerformance,
    };
  } catch (error) {
    console.error('Error getting teacher dashboard data:', error);
    throw new Error('Failed to get teacher dashboard data');
  }
};

// Get Parent Dashboard Data
export const getParentDashboardService = async (
  parentId: string
): Promise<ParentDashboardData> => {
  try {
    // Get parent profile
    const parentDoc = await getDoc(doc(db, 'users', parentId));
    if (!parentDoc.exists() || parentDoc.data().role !== 'parent') {
      throw new Error('Parent not found');
    }

    const parentProfile = {
      ...parentDoc.data(),
      uid: parentId,
      createdAt: parentDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: parentDoc.data().updatedAt?.toDate() || new Date(),
    } as ParentProfile;

    // Get parent's children
    const childrenQuery = query(
      collection(db, 'users'),
      where('role', '==', 'student'),
      where('parentId', '==', parentId)
    );
    const childrenSnapshot = await getDocs(childrenQuery);
    const children: StudentProfile[] = [];

    childrenSnapshot.forEach((doc) => {
      const data = doc.data();
      children.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StudentProfile);
    });

    // Calculate children performance
    const childrenPerformance: { [childId: string]: any } = {};
    for (const child of children) {
      const totalItemsUnlocked = Object.values(child.items || {}).reduce(
        (total: number, characterItems: any) => {
          if (characterItems && typeof characterItems === 'object') {
            return total + Object.keys(characterItems).length;
          }
          return total;
        },
        0
      );

      const recentAchievements = [];
      if (child.level >= 10) recentAchievements.push('Level Master');
      if (child.totalSuccessfulMissions >= 50)
        recentAchievements.push('Mission Expert');
      if (child.assessmentScore >= 80) recentAchievements.push('High Scorer');
      if (totalItemsUnlocked >= 20) recentAchievements.push('Collector');

      childrenPerformance[child.uid] = {
        name: child.displayName,
        assessmentScore: child.assessmentScore,
        totalTimePlayed: child.totalTimePlayed,
        totalSuccessfulMissions: child.totalSuccessfulMissions,
        level: child.level,
        recentAchievements,
      };
    }

    // Calculate overall progress
    const totalTimePlayed = children.reduce(
      (sum, child) => sum + child.totalTimePlayed,
      0
    );
    const totalSuccessfulMissions = children.reduce(
      (sum, child) => sum + child.totalSuccessfulMissions,
      0
    );
    const averageScore =
      children.length > 0
        ? children.reduce((sum, child) => sum + child.assessmentScore, 0) /
          children.length
        : 0;

    return {
      profile: parentProfile,
      children,
      childrenPerformance,
      overallProgress: {
        totalTimePlayed,
        totalSuccessfulMissions,
        averageScore,
      },
    };
  } catch (error) {
    console.error('Error getting parent dashboard data:', error);
    throw new Error('Failed to get parent dashboard data');
  }
};

// Get School Dashboard Data
export const getSchoolDashboardService = async (
  schoolId: string
): Promise<SchoolDashboardData> => {
  try {
    // Get school profile
    const schoolDoc = await getDoc(doc(db, 'schools', schoolId));
    if (!schoolDoc.exists()) {
      throw new Error('School not found');
    }

    const data = schoolDoc.data();

    const schoolProfile: SchoolProfile = {
      ...data,
      uid: schoolId,
      role: data.role,
      schoolName: data.schoolName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      teacherIds: [],
      studentIds: [],
      parentIds: [],
      classIds: [],
      displayName: '',
    };

    // Get school's teachers
    const teachersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'teacher'),
      where('schoolId', '==', schoolId)
    );
    const teachersSnapshot = await getDocs(teachersQuery);
    const teachers: TeacherProfile[] = [];

    teachersSnapshot.forEach((doc) => {
      const data = doc.data();
      teachers.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as TeacherProfile);
    });

    // Get school's students
    const studentsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'student'),
      where('schoolId', '==', schoolId)
    );
    const studentsSnapshot = await getDocs(studentsQuery);
    const students: StudentProfile[] = [];

    studentsSnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StudentProfile);
    });

    // Get school's parents
    const parentsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'parent'),
      where('schoolId', '==', schoolId)
    );
    const parentsSnapshot = await getDocs(parentsQuery);
    const parents: ParentProfile[] = [];

    parentsSnapshot.forEach((doc) => {
      const data = doc.data();
      parents.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ParentProfile);
    });

    // Get school's classes
    const classesQuery = query(
      collection(db, 'classes'),
      where('schoolId', '==', schoolId)
    );
    const classesSnapshot = await getDocs(classesQuery);
    const classes: ClassData[] = [];

    classesSnapshot.forEach((doc) => {
      const data = doc.data();
      classes.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ClassData);
    });

    // Calculate school performance
    const totalTimePlayed = students.reduce(
      (sum, student) => sum + student.totalTimePlayed,
      0
    );
    const totalSuccessfulMissions = students.reduce(
      (sum, student) => sum + student.totalSuccessfulMissions,
      0
    );
    const averageScore =
      students.length > 0
        ? students.reduce((sum, student) => sum + student.assessmentScore, 0) /
          students.length
        : 0;

    // Get top performing classes
    const topPerformingClasses = classes
      .map((classData) => {
        const classStudents = students.filter(
          (s) => s.classId === classData.id
        );
        const classAverageScore =
          classStudents.length > 0
            ? classStudents.reduce((sum, s) => sum + s.assessmentScore, 0) /
              classStudents.length
            : 0;

        return {
          classId: classData.id,
          className: classData.className,
          averageScore: classAverageScore,
          studentCount: classStudents.length,
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);

    // Get recent activity
    const allUsers = [...teachers, ...students, ...parents];
    const newRegistrations = allUsers
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    const topPerformers = students
      .sort((a, b) => b.totalSuccessfulMissions - a.totalSuccessfulMissions)
      .slice(0, 10)
      .map(
        (student) =>
          ({
            uid: student.uid,
            displayName: student.displayName,
            totalTimePlayed: student.totalTimePlayed,
            totalSuccessfulMissions: student.totalSuccessfulMissions,
            totalFailedMissions: student.totalFailedMissions,
            year: student.year,
            level: student.level,
            character: student.character,
            gender: student.gender,
            skin: student.skin,
            fishGameInfo: student.fishGameInfo,
            carGameInfo: student.carGameInfo,
            items: student.items,
            assessmentScore: student.assessmentScore,
            schoolId: student.schoolId,
            classId: student.classId,
            teacherId: student.teacherId,
          } as LeaderBoardEntry)
      );

    return {
      profile: schoolProfile,
      totalTeachers: teachers.length,
      totalStudents: students.length,
      totalParents: parents.length,
      totalClasses: classes.length,
      teachers,
      students,
      parents,
      classes,
      schoolPerformance: {
        totalTimePlayed,
        totalSuccessfulMissions,
        averageScore,
        topPerformingClasses,
      },
      recentActivity: {
        newRegistrations,
        topPerformers,
      },
    };
  } catch (error) {
    console.error('Error getting school dashboard data:', error);
    throw new Error('Failed to get school dashboard data');
  }
};
