import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getTeacherDashboardService,
  getParentDashboardService,
  getSchoolDashboardService,
  TeacherDashboardData,
  ParentDashboardData,
  SchoolDashboardData,
} from '../../services/dashboardService';

// Dashboard State Interface
export interface DashboardState {
  teacherDashboard: {
    data: TeacherDashboardData | null;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
  };
  parentDashboard: {
    data: ParentDashboardData | null;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
  };
  schoolDashboard: {
    data: SchoolDashboardData | null;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
  };
  activeTab: 'overview' | 'students' | 'classes' | 'performance' | 'activity';
  refreshInterval: number; // in milliseconds
}

// Initial State
const initialState: DashboardState = {
  teacherDashboard: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  parentDashboard: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  schoolDashboard: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  activeTab: 'overview',
  refreshInterval: 5 * 60 * 1000, // 5 minutes
};

// Async Thunks
export const fetchTeacherDashboard = createAsyncThunk(
  'dashboard/fetchTeacherDashboard',
  async (teacherId: string, { rejectWithValue }) => {
    try {
      const data = await getTeacherDashboardService(teacherId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch teacher dashboard'
      );
    }
  }
);

export const fetchParentDashboard = createAsyncThunk(
  'dashboard/fetchParentDashboard',
  async (parentId: string, { rejectWithValue }) => {
    try {
      const data = await getParentDashboardService(parentId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch parent dashboard'
      );
    }
  }
);

export const fetchSchoolDashboard = createAsyncThunk(
  'dashboard/fetchSchoolDashboard',
  async (schoolId: string, { rejectWithValue }) => {
    try {
      const data = await getSchoolDashboardService(schoolId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch school dashboard'
      );
    }
  }
);

// Refresh dashboard data based on role
export const refreshDashboard = createAsyncThunk(
  'dashboard/refreshDashboard',
  async (
    { role, id }: { role: 'teacher' | 'parent' | 'school'; id: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      switch (role) {
        case 'teacher':
          return await dispatch(fetchTeacherDashboard(id)).unwrap();
        case 'parent':
          return await dispatch(fetchParentDashboard(id)).unwrap();
        case 'school':
          return await dispatch(fetchSchoolDashboard(id)).unwrap();
        default:
          throw new Error('Invalid role specified');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh dashboard');
    }
  }
);

// Dashboard Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // UI State Management
    setActiveTab: (
      state,
      action: PayloadAction<
        'overview' | 'students' | 'classes' | 'performance' | 'activity'
      >
    ) => {
      state.activeTab = action.payload;
    },

    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },

    // Clear dashboard data
    clearTeacherDashboard: (state) => {
      state.teacherDashboard = {
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
      };
    },

    clearParentDashboard: (state) => {
      state.parentDashboard = {
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
      };
    },

    clearSchoolDashboard: (state) => {
      state.schoolDashboard = {
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
      };
    },

    clearAllDashboards: (state) => {
      state.teacherDashboard = initialState.teacherDashboard;
      state.parentDashboard = initialState.parentDashboard;
      state.schoolDashboard = initialState.schoolDashboard;
      state.activeTab = 'overview';
    },

    // Error handling
    clearTeacherError: (state) => {
      state.teacherDashboard.error = null;
    },

    clearParentError: (state) => {
      state.parentDashboard.error = null;
    },

    clearSchoolError: (state) => {
      state.schoolDashboard.error = null;
    },

    clearAllErrors: (state) => {
      state.teacherDashboard.error = null;
      state.parentDashboard.error = null;
      state.schoolDashboard.error = null;
    },

    // Update individual student data in teacher dashboard
    updateStudentInTeacherDashboard: (
      state,
      action: PayloadAction<{ studentId: string; updates: Partial<any> }>
    ) => {
      if (state.teacherDashboard.data) {
        const studentIndex = state.teacherDashboard.data.students.findIndex(
          (student) => student.uid === action.payload.studentId
        );
        if (studentIndex !== -1) {
          state.teacherDashboard.data.students[studentIndex] = {
            ...state.teacherDashboard.data.students[studentIndex],
            ...action.payload.updates,
          };
        }
      }
    },

    // Update individual child data in parent dashboard
    updateChildInParentDashboard: (
      state,
      action: PayloadAction<{ childId: string; updates: Partial<any> }>
    ) => {
      if (state.parentDashboard.data) {
        const childIndex = state.parentDashboard.data.children.findIndex(
          (child) => child.uid === action.payload.childId
        );
        if (childIndex !== -1) {
          state.parentDashboard.data.children[childIndex] = {
            ...state.parentDashboard.data.children[childIndex],
            ...action.payload.updates,
          };

          // Update performance data
          const { childId, updates } = action.payload;
          if (state.parentDashboard.data.childrenPerformance[childId]) {
            state.parentDashboard.data.childrenPerformance[childId] = {
              ...state.parentDashboard.data.childrenPerformance[childId],
              ...updates,
            };
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Teacher Dashboard
    builder
      .addCase(fetchTeacherDashboard.pending, (state) => {
        state.teacherDashboard.loading = true;
        state.teacherDashboard.error = null;
      })
      .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
        state.teacherDashboard.loading = false;
        state.teacherDashboard.data = action.payload;
        state.teacherDashboard.error = null;
        state.teacherDashboard.lastUpdated = new Date();
      })
      .addCase(fetchTeacherDashboard.rejected, (state, action) => {
        state.teacherDashboard.loading = false;
        state.teacherDashboard.error = action.payload as string;
      })

      // Parent Dashboard
      .addCase(fetchParentDashboard.pending, (state) => {
        state.parentDashboard.loading = true;
        state.parentDashboard.error = null;
      })
      .addCase(fetchParentDashboard.fulfilled, (state, action) => {
        state.parentDashboard.loading = false;
        state.parentDashboard.data = action.payload;
        state.parentDashboard.error = null;
        state.parentDashboard.lastUpdated = new Date();
      })
      .addCase(fetchParentDashboard.rejected, (state, action) => {
        state.parentDashboard.loading = false;
        state.parentDashboard.error = action.payload as string;
      })

      // School Dashboard
      .addCase(fetchSchoolDashboard.pending, (state) => {
        state.schoolDashboard.loading = true;
        state.schoolDashboard.error = null;
      })
      .addCase(fetchSchoolDashboard.fulfilled, (state, action) => {
        state.schoolDashboard.loading = false;
        state.schoolDashboard.data = action.payload;
        state.schoolDashboard.error = null;
        state.schoolDashboard.lastUpdated = new Date();
      })
      .addCase(fetchSchoolDashboard.rejected, (state, action) => {
        state.schoolDashboard.loading = false;
        state.schoolDashboard.error = action.payload as string;
      });
  },
});

