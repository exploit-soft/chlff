// import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import {
//   loginUserService,
//   registerUserService,
//   loginWithIdentifierService,
//   updateUserProfileService,
//   RegistrationData,
// } from '../../services/authService';
// import { UserProfile } from '../../services/userService';
// import { FirebaseError } from 'firebase/app';

// // Define a more specific type for errors
// type AppError = FirebaseError | Error;

// interface AuthState {
//   user: {
//     uid: string;
//     displayName: string | null;
//     email: string | null;
//   } | null;
//   userProfile: UserProfile | null;
//   role: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   userProfile: null,
//   role: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// };

// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async (registrationData: RegistrationData, thunkAPI) => {
//     try {
//       const user = await registerUserService(registrationData);
//       return {
//         user: {
//           uid: user.uid,
//           displayName: user.displayName,
//           email: user.email,
//         },
//         role: registrationData.role,
//       };
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (
//     { email, password }: { email: string; password: string },
//     thunkAPI
//   ) => {
//     try {
//       const { user, role, profile } = await loginUserService(email, password);
//       return {
//         user: {
//           uid: user.uid,
//           displayName: user.displayName,
//           email: user.email,
//         },
//         role,
//         profile,
//       };
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// export const loginWithIdentifier = createAsyncThunk(
//   'auth/loginWithIdentifier',
//   async (
//     { identifier, password }: { identifier: string; password: string },
//     thunkAPI
//   ) => {
//     try {
//       const { user, role, profile } = await loginWithIdentifierService(
//         identifier,
//         password
//       );
//       return {
//         user: {
//           uid: user.uid,
//           displayName: user.displayName,
//           email: user.email,
//         },
//         role,
//         profile,
//       };
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// export const updateUserProfile = createAsyncThunk(
//   'auth/updateUserProfile',
//   async (
//     { uid, updatedData }: { uid: string; updatedData: Partial<UserProfile> },
//     thunkAPI
//   ) => {
//     try {
//       await updateUserProfileService(uid, updatedData);
//       return updatedData;
//     } catch (error) {
//       const typedError = error as AppError;
//       return thunkAPI.rejectWithValue(typedError.message);
//     }
//   }
// );

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     toggleAuth(state, action: PayloadAction<boolean>) {
//       state.isAuthenticated = action.payload;
//     },
//     logout(state) {
//       state.user = null;
//       state.userProfile = null;
//       state.role = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('authUser');
//     },
//     setUser(
//       state,
//       action: PayloadAction<{ user: any; role: string; profile?: UserProfile }>
//     ) {
//       state.user = action.payload.user;
//       state.role = action.payload.role;
//       if (action.payload.profile) {
//         state.userProfile = action.payload.profile;
//       }
//     },
//     setUserProfile(state, action: PayloadAction<UserProfile>) {
//       state.userProfile = action.payload;
//     },
//     clearError(state) {
//       state.error = null;
//     },
//     getUserFromStorage(state) {
//       const authUser = localStorage.getItem('authUser') || null;
//       if (authUser) {
//         const { user, role, profile } = JSON.parse(authUser);
//         state.isAuthenticated = true;
//         state.user = user;
//         state.role = role;
//         state.userProfile = profile || null;
//       } else {
//         state.isAuthenticated = false;
//         state.user = null;
//         state.userProfile = null;
//         state.role = null;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.role = action.payload.role;
//         state.loading = false;
//         state.isAuthenticated = true;
//         // Save to local storage
//         localStorage.setItem(
//           'authUser',
//           JSON.stringify({
//             user: action.payload.user,
//             role: action.payload.role,
//           })
//         );
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.role = action.payload.role;
//         state.userProfile = action.payload.profile;
//         state.loading = false;
//         state.isAuthenticated = true;
//         // Save to local storage
//         localStorage.setItem(
//           'authUser',
//           JSON.stringify({
//             user: action.payload.user,
//             role: action.payload.role,
//             profile: action.payload.profile,
//           })
//         );
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     builder
//       .addCase(loginWithIdentifier.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginWithIdentifier.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.role = action.payload.role;
//         state.userProfile = action.payload.profile;
//         state.loading = false;
//         state.isAuthenticated = true;
//         // Save to local storage
//         localStorage.setItem(
//           'authUser',
//           JSON.stringify({
//             user: action.payload.user,
//             role: action.payload.role,
//             profile: action.payload.profile,
//           })
//         );
//       })
//       .addCase(loginWithIdentifier.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     builder
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         if (state.userProfile) {
//           state.userProfile = {
//             ...state.userProfile,
//             ...action.payload,
//           } as UserProfile;
//         }
//         state.loading = false;
//         // Update local storage
//         const authUser = localStorage.getItem('authUser');
//         if (authUser) {
//           const parsedAuth = JSON.parse(authUser);
//           localStorage.setItem(
//             'authUser',
//             JSON.stringify({
//               ...parsedAuth,
//               profile: state.userProfile,
//             })
//           );
//         }
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const {
//   toggleAuth,
//   logout,
//   setUser,
//   setUserProfile,
//   clearError,
//   getUserFromStorage,
// } = authSlice.actions;

// export default authSlice.reducer;

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserService,
  registerUserService,
  loginWithIdentifierService,
  updateUserProfileService,
  RegistrationData,
} from '../../services/authService';
import { UserProfile } from '../../services/userService';
import { FirebaseError } from 'firebase/app';

// Define a more specific type for errors
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

// Helper function to deserialize ISO strings back to dates
const deserializeDates = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (
    typeof obj === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)
  ) {
    return new Date(obj);
  }
  if (Array.isArray(obj)) return obj.map(deserializeDates);
  if (typeof obj === 'object') {
    const deserialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        deserialized[key] = deserializeDates(obj[key]);
      }
    }
    return deserialized;
  }
  return obj;
};

