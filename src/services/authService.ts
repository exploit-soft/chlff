import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '../configs/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../configs/firebase';
import {
  UserProfile,
  StudentProfile,
  TeacherProfile,
  ParentProfile,
  SchoolProfile,
} from './userService';

// Registration data interfaces for each role
export interface StudentRegistrationData {
  displayName: string;
  email: string;
  password: string;
  role: 'student';
  year: number;
  gender: 'boy' | 'girl';
  parentEmail?: string; // Optional parent email for linking
  schoolId?: string; // Optional school ID
}

export interface TeacherRegistrationData {
  displayName: string;
  email: string;
  password: string;
  role: 'teacher';
  schoolId: string;
  subject?: string;
  qualification?: string;
}

export interface ParentRegistrationData {
  displayName: string;
  email: string;
  password: string;
  role: 'parent';
  phoneNumber?: string;
  address?: string;
  childrenEmails?: string[]; // Optional children emails for linking
}

export interface SchoolRegistrationData {
  displayName: string;
  email: string;
  password: string;
  role: 'school';
  schoolName: string;
  address: string;
  phoneNumber: string;
  principalName?: string;
  establishedYear?: number;
}

export type RegistrationData =
  | StudentRegistrationData
  | TeacherRegistrationData
  | ParentRegistrationData
  | SchoolRegistrationData;

// Register user based on role
export const registerUserService = async (
  registrationData: RegistrationData
): Promise<User> => {
  const { email, password, displayName, role } = registrationData;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, { displayName });

    const now = new Date();
    const baseUserData = {
      displayName,
      email,
      role,
      createdAt: now,
      updatedAt: now,
    };

    let userData: any = baseUserData;

    switch (role) {
      case 'student':
        const studentData = registrationData as StudentRegistrationData;
        userData = {
          ...baseUserData,
          assessmentPassed: false,
          assessmentScore: 0,
          totalTimePlayed: 0,
          totalSuccessfulMissions: 0,
          totalFailedMissions: 0,
          items: {},
          year: studentData.year,
          level: 1,
          gender: studentData.gender,
          skin: '',
          character: '',
          fishGameInfo: {
            level: 1,
            totalTimePlayed: 0,
            totalSuccessfulMissions: 0,
            totalFailedMissions: 0,
          },
          carGameInfo: {
            level: 1,
            totalTimePlayed: 0,
            totalSuccessfulMissions: 0,
            totalFailedMissions: 0,
          },
          schoolId: studentData.schoolId || null,
          teacherId: null,
          parentId: null,
          classId: null,
        };
        break;

      case 'teacher':
        const teacherData = registrationData as TeacherRegistrationData;
        userData = {
          ...baseUserData,
          schoolId: teacherData.schoolId,
          classIds: [],
          studentIds: [],
          subject: teacherData.subject || null,
          qualification: teacherData.qualification || null,
        };
        break;

      case 'parent':
        const parentData = registrationData as ParentRegistrationData;
        userData = {
          ...baseUserData,
          childrenIds: [],
          phoneNumber: parentData.phoneNumber || null,
          address: parentData.address || null,
        };
        break;

      case 'school':
        const schoolData = registrationData as SchoolRegistrationData;
        userData = {
          ...baseUserData,
          schoolName: schoolData.schoolName,
          address: schoolData.address,
          phoneNumber: schoolData.phoneNumber,
          teacherIds: [],
          studentIds: [],
          parentIds: [],
          classIds: [],
          principalName: schoolData.principalName || null,
          establishedYear: schoolData.establishedYear || null,
        };
        break;

      default:
        throw new Error('Invalid role specified');
    }

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    // Handle post-registration linking for students and parents
    await handlePostRegistrationLinking(
      userCredential.user.uid,
      registrationData
    );

    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Handle post-registration linking (parent-child, school assignments)
