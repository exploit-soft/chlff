import { auth } from '../configs/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../configs/firebase';

// Base User Profile interface
export interface BaseUserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'school';
  createdAt: Date;
  updatedAt: Date;
}

// Student Profile interface
export interface StudentProfile extends BaseUserProfile {
  role: 'student';
  assessmentPassed: boolean;
  assessmentScore: number;
  totalTimePlayed: number;
  totalSuccessfulMissions: number;
  totalFailedMissions: number;
  items: {
    [character: string]: {
      unlockedItemIds: number[];
    };
  };
  year: number;
  level: number;
  gender: 'boy' | 'girl';
  skin: string;
  character: string;
  fishGameInfo: {
    level: number;
    totalTimePlayed: number;
    totalSuccessfulMissions: number;
    totalFailedMissions: number;
  };
  carGameInfo: {
    level: number;
    totalTimePlayed: number;
    totalSuccessfulMissions: number;
    totalFailedMissions: number;
  };
  teacherId?: string; // ID of assigned teacher
  parentId?: string; // ID of assigned parent
  schoolId?: string; // ID of school
  classId?: string; // ID of class
}

// Teacher Profile interface
export interface TeacherProfile extends BaseUserProfile {
  role: 'teacher';
  schoolId: string; // ID of school they belong to
  classIds: string[]; // Array of class IDs they manage
  studentIds: string[]; // Array of student IDs they manage
  subject?: string; // Subject they teach
  qualification?: string; // Their qualification
}

// Parent Profile interface
export interface ParentProfile extends BaseUserProfile {
  role: 'parent';
  childrenIds: string[]; // Array of student IDs (their children)
  phoneNumber?: string;
  address?: string;
}

// School Profile interface
export interface SchoolProfile extends BaseUserProfile {
  role: 'school';
  schoolName: string;
  address: string;
  phoneNumber: string;
  teacherIds: string[]; // Array of teacher IDs
  studentIds: string[]; // Array of student IDs
  parentIds: string[]; // Array of parent IDs
  classIds: string[]; // Array of class IDs
  principalName?: string;
  establishedYear?: number;
}

// Class interface
export interface ClassData {
  id: string;
  className: string;
  schoolId: string;
  teacherId: string;
  studentIds: string[];
  year: number;
  maxStudents?: number;
  createdAt: any;
  updatedAt: any;
}

// Union type for all user profiles
export type UserProfile =
  | StudentProfile
  | TeacherProfile
  | ParentProfile
  | SchoolProfile;

