// import classes from './Auth.module.css';
// import CustomButton from '../../components/Shared/CustomButton/CsutomButton';
// import AuthWrapper from '../../components/Shared/AuthWrapper/AuthWrapper';
// import { useNavigate, useParams } from 'react-router-dom';
// import RoleBasedRegisterForm from './RoleBasedForm/RoleBasedRegisterForm';
// import ElementWrapper from '../../components/Shared/ElementWrapper/ElementWrapper';

// export default function Register() {
//   const { role } = useParams<{ role: string }>();
//   const navigate = useNavigate();

//   const handleRoleClick = (role: string) => {
//     navigate(`/register/${role}`);
//   };

//   return (
//     <AuthWrapper withLogo={false}>
//       {/* Only show buttons when no role is selected */}
//       {!role && (
//         <ElementWrapper width={400} height={400} title='You are a...?'>
//           <div className={classes.btnWrap}>
//             <CustomButton onClick={() => handleRoleClick('student')}>
//               STUDENT
//             </CustomButton>
//             <CustomButton onClick={() => handleRoleClick('school')}>
//               SCHOOL
//             </CustomButton>
//             <CustomButton onClick={() => handleRoleClick('parent')}>
//               PARENT
//             </CustomButton>
//             <CustomButton onClick={() => handleRoleClick('teacher')}>
//               TEACHER
//             </CustomButton>
//           </div>
//         </ElementWrapper>
//       )}

//       {role && <RoleBasedRegisterForm role={role} />}
//     </AuthWrapper>
//   );
// }

import classes from './Auth.module.css';
import CustomButton from '../../components/Shared/CustomButton/CsutomButton';
import AuthWrapper from '../../components/Shared/AuthWrapper/AuthWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import RoleBasedRegisterForm from './RoleBasedForm/RoleBasedRegisterForm';
import ElementWrapper from '../../components/Shared/ElementWrapper/ElementWrapper';

export default function Register() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();

  // Define valid roles
  const validRoles = ['teacher', 'student', 'school', 'parent'];

  const handleRoleClick = (role: string) => {
    navigate(`/register/${role}`);
  };

  // If role is provided but not valid, return null or 404
  if (role && !validRoles.includes(role)) {
    return (
      <div className='h-screen flex items-center justify-center'>
        404 - Invalid Role
      </div>
    );
    return null; // You can also return a 404 component here
    // Alternative: return <div>404 - Page Not Found</div>;
  }

  return (
    <AuthWrapper withLogo={false}>
      {/* Only show buttons when no role is selected */}
      {!role && (
        <ElementWrapper width={400} height={400} title='You are a...?'>
          <div className={classes.btnWrap}>
            <CustomButton onClick={() => handleRoleClick('student')}>
              STUDENT
            </CustomButton>
            <CustomButton onClick={() => handleRoleClick('school')}>
              SCHOOL
            </CustomButton>
            <CustomButton onClick={() => handleRoleClick('parent')}>
              PARENT
            </CustomButton>
            <CustomButton onClick={() => handleRoleClick('teacher')}>
              TEACHER
            </CustomButton>
          </div>
        </ElementWrapper>
      )}

      {role && (
        <RoleBasedRegisterForm
          role={role as 'student' | 'teacher' | 'parent' | 'school'}
        />
      )}
    </AuthWrapper>
  );
}
