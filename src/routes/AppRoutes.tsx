// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from 'react-router-dom';
// import { ProtectedRoute, PublicRoute } from './AuthRoutes';
// import { useAppSelector } from '../app/hooks';
// import Root from '../components/Root/Root';
// import Login from '../views/Auth/Login';
// import Register from '../views/Auth/Register';
// import Welcome from '../views/Auth/Welcome';
// import Assessment from '../views/Assessment/Assessment';
// import ActionCenter from '../views/ActionCenter/ActionCenter';
// import ShowRoom from '../views/ShowRoom/ShowRoom';
// import CarRaceTwo from '../components/Game/CarTwo/Game';
// import PicturePuzzle from '../components/Game/PicturePuzzle/Game';
// import MultiplicationTableCheck from '../components/MultiplicationTableCheck/MultiplicationTableCheck';
// import Car from '../components/Game/Car/Car';
// import FishInGame from '../components/Game/FishInGame/FishInGame';
// import NotFound from '../views/NotFound/NotFound';
// import CurvedLineLevels from '../views/Level/Level';
// import PickAYear from '../views/PickAYear/PickAYear';
// import ReadyAssessment from '../views/ReadyAssessment/ReadyAssessment';
// import ProtectedAssessmentRoute from './ProtectedAssessmentRoute';
// import NonProtectedAssessmentRoute from './NonProtectedAssessmentRoute';

// // Import Dashboard components for different roles
// import StudentDashboard from '../views/Dashboard/StudentDashboard';
// import TeacherDashboard from '../views/Dashboard/TeacherDashboard';
// import ParentDashboard from '../views/Dashboard/ParentDashboard';
// import SchoolDashboard from '../views/Dashboard/SchoolDashboard';

// // Role-based dashboard component
// const RoleBasedDashboard = () => {
//   const { userProfile } = useAppSelector((state) => state.auth);

//   if (!userProfile) {
//     return <Navigate to='/login' replace />;
//   }

//   switch (userProfile.role) {
//     case 'student':
//       return <StudentDashboard />;
//     case 'teacher':
//       return <TeacherDashboard />;
//     case 'parent':
//       return <ParentDashboard />;
//     case 'school':
//       return <SchoolDashboard />;
//     default:
//       return <Navigate to='/login' replace />;
//   }
// };

// // Main App Router Component
// export default function AppRoutes() {
//   const { isAuthenticated } = useAppSelector((state) => state.auth);

//   return (
//     <Router>
//       <Routes>
//         {/* Protected Routes with Root Layout */}
//         <Route
//           path='/'
//           element={
//             <ProtectedRoute isAuthenticated={isAuthenticated}>
//               <Root />
//             </ProtectedRoute>
//           }
//         >
//           {/* Assessment Routes with special protection */}
//           <Route element={<ProtectedAssessmentRoute />}>
//             <Route index element={<ReadyAssessment />} />
//             <Route path='pick-a-year' element={<PickAYear />} />
//             <Route path='assessment' element={<Assessment />} />
//           </Route>

//           {/* Non-Protected Assessment Routes (within authenticated area) */}
//           <Route element={<NonProtectedAssessmentRoute />}>
//             <Route path='action-center' element={<ActionCenter />} />
//             <Route path='showroom' element={<ShowRoom />} />
//             <Route path='levels' element={<CurvedLineLevels />} />
//             <Route path='games/car' element={<Car />} />
//             <Route path='games/car-race' element={<CarRaceTwo />} />
//             <Route path='games/picture-puzzle' element={<PicturePuzzle />} />
//             <Route path='games/fish' element={<FishInGame />} />
//             <Route
//               path='games/multiplication'
//               element={<MultiplicationTableCheck />}
//             />
//           </Route>
//         </Route>

