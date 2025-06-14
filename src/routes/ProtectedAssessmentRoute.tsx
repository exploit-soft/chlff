import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../features/user/userSlice';
// import { getUserProfile } from '../store/slices/userSlice'; // Adjust path as needed

const ProtectedAssessmentRoute = () => {
  const { user, loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // If we don't have user data and we're not currently loading, fetch it
    if (!user && !loading) {
      dispatch(getUserProfile());
    }
  }, [user, loading, dispatch]);

  useEffect(() => {
    // Once we have attempted to load user data (either success or failure),
    // we can stop the initialization loading state
    if (!loading) {
      setIsInitializing(false);
    }
  }, [loading]);

  // Show loading while we're initializing or while Redux is loading
  if (isInitializing || loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
          <p className='text-black'>Loading...</p>
        </div>
      </div>
    );
  }

  // If there's an error or no user after loading is complete, redirect to login
  if (error || !user) {
    return <Navigate to='/login' replace />;
  }

  // Uncomment and modify this section based on your assessment logic
  // if (user.assessmentPassed) {
  //   return <Navigate to="/action-center" replace />;
  // }

  // User is authenticated and hasn't passed assessment, allow access
  return <Outlet />;
};

export default ProtectedAssessmentRoute;
