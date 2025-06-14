// // import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// // import { FirebaseError } from 'firebase/app';
// // import {
// //   getUserProfileService,
// //   updateUserProfileService,
// //   UserProfile,
// // } from '../../services/userService';

// // type AppError = FirebaseError | Error;

// // interface UserState {
// //   user: UserProfile | null;
// //   loading: boolean;
// //   error: string | null;
// // }

// // const initialState: UserState = {
// //   user: null,
// //   loading: false,
// //   error: null,
// // };

// // export const getUserProfile = createAsyncThunk(
// //   'user/getUserProfile',
// //   async (_, thunkAPI) => {
// //     try {
// //       const userProfile = await getUserProfileService();
// //       if (!userProfile) {
// //         throw new Error('User profile not found');
// //       }
// //       // console.log('The User Profile: ', userProfile);
// //       return userProfile;
// //     } catch (error) {
// //       const typedError = error as AppError;
// //       return thunkAPI.rejectWithValue(typedError.message);
// //     }
// //   }
// // );

// // export const updateUserProfile = createAsyncThunk(
// //   'user/updateUserProfile',
// //   async (
// //     { uid, updatedData }: { uid: string; updatedData: Partial<UserProfile> },
// //     thunkAPI
// //   ) => {
// //     try {
// //       await updateUserProfileService(uid, updatedData);
// //       const updatedProfile = await getUserProfileService(); // Fetch updated profile
// //       if (!updatedProfile) {
// //         throw new Error('Updated user profile not found');
// //       }
// //       return updatedProfile;
// //     } catch (error) {
// //       const typedError = error as AppError;
// //       return thunkAPI.rejectWithValue(typedError.message);
// //     }
// //   }
// // );