// Actions
export const {
  setActiveTab,
  setRefreshInterval,
  clearTeacherDashboard,
  clearParentDashboard,
  clearSchoolDashboard,
  clearAllDashboards,
  clearTeacherError,
  clearParentError,
  clearSchoolError,
  clearAllErrors,
  updateStudentInTeacherDashboard,
  updateChildInParentDashboard,
} = dashboardSlice.actions;

// Selectors
export const selectTeacherDashboard = (state: { dashboard: DashboardState }) =>
  state.dashboard.teacherDashboard;

export const selectParentDashboard = (state: { dashboard: DashboardState }) =>
  state.dashboard.parentDashboard;

export const selectSchoolDashboard = (state: { dashboard: DashboardState }) =>
  state.dashboard.schoolDashboard;

export const selectActiveTab = (state: { dashboard: DashboardState }) =>
  state.dashboard.activeTab;

export const selectRefreshInterval = (state: { dashboard: DashboardState }) =>
  state.dashboard.refreshInterval;

// Computed selectors
export const selectTeacherDashboardStats = (state: {
  dashboard: DashboardState;
}) => {
  const data = state.dashboard.teacherDashboard.data;
  if (!data) return null;

  return {
    totalStudents: data.totalStudents,
    totalClasses: data.totalClasses,
    averageScore:
      data.students.length > 0
        ? data.students.reduce((sum, s) => sum + s.assessmentScore, 0) /
          data.students.length
        : 0,
    totalTimePlayed: data.students.reduce(
      (sum, s) => sum + s.totalTimePlayed,
      0
    ),
    topPerformer: data.recentActivity.topPerformers[0] || null,
  };
};

export const selectParentDashboardStats = (state: {
  dashboard: DashboardState;
}) => {
  const data = state.dashboard.parentDashboard.data;
  if (!data) return null;

  const totalChildren = data.children.length;
  const activeChildren = data.children.filter(
    (child) => child.totalTimePlayed > 0
  ).length;

  return {
    totalChildren,
    activeChildren,
    ...data.overallProgress,
    topPerformer:
      data.children.sort(
        (a, b) => b.totalSuccessfulMissions - a.totalSuccessfulMissions
      )[0] || null,
  };
};

export const selectSchoolDashboardStats = (state: {
  dashboard: DashboardState;
}) => {
  const data = state.dashboard.schoolDashboard.data;
  if (!data) return null;

  return {
    totalTeachers: data.totalTeachers,
    totalStudents: data.totalStudents,
    totalParents: data.totalParents,
    totalClasses: data.totalClasses,
    ...data.schoolPerformance,
    activeUsers: data.students.filter((s) => s.totalTimePlayed > 0).length,
    topClass: data.schoolPerformance.topPerformingClasses[0] || null,
  };
};

// Check if dashboard data needs refresh (based on last updated time)
export const selectNeedsRefresh = (
  state: { dashboard: DashboardState },
  dashboardType: 'teacher' | 'parent' | 'school'
) => {
  const dashboard = state.dashboard[`${dashboardType}Dashboard`];
  if (!dashboard.lastUpdated) return true;

  const now = new Date().getTime();
  const lastUpdated = new Date(dashboard.lastUpdated).getTime();
  const refreshInterval = state.dashboard.refreshInterval;

  return now - lastUpdated > refreshInterval;
};

export default dashboardSlice.reducer;