interface AuthState {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
  } | null;
  userProfile: UserProfile | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userProfile: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (registrationData: RegistrationData, thunkAPI) => {
    try {
      const user = await registerUserService(registrationData);
      return {
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        },
        role: registrationData.role,
      };
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const { user, role, profile } = await loginUserService(email, password);
      return {
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        },
        role,
        profile: serializeDates(profile), // Serialize dates before storing
      };
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

export const loginWithIdentifier = createAsyncThunk(
  'auth/loginWithIdentifier',
  async (
    { identifier, password }: { identifier: string; password: string },
    thunkAPI
  ) => {
    try {
      const { user, role, profile } = await loginWithIdentifierService(
        identifier,
        password
      );
      return {
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        },
        role,
        profile: serializeDates(profile), // Serialize dates before storing
      };
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (
    { uid, updatedData }: { uid: string; updatedData: Partial<UserProfile> },
    thunkAPI
  ) => {
    try {
      await updateUserProfileService(uid, updatedData);
      return serializeDates(updatedData); // Serialize dates before storing
    } catch (error) {
      const typedError = error as AppError;
      return thunkAPI.rejectWithValue(typedError.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleAuth(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    logout(state) {
      state.user = null;
      state.userProfile = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authUser');
    },
    setUser(
      state,
      action: PayloadAction<{ user: any; role: string; profile?: UserProfile }>
    ) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      if (action.payload.profile) {
        state.userProfile = serializeDates(action.payload.profile); // Serialize dates
      }
    },
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.userProfile = serializeDates(action.payload); // Serialize dates
    },
    clearError(state) {
      state.error = null;
    },
    getUserFromStorage(state) {
      try {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          const { user, role, profile } = JSON.parse(authUser);
          state.isAuthenticated = true;
          state.user = user;
          state.role = role;
          // Ensure dates are serialized when loading from storage
          state.userProfile = profile ? serializeDates(profile) : null;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.userProfile = null;
          state.role = null;
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        // Clear corrupted data
        localStorage.removeItem('authUser');
        state.isAuthenticated = false;
        state.user = null;
        state.userProfile = null;
        state.role = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.loading = false;
        state.isAuthenticated = true;
        // Save to local storage with serialized data
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            user: action.payload.user,
            role: action.payload.role,
          })
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.userProfile = action.payload.profile;
        state.loading = false;
        state.isAuthenticated = true;
        // Save to local storage with serialized data
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            user: action.payload.user,
            role: action.payload.role,
            profile: action.payload.profile, // Already serialized
          })
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(loginWithIdentifier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithIdentifier.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.userProfile = action.payload.profile;
        state.loading = false;
        state.isAuthenticated = true;
        // Save to local storage with serialized data
        localStorage.setItem(
          'authUser',
          JSON.stringify({
            user: action.payload.user,
            role: action.payload.role,
            profile: action.payload.profile, // Already serialized
          })
        );
      })
      .addCase(loginWithIdentifier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.userProfile) {
          state.userProfile = {
            ...state.userProfile,
            ...action.payload, // Already serialized
          } as UserProfile;
        }
        state.loading = false;
        // Update local storage with serialized data
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          const parsedAuth = JSON.parse(authUser);
          localStorage.setItem(
            'authUser',
            JSON.stringify({
              ...parsedAuth,
              profile: state.userProfile,
            })
          );
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  toggleAuth,
  logout,
  setUser,
  setUserProfile,
  clearError,
  getUserFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