// // const soundSlice = createSlice({
// //   name: 'user',
// //   initialState,
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(getUserProfile.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(getUserProfile.fulfilled, (state, action) => {
// //         state.user = action.payload;
// //         state.loading = false;
// //       })
// //       .addCase(getUserProfile.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       })

// //       // updateUserProfile
// //       .addCase(updateUserProfile.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(updateUserProfile.fulfilled, (state, action) => {
// //         state.user = action.payload;
// //         state.loading = false;
// //       })
// //       .addCase(updateUserProfile.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       });
// //   },
// // });

// // export default soundSlice.reducer;

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { FirebaseError } from 'firebase/app';
// import {
//   getUserProfileService,
//   updateUserProfileService,
//   getStudentsByTeacherService,
//   getChildrenByParentService,
//   getUsersBySchoolService,
//   createClassService,
//   getClassesBySchoolService,
//   assignStudentToClassService,
//   linkParentToChildService,
//   unlockItemService,
//   UserProfile,
//   StudentProfile,
//   TeacherProfile,
//   ParentProfile,
//   SchoolProfile,
//   ClassData,
// } from '../../services/userService';

// type AppError = FirebaseError | Error;

// interface UserState {
//   user: UserProfile | null;
//   students: StudentProfile[];
//   children: StudentProfile[];
//   schoolUsers: {
//     teachers: TeacherProfile[];
//     students: StudentProfile[];
//     parents: ParentProfile[];
//   };
//   classes: ClassData[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: UserState = {
//   user: null,
//   students: [],
//   children: [],
//   schoolUsers: {
//     teachers: [],
//     students: [],
//     parents: [],
//   },
//   classes: [],
//   loading: false,
//   error: null,
// };

// // Get user profile
// export const getUserProfile = createAsyncThunk(
//   'user/getUserProfile',
//   async (_, thunkAPI) => {
//     try {
//       const userProfile = await getUserProfileService();
//       if (!userProfile) {
//         throw new Error('User profile not found');
//       }
//       return userProfile;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Update user profile
// export const updateUserProfile = createAsyncThunk(
//   'user/updateUserProfile',
//   async (
//     { uid, updatedData }: { uid: string; updatedData: Partial<UserProfile> },
//     thunkAPI
//   ) => {
//     try {
//       await updateUserProfileService(uid, updatedData);
//       const updatedProfile = await getUserProfileService();
//       if (!updatedProfile) {
//         throw new Error('Updated user profile not found');
//       }
//       return updatedProfile;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Get students by teacher
// export const getStudentsByTeacher = createAsyncThunk(
//   'user/getStudentsByTeacher',
//   async (teacherId: string, thunkAPI) => {
//     try {
//       const students = await getStudentsByTeacherService(teacherId);
//       return students;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Get children by parent
// export const getChildrenByParent = createAsyncThunk(
//   'user/getChildrenByParent',
//   async (parentId: string, thunkAPI) => {
//     try {
//       const children = await getChildrenByParentService(parentId);
//       return children;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Get users by school
// export const getUsersBySchool = createAsyncThunk(
//   'user/getUsersBySchool',
//   async (schoolId: string, thunkAPI) => {
//     try {
//       const schoolUsers = await getUsersBySchoolService(schoolId);
//       return schoolUsers;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Create class
// export const createClass = createAsyncThunk(
//   'user/createClass',
//   async (
//     classData: Omit<ClassData, 'id' | 'createdAt' | 'updatedAt'>,
//     thunkAPI
//   ) => {
//     try {
//       const classId = await createClassService(classData);
//       return {
//         ...classData,
//         id: classId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Get classes by school
// export const getClassesBySchool = createAsyncThunk(
//   'user/getClassesBySchool',
//   async (schoolId: string, thunkAPI) => {
//     try {
//       const classes = await getClassesBySchoolService(schoolId);
//       return classes;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Assign student to class
// export const assignStudentToClass = createAsyncThunk(
//   'user/assignStudentToClass',
//   async (
//     { studentId, classId }: { studentId: string; classId: string },
//     thunkAPI
//   ) => {
//     try {
//       await assignStudentToClassService(studentId, classId);
//       return { studentId, classId };
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Link parent to child
// export const linkParentToChild = createAsyncThunk(
//   'user/linkParentToChild',
//   async (
//     { parentId, childId }: { parentId: string; childId: string },
//     thunkAPI
//   ) => {
//     try {
//       await linkParentToChildService(parentId, childId);
//       return { parentId, childId };
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// // Unlock item
// export const unlockItem = createAsyncThunk(
//   'user/unlockItem',
//   async (
//     {
//       uid,
//       characterName,
//       itemId,
//     }: { uid: string; characterName: string; itemId: number },
//     thunkAPI
//   ) => {
//     try {
//       await unlockItemService(uid, characterName, itemId);
//       // Fetch updated profile to reflect the changes
//       const updatedProfile = await getUserProfileService();
//       if (!updatedProfile) {
//         throw new Error('Updated user profile not found');
//       }
//       return updatedProfile;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearStudents: (state) => {
//       state.students = [];
//     },
//     clearChildren: (state) => {
//       state.children = [];
//     },
//     clearSchoolUsers: (state) => {
//       state.schoolUsers = {
//         teachers: [],
//         students: [],
//         parents: [],
//       };
//     },
//     clearClasses: (state) => {
//       state.classes = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // getUserProfile
//       .addCase(getUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserProfile.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.loading = false;
//       })
//       .addCase(getUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // updateUserProfile
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.loading = false;
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // getStudentsByTeacher
//       .addCase(getStudentsByTeacher.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getStudentsByTeacher.fulfilled, (state, action) => {
//         state.students = action.payload;
//         state.loading = false;
//       })
//       .addCase(getStudentsByTeacher.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // getChildrenByParent
//       .addCase(getChildrenByParent.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getChildrenByParent.fulfilled, (state, action) => {
//         state.children = action.payload;
//         state.loading = false;
//       })
//       .addCase(getChildrenByParent.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // getUsersBySchool
//       .addCase(getUsersBySchool.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUsersBySchool.fulfilled, (state, action) => {
//         state.schoolUsers = action.payload;
//         state.loading = false;
//       })
//       .addCase(getUsersBySchool.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // createClass
//       .addCase(createClass.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createClass.fulfilled, (state, action) => {
//         state.classes.push(action.payload);
//         state.loading = false;
//       })
//       .addCase(createClass.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // getClassesBySchool
//       .addCase(getClassesBySchool.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getClassesBySchool.fulfilled, (state, action) => {
//         state.classes = action.payload;
//         state.loading = false;
//       })
//       .addCase(getClassesBySchool.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // assignStudentToClass
//       .addCase(assignStudentToClass.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(assignStudentToClass.fulfilled, (state, action) => {
//         // Update the class's studentIds array
//         const { studentId, classId } = action.payload;
//         const classIndex = state.classes.findIndex((cls) => cls.id === classId);
//         if (classIndex !== -1) {
//           if (!state.classes[classIndex].studentIds.includes(studentId)) {
//             state.classes[classIndex].studentIds.push(studentId);
//           }
//         }
//         state.loading = false;
//       })
//       .addCase(assignStudentToClass.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // linkParentToChild
//       .addCase(linkParentToChild.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(linkParentToChild.fulfilled, (state, action) => {
//         // You might want to update local state here if needed
//         state.loading = false;
//       })
//       .addCase(linkParentToChild.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // unlockItem
//       .addCase(unlockItem.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(unlockItem.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.loading = false;
//       })
//       .addCase(unlockItem.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const {
//   clearError,
//   clearStudents,
//   clearChildren,
//   clearSchoolUsers,
//   clearClasses,
// } = userSlice.actions;

// export default userSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FirebaseError } from 'firebase/app';
import {
  getUserProfileService,
  updateUserProfileService,
  getStudentsByTeacherService,
  getChildrenByParentService,
  getUsersBySchoolService,
  createClassService,
  getClassesBySchoolService,
  assignStudentToClassService,
  linkParentToChildService,
  unlockItemService,
  UserProfile,
  StudentProfile,
  TeacherProfile,
  ParentProfile,
  SchoolProfile,
  ClassData,
} from '../../services/userService';

type AppError = FirebaseError | Error;

// Helper function to serialize dates to ISO strings
const serializeDates = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serializeDates);
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serializeDates(obj[key]);
      }
    }
    return serialized;
  }
  return obj;
};