// Get user profile based on role
export const getUserProfileService = async (): Promise<UserProfile | null> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('No user is currently authenticated');
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const role = userData.role;

      const baseProfile: BaseUserProfile = {
        uid: currentUser.uid,
        displayName: userData.displayName || 'Unknown',
        email: userData.email || currentUser.email || '',
        role: role || 'student',
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };

      switch (role) {
        case 'student':
          const defaultGameInfo = {
            level: 1,
            totalTimePlayed: 0,
            totalSuccessfulMissions: 0,
            totalFailedMissions: 0,
          };

          return {
            ...baseProfile,
            role: 'student',
            assessmentPassed: userData.assessmentPassed ?? false,
            assessmentScore: userData.assessmentScore ?? 0,
            totalTimePlayed: userData.totalTimePlayed ?? 0,
            totalSuccessfulMissions: userData.totalSuccessfulMissions ?? 0,
            totalFailedMissions: userData.totalFailedMissions ?? 0,
            items: userData.items || {},
            year: userData.year ?? 1,
            level: userData.level ?? 1,
            gender: userData.gender || 'boy',
            skin: userData.skin || '',
            character: userData.character || '',
            fishGameInfo: userData.fishGameInfo || defaultGameInfo,
            carGameInfo: userData.carGameInfo || defaultGameInfo,
            teacherId: userData.teacherId,
            parentId: userData.parentId,
            schoolId: userData.schoolId,
            classId: userData.classId,
          } as StudentProfile;

        case 'teacher':
          return {
            ...baseProfile,
            role: 'teacher',
            schoolId: userData.schoolId || '',
            classIds: userData.classIds || [],
            studentIds: userData.studentIds || [],
            subject: userData.subject,
            qualification: userData.qualification,
          } as TeacherProfile;

        case 'parent':
          return {
            ...baseProfile,
            role: 'parent',
            childrenIds: userData.childrenIds || [],
            phoneNumber: userData.phoneNumber,
            address: userData.address,
          } as ParentProfile;

        case 'school':
          return {
            ...baseProfile,
            role: 'school',
            schoolName: userData.schoolName || '',
            address: userData.address || '',
            phoneNumber: userData.phoneNumber || '',
            teacherIds: userData.teacherIds || [],
            studentIds: userData.studentIds || [],
            parentIds: userData.parentIds || [],
            classIds: userData.classIds || [],
            principalName: userData.principalName,
            establishedYear: userData.establishedYear,
          } as SchoolProfile;

        default:
          throw new Error('Invalid user role');
      }
    } else {
      console.warn(`No profile found for user ${currentUser.uid}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile from Firestore');
  }
};

// Update user profile
export const updateUserProfileService = async (
  uid: string,
  updatedData: Partial<UserProfile>
): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('Unauthorized or no user authenticated');
  }

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: new Date(),
    });
    console.log(`Profile updated for user ${uid}`);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile in Firestore');
  }
};

// Get students by teacher ID
export const getStudentsByTeacherService = async (
  teacherId: string
): Promise<StudentProfile[]> => {
  try {
    const studentsRef = collection(db, 'users');
    const q = query(
      studentsRef,
      where('role', '==', 'student'),
      where('teacherId', '==', teacherId)
    );
    const querySnapshot = await getDocs(q);

    const students: StudentProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StudentProfile);
    });

    return students;
  } catch (error) {
    console.error('Error fetching students by teacher:', error);
    throw new Error('Failed to fetch students');
  }
};

// Get children by parent ID
export const getChildrenByParentService = async (
  parentId: string
): Promise<StudentProfile[]> => {
  try {
    const studentsRef = collection(db, 'users');
    const q = query(
      studentsRef,
      where('role', '==', 'student'),
      where('parentId', '==', parentId)
    );
    const querySnapshot = await getDocs(q);

    const children: StudentProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      children.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StudentProfile);
    });

    return children;
  } catch (error) {
    console.error('Error fetching children by parent:', error);
    throw new Error('Failed to fetch children');
  }
};

// Get all users by school ID
export const getUsersBySchoolService = async (
  schoolId: string
): Promise<{
  teachers: TeacherProfile[];
  students: StudentProfile[];
  parents: ParentProfile[];
}> => {
  try {
    const usersRef = collection(db, 'users');

    // Get teachers
    const teachersQuery = query(
      usersRef,
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

    // Get students
    const studentsQuery = query(
      usersRef,
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

    // Get parents (parents associated with students in this school)
    const parentIds = [
      ...new Set(students.map((student) => student.parentId).filter(Boolean)),
    ];
    const parents: ParentProfile[] = [];

    if (parentIds.length > 0) {
      // Note: Firestore 'where in' queries are limited to 10 items
      // For more than 10 parents, you'd need to batch the queries
      const parentsQuery = query(
        usersRef,
        where('role', '==', 'parent'),
        where('uid', 'in', parentIds.slice(0, 10)) // Limit to first 10
      );
      const parentsSnapshot = await getDocs(parentsQuery);
      parentsSnapshot.forEach((doc) => {
        const data = doc.data();
        parents.push({
          ...data,
          uid: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as ParentProfile);
      });
    }

    return { teachers, students, parents };
  } catch (error) {
    console.error('Error fetching users by school:', error);
    throw new Error('Failed to fetch school users');
  }
};

// Create a new class
export const createClassService = async (
  classData: Omit<ClassData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const classRef = await addDoc(collection(db, 'classes'), {
      ...classData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update teacher's classIds
    const teacherRef = doc(db, 'users', classData.teacherId);
    await updateDoc(teacherRef, {
      classIds: arrayUnion(classRef.id),
      updatedAt: new Date(),
    });

    // Update school's classIds
    const schoolRef = doc(db, 'users', classData.schoolId);
    await updateDoc(schoolRef, {
      classIds: arrayUnion(classRef.id),
      updatedAt: new Date(),
    });

    return classRef.id;
  } catch (error) {
    console.error('Error creating class:', error);
    throw new Error('Failed to create class');
  }
};

// Get classes by school ID
export const getClassesBySchoolService = async (
  schoolId: string
): Promise<ClassData[]> => {
  try {
    const classesRef = collection(db, 'classes');
    const q = query(classesRef, where('schoolId', '==', schoolId));
    const querySnapshot = await getDocs(q);

    const classes: ClassData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      classes.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ClassData);
    });

    return classes;
  } catch (error) {
    console.error('Error fetching classes by school:', error);
    throw new Error('Failed to fetch classes');
  }
};

// Assign student to class
export const assignStudentToClassService = async (
  studentId: string,
  classId: string
): Promise<void> => {
  try {
    // Get class data
    const classDoc = await getDoc(doc(db, 'classes', classId));
    if (!classDoc.exists()) {
      throw new Error('Class not found');
    }

    const classData = classDoc.data() as ClassData;

    // Update student's classId
    const studentRef = doc(db, 'users', studentId);
    await updateDoc(studentRef, {
      classId: classId,
      teacherId: classData.teacherId,
      schoolId: classData.schoolId,
      updatedAt: new Date(),
    });

    // Update class's studentIds
    const classRef = doc(db, 'classes', classId);
    await updateDoc(classRef, {
      studentIds: arrayUnion(studentId),
      updatedAt: new Date(),
    });

    // Update teacher's studentIds
    const teacherRef = doc(db, 'users', classData.teacherId);
    await updateDoc(teacherRef, {
      studentIds: arrayUnion(studentId),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error assigning student to class:', error);
    throw new Error('Failed to assign student to class');
  }
};

// Link parent to child
export const linkParentToChildService = async (
  parentId: string,
  childId: string
): Promise<void> => {
  try {
    // Update parent's childrenIds
    const parentRef = doc(db, 'users', parentId);
    await updateDoc(parentRef, {
      childrenIds: arrayUnion(childId),
      updatedAt: new Date(),
    });

    // Update child's parentId
    const childRef = doc(db, 'users', childId);
    await updateDoc(childRef, {
      parentId: parentId,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error linking parent to child:', error);
    throw new Error('Failed to link parent to child');
  }
};

// Unlock item service (for students)
export const unlockItemService = async (
  uid: string,
  characterName: string,
  itemId: number
): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('Unauthorized or no user authenticated');
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();

    // Only allow item unlocking for students
    if (userData.role !== 'student') {
      throw new Error('Only students can unlock items');
    }

    const currentItems = userData.items || {};

    // Initialize character entry if it doesn't exist
    const characterData = currentItems[characterName] || {
      unlockedItemIds: [],
    };

    // Add itemId if not already unlocked
    if (!characterData.unlockedItemIds.includes(itemId)) {
      characterData.unlockedItemIds.push(itemId);
    }

    // Update items object
    currentItems[characterName] = characterData;

    await updateDoc(userRef, {
      items: currentItems,
      updatedAt: new Date(),
    });
    console.log(`Unlocked item ${itemId} for ${characterName} for user ${uid}`);
  } catch (error) {
    console.error('Error unlocking item:', error);
    throw new Error('Failed to unlock item in Firestore');
  }
};