//         {/* Standalone Protected Dashboard Route */}
//         <Route
//           path='/dashboard'
//           element={
//             <ProtectedRoute isAuthenticated={isAuthenticated}>
//               <RoleBasedDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Public Routes */}
//         <Route
//           path='/welcome'
//           element={
//             <PublicRoute isAuthenticated={isAuthenticated}>
//               <Welcome />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path='/login'
//           element={
//             <PublicRoute isAuthenticated={isAuthenticated}>
//               <Login />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path='/login/:role'
//           element={
//             <PublicRoute isAuthenticated={isAuthenticated}>
//               <Login />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path='/register'
//           element={
//             <PublicRoute isAuthenticated={isAuthenticated}>
//               <Register />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path='/register/:role'
//           element={
//             <PublicRoute isAuthenticated={isAuthenticated}>
//               <Register />
//             </PublicRoute>
//           }
//         />

//         {/* 404 Route */}
//         <Route path='*' element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './AuthRoutes';
import { useAppSelector } from '../app/hooks';
import Root from '../components/Root/Root';
import Login from '../views/Auth/Login';
import Register from '../views/Auth/Register';
import Welcome from '../views/Auth/Welcome';
import Assessment from '../views/Assessment/Assessment';
import ActionCenter from '../views/ActionCenter/ActionCenter';
import ShowRoom from '../views/ShowRoom/ShowRoom';
import CarRaceTwo from '../components/Game/CarTwo/Game';
import PicturePuzzle from '../components/Game/PicturePuzzle/Game';
import MultiplicationTableCheck from '../components/MultiplicationTableCheck/MultiplicationTableCheck';
import Car from '../components/Game/Car/Car';
import FishInGame from '../components/Game/FishInGame/FishInGame';
import NotFound from '../views/NotFound/NotFound';
import CurvedLineLevels from '../views/Level/Level';
import PickAYear from '../views/PickAYear/PickAYear';
import ReadyAssessment from '../views/ReadyAssessment/ReadyAssessment';
import ProtectedAssessmentRoute from './ProtectedAssessmentRoute';
import NonProtectedAssessmentRoute from './NonProtectedAssessmentRoute';

// Import Dashboard components for different roles
import StudentDashboard from '../views/Dashboard/StudentDashboard';
import TeacherDashboard from '../views/Dashboard/TeacherDashboard';
import ParentDashboard from '../views/Dashboard/ParentDashboard';
import SchoolDashboard from '../views/Dashboard/SchoolDashboard';

// Role-based dashboard component
const RoleBasedDashboard = () => {
  const { userProfile } = useAppSelector((state) => state.auth);

  if (!userProfile) {
    return <Navigate to='/login' replace />;
  }

  switch (userProfile.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'school':
      return <SchoolDashboard />;
    default:
      return <Navigate to='/login' replace />;
  }
};

// Main App Router Component
export default function AppRoutes() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Protected Routes with Root Layout */}
        <Route
          path='/'
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Root />
            </ProtectedRoute>
          }
        >
          {/* Assessment Routes with special protection */}
          <Route element={<ProtectedAssessmentRoute />}>
            {/* Dashboard as the default index route */}
            <Route index element={<RoleBasedDashboard />} />
            <Route path='ready-assessment' element={<ReadyAssessment />} />
            <Route path='pick-a-year' element={<PickAYear />} />
            <Route path='assessment' element={<Assessment />} />
          </Route>

          {/* Non-Protected Assessment Routes (within authenticated area) */}
          <Route element={<NonProtectedAssessmentRoute />}>
            <Route path='action-center' element={<ActionCenter />} />
            <Route path='showroom' element={<ShowRoom />} />
            <Route path='levels' element={<CurvedLineLevels />} />
            <Route path='games/car' element={<Car />} />
            <Route path='games/car-race' element={<CarRaceTwo />} />
            <Route path='games/picture-puzzle' element={<PicturePuzzle />} />
            <Route path='games/fish' element={<FishInGame />} />
            <Route
              path='games/multiplication'
              element={<MultiplicationTableCheck />}
            />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route
          path='/welcome'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Welcome />
            </PublicRoute>
          }
        />

        <Route
          path='/login'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path='/login/:role'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path='/register'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path='/register/:role'
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Register />
            </PublicRoute>
          }
        />

        {/* 404 Route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}
