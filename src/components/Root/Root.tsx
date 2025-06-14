// import classes from './Root.module.css';
// import { Outlet, useLocation } from 'react-router-dom';
// import CongratulationModal from '../Modals/CongratulationModal/CongratulationModal';
// import Header from '../Layout/Header/Header';
// import SelectAssessmentYear from '../Modals/AssessmentYearModal/AssessmentYearModal';
// import GameModeModal from '../Modals/GameModeModal/GameModeModal';
// import SelectGame from '../Modals/SelectGame/SelectGame';
// import SelectGenderModal from '../Modals/SelectGenderModal/SelectGenderModal';
// import Footer from '../Layout/Footer/Footer';
// import LeaderBoardInfoModal from '../Modals/LeaderBoardInfoModal/LeaderBoardInfoModal';
// import { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { getUserProfile } from '../../features/user/userSlice';
// import SoundSettingModal from '../Modals/SoundSettingModal/SoundSettingModal';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../../configs/firebase';
// import { getGlobalLeaderBoard } from '../../features/leaderBoard/leaderBoardSlice';
// import { logout } from '../../features/auth/authSlice';
// import Overlay from '../Shared/Overlay/Overlay';
// import LogoutConfirmModal from '../Modals/LogoutConfirmModal/LogoutConfirmModal';
// import { _useAudio } from '../../hook/_useAudio';

// const Root: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true); // Track auth loading state
//   const { loading: userLoading } = useAppSelector((state) => state.user);
//   const { selectedYear } = useAppSelector((state) => state.control);

//   const location = useLocation();

//   // Check the current route array
//   const shouldShowBanner = [
//     '/assessment',
//     '/action-center',
//     '/fishing',
//     '/car-race',
//   ].includes(location.pathname);

//   const onLoad = async () => {
//     if (selectedYear) {
//       dispatch(getGlobalLeaderBoard(selectedYear));
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // User is authenticated, fetch their profile
//         dispatch(getUserProfile())
//           .unwrap()
//           .catch((error) =>
//             console.error('Failed to fetch user profile:', error)
//           );

//         onLoad();
//       } else {
//         console.log('No user is currently authenticated');
//         dispatch(logout());
//       }
//       setLoading(false); // Authentication check complete
//     });

//     return () => unsubscribe();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch]); // Ensures this runs only once

//   _useAudio();

//   return (
//     <>
//       <div className={classes.wrapper}>
//         <Header withBanner={shouldShowBanner} />
//         <div className={classes.outlet}>
//           <Outlet />
//         </div>
//         {true && <Footer />}
//       </div>

//       <CongratulationModal />
//       <SelectAssessmentYear />
//       <GameModeModal />
//       <SelectGame />
//       <SelectGenderModal />
//       <LeaderBoardInfoModal />
//       <SoundSettingModal />
//       <LogoutConfirmModal />

//       <Overlay opened={loading || userLoading}>
//         <div
//           style={{
//             width: '100%',
//             height: '100%',
//             position: 'absolute',
//             top: 0,
//             right: 0,

//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//           <p style={{ fontFamily: 'Sigmar One' }}>Loading...</p>
//         </div>
//       </Overlay>
//     </>
//   );
// };

// export default Root;

import classes from './Root.module.css';
import { Outlet } from 'react-router-dom';
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

const Root: React.FC = () => {
  const dispatch = useAppDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  // Redux state
  const {
    userProfile,
    role,
    isAuthenticated,
    loading: authStateLoading,
    error: authError,
  } = useAppSelector((state) => state.auth);

  const { user: userProfileData, error: userError } = useAppSelector(
    (state) => state.user
  );

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
        {/* Main content */}
        <main className='bg-white'>
          <Outlet />
        </main>
      </div>

      {/* Global Overlay */}
      {/* <Overlay /> */}

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

export default Root;
