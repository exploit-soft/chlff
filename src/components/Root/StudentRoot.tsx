import classes from './Root.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import CongratulationModal from '../Modals/CongratulationModal/CongratulationModal';
import Header from '../Layout/Header/Header';
import SelectAssessmentYear from '../Modals/AssessmentYearModal/AssessmentYearModal';
import GameModeModal from '../Modals/GameModeModal/GameModeModal';
import SelectGame from '../Modals/SelectGame/SelectGame';
import SelectGenderModal from '../Modals/SelectGenderModal/SelectGenderModal';
import Footer from '../Layout/Footer/Footer';
import LeaderBoardInfoModal from '../Modals/LeaderBoardInfoModal/LeaderBoardInfoModal';
import SoundSettingModal from '../Modals/SoundSettingModal/SoundSettingModal';
import LogoutConfirmModal from '../Modals/LogoutConfirmModal/LogoutConfirmModal';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  getUserProfile,
  clearError as clearUserError,
} from '../../features/user/userSlice';
import {
  logout,
  getUserFromStorage,
  clearError as clearAuthError,
  setUser,
} from '../../features/auth/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../configs/firebase';
import { _useAudio } from '../../hook/_useAudio';

const StudentRoot: React.FC = () => {
  const dispatch = useAppDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  // Redux state
  const {
    user: authUser,
    userProfile,
    role,
    isAuthenticated,
    loading: authStateLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const {
    user: userProfileData,
    loading: userLoading,
    error: userError,
  } = useAppSelector((state) => state.user);

  const location = useLocation();

  // Check the current route array
  const shouldShowBanner = [
    '/assessment',
    '/action-center',
    '/fishing',
    '/car-race',
  ].includes(location.pathname);

  // Initialize auth from localStorage on app start
  useEffect(() => {
    dispatch(getUserFromStorage());
  }, [dispatch]);

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is authenticated
          if (!isAuthenticated) {
            // Set user in auth state if not already set
            dispatch(
              setUser({
                user: {
                  uid: firebaseUser.uid,
                  displayName: firebaseUser.displayName,
                  email: firebaseUser.email,
                },
                role: role || 'student', // Default role if not set
              })
            );
          }

          // Fetch user profile if not already loaded
          if (!userProfile && !userProfileData) {
            try {
              await dispatch(getUserProfile());
            } catch (error) {
              console.error('Failed to fetch user profile:', error);
              // Clear any user-related errors after logging
              setTimeout(() => {
                dispatch(clearUserError());
              }, 3000);
            }
          }
        } else {
          // No user authenticated
          console.log('No user is currently authenticated');
          dispatch(logout());
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch, isAuthenticated, userProfile, userProfileData, role]);

  // Clear errors after some time
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        dispatch(clearAuthError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, dispatch]);

  useEffect(() => {
    if (userError) {
      const timer = setTimeout(() => {
        dispatch(clearUserError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userError, dispatch]);

  // Initialize audio
  _useAudio();

  // Show loading while checking authentication
  if (authLoading || authStateLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
          <p className='text-black'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if there's a critical auth error
  if (authError && !isAuthenticated) {
    return (
      <div className={classes.errorContainer}>
        <div>Authentication Error: {authError}</div>
        <button onClick={() => dispatch(clearAuthError())}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className={classes.root}>
        {/* Header - only show if authenticated */}
        {isAuthenticated && <Header />}

        {/* Main content */}
        <main className='bg-white'>
          <Outlet />
        </main>

        {/* Footer - only show if authenticated */}
        {isAuthenticated && <Footer />}
      </div>

      {/* Modals */}
      <CongratulationModal />
      <SelectAssessmentYear />
      <GameModeModal />
      <SelectGame />
      <SelectGenderModal />
      <LeaderBoardInfoModal />
      <SoundSettingModal />
      <LogoutConfirmModal />

      {/* Error notifications */}
      {(authError || userError) && (
        <div className={classes.errorNotification}>
          {authError && <div>Auth Error: {authError}</div>}
          {userError && <div>User Error: {userError}</div>}
        </div>
      )}
    </>
  );
};

export default StudentRoot;