interface UserState {
  user: UserProfile | null;
  students: StudentProfile[];
  children: StudentProfile[];
  schoolUsers: {
    teachers: TeacherProfile[];
    students: StudentProfile[];
    parents: ParentProfile[];
  };
  classes: ClassData[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  students: [],
  children: [],
  schoolUsers: {
    teachers: [],
    students: [],
    parents: [],
  },
  classes: [],
  loading: false,
  error: null,
};

// Get user profile
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, thunkAPI) => {
    try {
      const userProfile = await getUserProfileService();
      if (!userProfile) {
        throw new Error('User profile not found');
      }
      return serializeDates(userProfile); // Serialize dates
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (
    { uid, updatedData }: { uid: string; updatedData: Partial<UserProfile> },
    thunkAPI
  ) => {
    try {
      await updateUserProfileService(uid, updatedData);
      const updatedProfile = await getUserProfileService();
      if (!updatedProfile) {
        throw new Error('Updated user profile not found');
      }
      return serializeDates(updatedProfile); // Serialize dates
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Get students by teacher
export const getStudentsByTeacher = createAsyncThunk(
  'user/getStudentsByTeacher',
  async (teacherId: string, thunkAPI) => {
    try {
      const students = await getStudentsByTeacherService(teacherId);
      return serializeDates(students); // Serialize dates
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Get children by parent
export const getChildrenByParent = createAsyncThunk(
  'user/getChildrenByParent',
  async (parentId: string, thunkAPI) => {
    try {
      const children = await getChildrenByParentService(parentId);
      return serializeDates(children); // Serialize dates
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Get users by school
export const getUsersBySchool = createAsyncThunk(
  'user/getUsersBySchool',
  async (schoolId: string, thunkAPI) => {
    try {
      const schoolUsers = await getUsersBySchoolService(schoolId);
      return serializeDates(schoolUsers); // Serialize dates
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Create class
export const createClass = createAsyncThunk(
  'user/createClass',
  async (
    classData: Omit<ClassData, 'id' | 'createdAt' | 'updatedAt'>,
    thunkAPI
  ) => {
    try {
      const classId = await createClassService(classData);
      const newClass = {
        ...classData,
        id: classId,
        createdAt: new Date().toISOString(), // Store as ISO string
        updatedAt: new Date().toISOString(), // Store as ISO string
      };
      return newClass;
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Get classes by school
export const getClassesBySchool = createAsyncThunk(
  'user/getClassesBySchool',
  async (schoolId: string, thunkAPI) => {
    try {
      const classes = await getClassesBySchoolService(schoolId);
      return serializeDates(classes); // Serialize dates
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Assign student to class
export const assignStudentToClass = createAsyncThunk(
  'user/assignStudentToClass',
  async (
    { studentId, classId }: { studentId: string; classId: string },
    thunkAPI
  ) => {
    try {
      await assignStudentToClassService(studentId, classId);
      return { studentId, classId };
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Link parent to child
export const linkParentToChild = createAsyncThunk(
  'user/linkParentToChild',
  async (
    { parentId, childId }: { parentId: string; childId: string },
    thunkAPI
  ) => {
    try {
      await linkParentToChildService(parentId, childId);
      return { parentId, childId };
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

// Unlock item
export const unlockItem = createAsyncThunk(
  'user/unlockItem',
  async (
    {
      uid,
      characterName,
      itemId,
    }: { uid: string; characterName: string; itemId: number },
    thunkAPI
  ) => {
    try {
      await unlockItemService(uid, characterName, itemId);
      // Fetch updated profile to reflect the changes
      const updatedProfile = await getUserProfileService();
      if (!updatedProfile) {
        throw new Error('Updated user profile not found');
      }
      return serializeDates(updatedProfile); // Serialize dates
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStudents: (state) => {
      state.students = [];
    },
    clearChildren: (state) => {
      state.children = [];
    },
    clearSchoolUsers: (state) => {
      state.schoolUsers = {
        teachers: [],
        students: [],
        parents: [],
      };
    },
    clearClasses: (state) => {
      state.classes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload; // Already serialized
        state.loading = false;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload; // Already serialized
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getStudentsByTeacher
      .addCase(getStudentsByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentsByTeacher.fulfilled, (state, action) => {
        state.students = action.payload; // Already serialized
        state.loading = false;
      })
      .addCase(getStudentsByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getChildrenByParent
      .addCase(getChildrenByParent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChildrenByParent.fulfilled, (state, action) => {
        state.children = action.payload; // Already serialized
        state.loading = false;
      })
      .addCase(getChildrenByParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUsersBySchool
      .addCase(getUsersBySchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersBySchool.fulfilled, (state, action) => {
        state.schoolUsers = action.payload; // Already serialized
        state.loading = false;
      })
      .addCase(getUsersBySchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createClass
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.classes.push(action.payload); // Already serialized
        state.loading = false;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getClassesBySchool
      .addCase(getClassesBySchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClassesBySchool.fulfilled, (state, action) => {
        state.classes = action.payload; // Already serialized
        state.loading = false;
      })
      .addCase(getClassesBySchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // assignStudentToClass
      .addCase(assignStudentToClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignStudentToClass.fulfilled, (state, action) => {
        // Update the class's studentIds array
        const { studentId, classId } = action.payload;
        const classIndex = state.classes.findIndex((cls) => cls.id === classId);
        if (classIndex !== -1) {
          if (!state.classes[classIndex].studentIds.includes(studentId)) {
            state.classes[classIndex].studentIds.push(studentId);
          }
        }
        state.loading = false;
      })
      .addCase(assignStudentToClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // linkParentToChild
      .addCase(linkParentToChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(linkParentToChild.fulfilled, (state, action) => {
        // You might want to update local state here if needed
        state.loading = false;
      })
      .addCase(linkParentToChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // unlockItem
      .addCase(unlockItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlockItem.fulfilled, (state, action) => {
        state.user = action.payload; // Already serialized
        state.loading = false;
      })
      .addCase(unlockItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearStudents,
  clearChildren,
  clearSchoolUsers,
  clearClasses,
} = userSlice.actions;

export default userSlice.reducer;
