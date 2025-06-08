import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getLeaderBoardService,
  getSchoolLeaderBoardService,
  getClassLeaderBoardService,
  getTeacherStudentsLeaderBoardService,
  getParentChildrenLeaderBoardService,
  updateLeaderBoardService,
  getStudentAnalyticsService,
  getClassPerformanceSummaryService,
  LeaderBoardEntry,
} from '../../services/leaderBoardService';

interface StudentAnalytics {
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
}

interface ClassPerformanceSummary {
  totalStudents: number;
  averageScore: number;
  averageTimePlayed: number;
  topPerformers: LeaderBoardEntry[];
  strugglingStudents: LeaderBoardEntry[];
}

interface LeaderBoardState {
  // Different types of leaderboards
  globalLeaderboard: LeaderBoardEntry[];
  schoolLeaderboard: LeaderBoardEntry[];
  classLeaderboard: LeaderBoardEntry[];
  teacherStudentsLeaderboard: LeaderBoardEntry[];
  parentChildrenLeaderboard: LeaderBoardEntry[];

  // Analytics data
  studentAnalytics: StudentAnalytics | null;
  classPerformanceSummary: ClassPerformanceSummary | null;

  // Loading states for different operations
  loading: {
    global: boolean;
    school: boolean;
    class: boolean;
    teacher: boolean;
    parent: boolean;
    analytics: boolean;
    classPerformance: boolean;
    update: boolean;
  };

  // Error states
  error: string | null;
}

const initialState: LeaderBoardState = {
  globalLeaderboard: [],
  schoolLeaderboard: [],
  classLeaderboard: [],
  teacherStudentsLeaderboard: [],
  parentChildrenLeaderboard: [],
  studentAnalytics: null,
  classPerformanceSummary: null,
  loading: {
    global: false,
    school: false,
    class: false,
    teacher: false,
    parent: false,
    analytics: false,
    classPerformance: false,
    update: false,
  },
  error: null,
};

// Async thunk to fetch global leaderboard by year
export const getGlobalLeaderBoard = createAsyncThunk(
  'leaderboard/getGlobalLeaderBoard',
  async (year: number, thunkAPI) => {
    try {
      const leaderboard = await getLeaderBoardService(year);
      return leaderboard;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching global leaderboard');
    }
  }
);

// Async thunk to fetch school leaderboard
export const getSchoolLeaderBoard = createAsyncThunk(
  'leaderboard/getSchoolLeaderBoard',
  async ({ schoolId, year }: { schoolId: string; year?: number }, thunkAPI) => {
    try {
      const leaderboard = await getSchoolLeaderBoardService(schoolId, year);
      return leaderboard;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching school leaderboard');
    }
  }
);

// Async thunk to fetch class leaderboard
export const getClassLeaderBoard = createAsyncThunk(
  'leaderboard/getClassLeaderBoard',
  async (classId: string, thunkAPI) => {
    try {
      const leaderboard = await getClassLeaderBoardService(classId);
      return leaderboard;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching class leaderboard');
    }
  }
);

// Async thunk to fetch teacher's students leaderboard
export const getTeacherStudentsLeaderBoard = createAsyncThunk(
  'leaderboard/getTeacherStudentsLeaderBoard',
  async (teacherId: string, thunkAPI) => {
    try {
      const leaderboard = await getTeacherStudentsLeaderBoardService(teacherId);
      return leaderboard;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Error fetching teacher students leaderboard'
      );
    }
  }
);

// Async thunk to fetch parent's children leaderboard
export const getParentChildrenLeaderBoard = createAsyncThunk(
  'leaderboard/getParentChildrenLeaderBoard',
  async (parentId: string, thunkAPI) => {
    try {
      const leaderboard = await getParentChildrenLeaderBoardService(parentId);
      return leaderboard;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Error fetching parent children leaderboard'
      );
    }
  }
);

// Async thunk to get student analytics
export const getStudentAnalytics = createAsyncThunk(
  'leaderboard/getStudentAnalytics',
  async (studentId: string, thunkAPI) => {
    try {
      const analytics = await getStudentAnalyticsService(studentId);
      return analytics;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching student analytics');
    }
  }
);

// Async thunk to get class performance summary
export const getClassPerformanceSummary = createAsyncThunk(
  'leaderboard/getClassPerformanceSummary',
  async (classId: string, thunkAPI) => {
    try {
      const summary = await getClassPerformanceSummaryService(classId);
      return summary;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Error fetching class performance summary'
      );
    }
  }
);

