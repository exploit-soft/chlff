import { db } from '../configs/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { StudentProfile } from './userService';

export interface LeaderBoardEntry {
  uid: string;
  displayName: string;
  totalTimePlayed: number;
  totalSuccessfulMissions: number;
  totalFailedMissions: number;
  year: number;
  level: number;
  character: string;
  gender: 'boy' | 'girl';
  skin: string;
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
  items: {
    [characterGenderKey: string]: {
      unlockedItemIds: number[];
    };
  };
  assessmentScore: number;
  schoolId?: string;
  classId?: string;
  teacherId?: string;
}

// Get global leaderboard by year
export const getLeaderBoardService = async (
  year: number
): Promise<LeaderBoardEntry[]> => {
  try {
    const leaderboardRef = collection(db, 'users');
    const q = query(
      leaderboardRef,
      where('role', '==', 'student'),
      where('year', '==', year),
      orderBy('totalSuccessfulMissions', 'desc'),
      limit(50) // Limit to top 50 students
    );
    const querySnapshot = await getDocs(q);

    const leaderboard: LeaderBoardEntry[] = [];

    // Default values for nested game info
    const defaultGameInfo = {
      level: 1,
      totalTimePlayed: 0,
      totalSuccessfulMissions: 0,
      totalFailedMissions: 0,
    };

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      leaderboard.push({
        uid: docSnap.id,
        displayName: data.displayName || 'Unknown',
        totalTimePlayed: data.totalTimePlayed ?? 0,
        totalSuccessfulMissions: data.totalSuccessfulMissions ?? 0,
        totalFailedMissions: data.totalFailedMissions ?? 0,
        year: data.year ?? 1,
        level: data.level ?? 1,
        character: data.character || '',
        gender: data.gender || 'boy',
        skin: data.skin || '',
        fishGameInfo: data.fishGameInfo || defaultGameInfo,
        carGameInfo: data.carGameInfo || defaultGameInfo,
        items: data.items || {},
        assessmentScore: data.assessmentScore ?? 0,
        schoolId: data.schoolId,
        classId: data.classId,
        teacherId: data.teacherId,
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard: ', error);
    throw new Error('Unable to retrieve leaderboard');
  }
};

// Get leaderboard by school
export const getSchoolLeaderBoardService = async (
  schoolId: string,
  year?: number
): Promise<LeaderBoardEntry[]> => {
  try {
    const leaderboardRef = collection(db, 'users');
    let q;

    if (year) {
      q = query(
        leaderboardRef,
        where('role', '==', 'student'),
        where('schoolId', '==', schoolId),
        where('year', '==', year),
        orderBy('totalSuccessfulMissions', 'desc')
      );
    } else {
      q = query(
        leaderboardRef,
        where('role', '==', 'student'),
        where('schoolId', '==', schoolId),
        orderBy('totalSuccessfulMissions', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const leaderboard: LeaderBoardEntry[] = [];

    const defaultGameInfo = {
      level: 1,
      totalTimePlayed: 0,
      totalSuccessfulMissions: 0,
      totalFailedMissions: 0,
    };

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      leaderboard.push({
        uid: docSnap.id,
        displayName: data.displayName || 'Unknown',
        totalTimePlayed: data.totalTimePlayed ?? 0,
        totalSuccessfulMissions: data.totalSuccessfulMissions ?? 0,
        totalFailedMissions: data.totalFailedMissions ?? 0,
        year: data.year ?? 1,
        level: data.level ?? 1,
        character: data.character || '',
        gender: data.gender || 'boy',
        skin: data.skin || '',
        fishGameInfo: data.fishGameInfo || defaultGameInfo,
        carGameInfo: data.carGameInfo || defaultGameInfo,
        items: data.items || {},
        assessmentScore: data.assessmentScore ?? 0,
        schoolId: data.schoolId,
        classId: data.classId,
        teacherId: data.teacherId,
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error getting school leaderboard: ', error);
    throw new Error('Unable to retrieve school leaderboard');
  }
};

// Get leaderboard by class
export const getClassLeaderBoardService = async (
  classId: string
): Promise<LeaderBoardEntry[]> => {
  try {
    const leaderboardRef = collection(db, 'users');
    const q = query(
      leaderboardRef,
      where('role', '==', 'student'),
      where('classId', '==', classId),
      orderBy('totalSuccessfulMissions', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const leaderboard: LeaderBoardEntry[] = [];

    const defaultGameInfo = {
      level: 1,
      totalTimePlayed: 0,
      totalSuccessfulMissions: 0,
      totalFailedMissions: 0,
    };

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      leaderboard.push({
        uid: docSnap.id,
        displayName: data.displayName || 'Unknown',
        totalTimePlayed: data.totalTimePlayed ?? 0,
        totalSuccessfulMissions: data.totalSuccessfulMissions ?? 0,
        totalFailedMissions: data.totalFailedMissions ?? 0,
        year: data.year ?? 1,
        level: data.level ?? 1,
        character: data.character || '',
        gender: data.gender || 'boy',
        skin: data.skin || '',
        fishGameInfo: data.fishGameInfo || defaultGameInfo,
        carGameInfo: data.carGameInfo || defaultGameInfo,
        items: data.items || {},
        assessmentScore: data.assessmentScore ?? 0,
        schoolId: data.schoolId,
        classId: data.classId,
        teacherId: data.teacherId,
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error getting class leaderboard: ', error);
    throw new Error('Unable to retrieve class leaderboard');
  }
};

// Get leaderboard for teacher's students
export const getTeacherStudentsLeaderBoardService = async (
  teacherId: string
): Promise<LeaderBoardEntry[]> => {
  try {
    const leaderboardRef = collection(db, 'users');
    const q = query(
      leaderboardRef,
      where('role', '==', 'student'),
      where('teacherId', '==', teacherId),
      orderBy('totalSuccessfulMissions', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const leaderboard: LeaderBoardEntry[] = [];

    const defaultGameInfo = {
      level: 1,
      totalTimePlayed: 0,
      totalSuccessfulMissions: 0,
      totalFailedMissions: 0,
    };

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      leaderboard.push({
        uid: docSnap.id,
        displayName: data.displayName || 'Unknown',
        totalTimePlayed: data.totalTimePlayed ?? 0,
        totalSuccessfulMissions: data.totalSuccessfulMissions ?? 0,
        totalFailedMissions: data.totalFailedMissions ?? 0,
        year: data.year ?? 1,
        level: data.level ?? 1,
        character: data.character || '',
        gender: data.gender || 'boy',
        skin: data.skin || '',
        fishGameInfo: data.fishGameInfo || defaultGameInfo,
        carGameInfo: data.carGameInfo || defaultGameInfo,
        items: data.items || {},
        assessmentScore: data.assessmentScore ?? 0,
        schoolId: data.schoolId,
        classId: data.classId,
        teacherId: data.teacherId,
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error getting teacher students leaderboard: ', error);
    throw new Error('Unable to retrieve teacher students leaderboard');
  }
};

// Get leaderboard for parent's children
export const getParentChildrenLeaderBoardService = async (
  parentId: string
): Promise<LeaderBoardEntry[]> => {
  try {
    const leaderboardRef = collection(db, 'users');
    const q = query(
      leaderboardRef,
      where('role', '==', 'student'),
      where('parentId', '==', parentId),
      orderBy('totalSuccessfulMissions', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const leaderboard: LeaderBoardEntry[] = [];

    const defaultGameInfo = {
      level: 1,
      totalTimePlayed: 0,
      totalSuccessfulMissions: 0,
      totalFailedMissions: 0,
    };

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      leaderboard.push({
        uid: docSnap.id,
        displayName: data.displayName || 'Unknown',
        totalTimePlayed: data.totalTimePlayed ?? 0,
        totalSuccessfulMissions: data.totalSuccessfulMissions ?? 0,
        totalFailedMissions: data.totalFailedMissions ?? 0,
        year: data.year ?? 1,
        level: data.level ?? 1,
        character: data.character || '',
        gender: data.gender || 'boy',
        skin: data.skin || '',
        fishGameInfo: data.fishGameInfo || defaultGameInfo,
        carGameInfo: data.carGameInfo || defaultGameInfo,
        items: data.items || {},
        assessmentScore: data.assessmentScore ?? 0,
        schoolId: data.schoolId,
        classId: data.classId,
        teacherId: data.teacherId,
      });
    });

    return leaderboard;
  } catch (error) {
    console.error('Error getting parent children leaderboard: ', error);
    throw new Error('Unable to retrieve parent children leaderboard');
  }
};

// Update leaderboard entry (student progress)
export const updateLeaderBoardService = async (
  uid: string,
  updatedData: Partial<LeaderBoardEntry>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating leaderboard: ', error);
    throw new Error('Unable to update leaderboard');
  }
};

// Get student performance analytics
export const getStudentAnalyticsService = async (
  studentId: string
): Promise<{
  overallStats: LeaderBoardEntry;
  gameSpecificStats: {
    fishGame: {
      level: number;
      totalTimePlayed: number;
      totalSuccessfulMissions: number;
      totalFailedMissions: number;
      successRate: number;
    };
    carGame: {
      level: number;
      totalTimePlayed: number;
      totalSuccessfulMissions: number;
      totalFailedMissions: number;
      successRate: number;
    };
  };
  progressOverTime: {
    assessmentScore: number;
    totalSuccessfulMissions: number;
    itemsUnlocked: number;
  };
}> => {
  try {
    const userDoc = await getDocs(
      query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('uid', '==', studentId)
      )
    );

    if (userDoc.empty) {
      throw new Error('Student not found');
    }

    const studentData = userDoc.docs[0].data();

    const defaultGameInfo = {
      level: 1,
      totalTimePlayed: 0,
      totalSuccessfulMissions: 0,
      totalFailedMissions: 0,
    };

    const overallStats: LeaderBoardEntry = {
      uid: studentId,
      displayName: studentData.displayName || 'Unknown',
      totalTimePlayed: studentData.totalTimePlayed ?? 0,
      totalSuccessfulMissions: studentData.totalSuccessfulMissions ?? 0,
      totalFailedMissions: studentData.totalFailedMissions ?? 0,
      year: studentData.year ?? 1,
      level: studentData.level ?? 1,
      character: studentData.character || '',
      gender: studentData.gender || 'boy',
      skin: studentData.skin || '',
      fishGameInfo: studentData.fishGameInfo || defaultGameInfo,
      carGameInfo: studentData.carGameInfo || defaultGameInfo,
      items: studentData.items || {},
      assessmentScore: studentData.assessmentScore ?? 0,
      schoolId: studentData.schoolId,
      classId: studentData.classId,
      teacherId: studentData.teacherId,
    };

    const fishGameStats = studentData.fishGameInfo || defaultGameInfo;
    const carGameStats = studentData.carGameInfo || defaultGameInfo;

    const gameSpecificStats = {
      fishGame: {
        ...fishGameStats,
        successRate:
          fishGameStats.totalSuccessfulMissions +
            fishGameStats.totalFailedMissions >
          0
            ? (fishGameStats.totalSuccessfulMissions /
                (fishGameStats.totalSuccessfulMissions +
                  fishGameStats.totalFailedMissions)) *
              100
            : 0,
      },
      carGame: {
        ...carGameStats,
        successRate:
          carGameStats.totalSuccessfulMissions +
            carGameStats.totalFailedMissions >
          0
            ? (carGameStats.totalSuccessfulMissions /
                (carGameStats.totalSuccessfulMissions +
                  carGameStats.totalFailedMissions)) *
              100
            : 0,
      },
    };

    // Calculate total items unlocked
    const itemsUnlocked = Object.values(studentData.items || {}).reduce(
      (total: number, characterItems: any) =>
        total + (characterItems.unlockedItemIds?.length || 0),
      0
    );

    const progressOverTime = {
      assessmentScore: studentData.assessmentScore ?? 0,
      totalSuccessfulMissions: studentData.totalSuccessfulMissions ?? 0,
      itemsUnlocked,
    };

    return {
      overallStats,
      gameSpecificStats,
      progressOverTime,
    };
  } catch (error) {
    console.error('Error getting student analytics: ', error);
    throw new Error('Unable to retrieve student analytics');
  }
};

// Get class performance summary for teachers
export const getClassPerformanceSummaryService = async (
  classId: string
): Promise<{
  totalStudents: number;
  averageScore: number;
  averageTimePlayed: number;
  topPerformers: LeaderBoardEntry[];
  strugglingStudents: LeaderBoardEntry[];
}> => {
  try {
    const classLeaderboard = await getClassLeaderBoardService(classId);

    if (classLeaderboard.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        averageTimePlayed: 0,
        topPerformers: [],
        strugglingStudents: [],
      };
    }

    const totalStudents = classLeaderboard.length;
    const averageScore =
      classLeaderboard.reduce(
        (sum, student) => sum + student.assessmentScore,
        0
      ) / totalStudents;
    const averageTimePlayed =
      classLeaderboard.reduce(
        (sum, student) => sum + student.totalTimePlayed,
        0
      ) / totalStudents;

    // Top 3 performers (highest successful missions)
    const topPerformers = classLeaderboard.slice(0, 3);

    // Bottom 3 performers (need attention)
    const strugglingStudents = classLeaderboard
      .sort((a, b) => a.totalSuccessfulMissions - b.totalSuccessfulMissions)
      .slice(0, 3);

    return {
      totalStudents,
      averageScore,
      averageTimePlayed,
      topPerformers,
      strugglingStudents,
    };
  } catch (error) {
    console.error('Error getting class performance summary: ', error);
    throw new Error('Unable to retrieve class performance summary');
  }
};