const handlePostRegistrationLinking = async (
  userId: string,
  registrationData: RegistrationData
): Promise<void> => {
  try {
    if (registrationData.role === 'student') {
      const studentData = registrationData as StudentRegistrationData;

      // Link to parent if parent email provided
      if (studentData.parentEmail) {
        const parentQuery = query(
          collection(db, 'users'),
          where('email', '==', studentData.parentEmail),
          where('role', '==', 'parent')
        );
        const parentSnapshot = await getDocs(parentQuery);

        if (!parentSnapshot.empty) {
          const parentDoc = parentSnapshot.docs[0];
          const parentRef = doc(db, 'users', parentDoc.id);
          const studentRef = doc(db, 'users', userId);

          // Update parent's children list
          const parentData = parentDoc.data();
          const currentChildren = parentData.childrenIds || [];
          await updateDoc(parentRef, {
            childrenIds: [...currentChildren, userId],
            updatedAt: new Date(),
          });

          // Update student's parent reference
          await updateDoc(studentRef, {
            parentId: parentDoc.id,
            updatedAt: new Date(),
          });
        }
      }
    }

    if (registrationData.role === 'parent') {
      const parentData = registrationData as ParentRegistrationData;

      // Link to children if children emails provided
      if (parentData.childrenEmails && parentData.childrenEmails.length > 0) {
        const childrenIds: string[] = [];

        for (const childEmail of parentData.childrenEmails) {
          const childQuery = query(
            collection(db, 'users'),
            where('email', '==', childEmail),
            where('role', '==', 'student')
          );
          const childSnapshot = await getDocs(childQuery);

          if (!childSnapshot.empty) {
            const childDoc = childSnapshot.docs[0];
            const childRef = doc(db, 'users', childDoc.id);
            childrenIds.push(childDoc.id);

            // Update child's parent reference
            await updateDoc(childRef, {
              parentId: userId,
              updatedAt: new Date(),
            });
          }
        }

        // Update parent's children list
        if (childrenIds.length > 0) {
          const parentRef = doc(db, 'users', userId);
          await updateDoc(parentRef, {
            childrenIds: childrenIds,
            updatedAt: new Date(),
          });
        }
      }
    }
  } catch (error) {
    console.error('Error in post-registration linking:', error);
    // Don't throw error here as registration was successful
  }
};

// Login with email & password (returns user and role)
export const loginUserService = async (
  email: string,
  password: string
): Promise<{ user: User; role: string; profile: UserProfile }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Fetch user role and profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    const role = userData.role || 'student';

    // Create profile object based on role
    const baseProfile = {
      uid: userCredential.user.uid,
      displayName: userData.displayName || 'Unknown',
      email: userData.email || userCredential.user.email || '',
      role: role,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date(),
    };

    let profile: UserProfile;

    switch (role) {
      case 'student':
        const defaultGameInfo = {
          level: 1,
          totalTimePlayed: 0,
          totalSuccessfulMissions: 0,
          totalFailedMissions: 0,
        };

        profile = {
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
        break;

      case 'teacher':
        profile = {
          ...baseProfile,
          role: 'teacher',
          schoolId: userData.schoolId || '',
          classIds: userData.classIds || [],
          studentIds: userData.studentIds || [],
          subject: userData.subject,
          qualification: userData.qualification,
        } as TeacherProfile;
        break;

      case 'parent':
        profile = {
          ...baseProfile,
          role: 'parent',
          childrenIds: userData.childrenIds || [],
          phoneNumber: userData.phoneNumber,
          address: userData.address,
        } as ParentProfile;
        break;

      case 'school':
        profile = {
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
        break;

      default:
        throw new Error('Invalid user role');
    }

    return { user: userCredential.user, role, profile };
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Login with displayName/email & password (alternative login method)
export const loginWithIdentifierService = async (
  identifier: string, // This can be either display name or email
  password: string
): Promise<{ user: User; role: string; profile: UserProfile }> => {
  let email = identifier;

  try {
    // If the identifier is not an email, treat it as a display name
    if (!identifier.includes('@')) {
      const q = query(
        collection(db, 'users'),
        where('displayName', '==', identifier)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        email = querySnapshot.docs[0].data().email;
      } else {
        throw new Error('No user found with the provided display name');
      }
    }

    // Use the regular login service
    return await loginUserService(email, password);
  } catch (error) {
    console.error('Error during identifier login:', error);
    throw error;
  }
};

// Get user role by email (utility function)
export const getUserRoleByEmailService = async (
  email: string
): Promise<string | null> => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().role || null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user role by email:', error);
    throw new Error('Failed to fetch user role');
  }
};

// Update user profile service (with role validation)
export const updateUserProfileService = async (
  uid: string,
  updatedData: Partial<UserProfile>
): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('Unauthorized or no user authenticated');
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updatedData,
      updatedAt: new Date(),
    });
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

// Check if user exists by email
export const checkUserExistsByEmailService = async (
  email: string
): Promise<boolean> => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw new Error('Failed to check user existence');
  }
};

// Get all schools (for dropdowns in registration)
export const getAllSchoolsService = async (): Promise<SchoolProfile[]> => {
  try {
    const schoolsRef = collection(db, 'users');
    const q = query(schoolsRef, where('role', '==', 'school'));
    const querySnapshot = await getDocs(q);

    const schools: SchoolProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      schools.push({
        ...data,
        uid: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SchoolProfile);
    });

    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw new Error('Failed to fetch schools');
  }
};