// Async thunk to update leaderboard for a specific user
export const updateLeaderBoard = createAsyncThunk(
  'leaderboard/updateLeaderBoard',
  async (
    {
      uid,
      updatedData,
    }: { uid: string; updatedData: Partial<LeaderBoardEntry> },
    thunkAPI
  ) => {
    try {
      await updateLeaderBoardService(uid, updatedData);
      return { uid, updatedData };
    } catch (error) {
      return thunkAPI.rejectWithValue('Error updating leaderboard');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.studentAnalytics = null;
    },
    clearClassPerformance: (state) => {
      state.classPerformanceSummary = null;
    },
    resetLeaderboards: (state) => {
      state.globalLeaderboard = [];
      state.schoolLeaderboard = [];
      state.classLeaderboard = [];
      state.teacherStudentsLeaderboard = [];
      state.parentChildrenLeaderboard = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Global Leaderboard
      .addCase(getGlobalLeaderBoard.pending, (state) => {
        state.loading.global = true;
        state.error = null;
      })
      .addCase(getGlobalLeaderBoard.fulfilled, (state, action) => {
        state.globalLeaderboard = action.payload;
        state.loading.global = false;
      })
      .addCase(getGlobalLeaderBoard.rejected, (state, action) => {
        state.loading.global = false;
        state.error = action.payload as string;
      })

      // School Leaderboard
      .addCase(getSchoolLeaderBoard.pending, (state) => {
        state.loading.school = true;
        state.error = null;
      })
      .addCase(getSchoolLeaderBoard.fulfilled, (state, action) => {
        state.schoolLeaderboard = action.payload;
        state.loading.school = false;
      })
      .addCase(getSchoolLeaderBoard.rejected, (state, action) => {
        state.loading.school = false;
        state.error = action.payload as string;
      })

      // Class Leaderboard
      .addCase(getClassLeaderBoard.pending, (state) => {
        state.loading.class = true;
        state.error = null;
      })
      .addCase(getClassLeaderBoard.fulfilled, (state, action) => {
        state.classLeaderboard = action.payload;
        state.loading.class = false;
      })
      .addCase(getClassLeaderBoard.rejected, (state, action) => {
        state.loading.class = false;
        state.error = action.payload as string;
      })

      // Teacher Students Leaderboard
      .addCase(getTeacherStudentsLeaderBoard.pending, (state) => {
        state.loading.teacher = true;
        state.error = null;
      })
      .addCase(getTeacherStudentsLeaderBoard.fulfilled, (state, action) => {
        state.teacherStudentsLeaderboard = action.payload;
        state.loading.teacher = false;
      })
      .addCase(getTeacherStudentsLeaderBoard.rejected, (state, action) => {
        state.loading.teacher = false;
        state.error = action.payload as string;
      })

      // Parent Children Leaderboard
      .addCase(getParentChildrenLeaderBoard.pending, (state) => {
        state.loading.parent = true;
        state.error = null;
      })
      .addCase(getParentChildrenLeaderBoard.fulfilled, (state, action) => {
        state.parentChildrenLeaderboard = action.payload;
        state.loading.parent = false;
      })
      .addCase(getParentChildrenLeaderBoard.rejected, (state, action) => {
        state.loading.parent = false;
        state.error = action.payload as string;
      })

      // Student Analytics
      .addCase(getStudentAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.error = null;
      })
      .addCase(getStudentAnalytics.fulfilled, (state, action) => {
        state.studentAnalytics = action.payload;
        state.loading.analytics = false;
      })
      .addCase(getStudentAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.error = action.payload as string;
      })

      // Class Performance Summary
      .addCase(getClassPerformanceSummary.pending, (state) => {
        state.loading.classPerformance = true;
        state.error = null;
      })
      .addCase(getClassPerformanceSummary.fulfilled, (state, action) => {
        state.classPerformanceSummary = action.payload;
        state.loading.classPerformance = false;
      })
      .addCase(getClassPerformanceSummary.rejected, (state, action) => {
        state.loading.classPerformance = false;
        state.error = action.payload as string;
      })

      // Update Leaderboard
      .addCase(updateLeaderBoard.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateLeaderBoard.fulfilled, (state, action) => {
        state.loading.update = false;
        const { uid, updatedData } = action.payload;

        // Helper function to update leaderboard entries
        const updateLeaderboardEntry = (leaderboard: LeaderBoardEntry[]) => {
          const index = leaderboard.findIndex((entry) => entry.uid === uid);
          if (index !== -1) {
            leaderboard[index] = {
              ...leaderboard[index],
              ...updatedData,
            };
          }
        };

        // Update all relevant leaderboards
        updateLeaderboardEntry(state.globalLeaderboard);
        updateLeaderboardEntry(state.schoolLeaderboard);
        updateLeaderboardEntry(state.classLeaderboard);
        updateLeaderboardEntry(state.teacherStudentsLeaderboard);
        updateLeaderboardEntry(state.parentChildrenLeaderboard);

        // Update analytics if it contains the same student
        if (
          state.studentAnalytics &&
          state.studentAnalytics.overallStats.uid === uid
        ) {
          state.studentAnalytics.overallStats = {
            ...state.studentAnalytics.overallStats,
            ...updatedData,
          };
        }
      })
      .addCase(updateLeaderBoard.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearAnalytics,
  clearClassPerformance,
  resetLeaderboards,
} = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
