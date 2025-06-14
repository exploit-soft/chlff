// import React, { useState, useEffect } from 'react';
// import classes from './FormStyle.module.css';
// import { useForm } from 'react-hook-form';
// import CustomButton from '../../../components/Shared/CustomButton/CsutomButton';
// import { registerUser } from '../../../features/auth/authSlice';
// import { useAppDispatch } from '../../../app/hooks';
// import { getAllSchoolsService } from '../../../services/authService';
// import { SchoolProfile } from '../../../services/userService';

// // Define TypeScript type for form values based on all possible fields
// interface RegisterFormValues {
//   displayName: string;
//   email: string;
//   password: string;
//   // Student specific fields
//   year?: number;
//   gender?: 'boy' | 'girl';
//   parentEmail?: string;
//   schoolId?: string;
//   // Teacher specific fields
//   subject?: string;
//   qualification?: string;
//   // Parent specific fields
//   phoneNumber?: string;
//   address?: string;
//   childrenEmails?: string;
//   // School specific fields
//   schoolName?: string;
//   principalName?: string;
//   establishedYear?: number;
// }

// interface RoleBasedRegisterFormProps {
//   role: 'student' | 'teacher' | 'parent' | 'school';
// }

// const RoleBasedRegisterForm: React.FC<RoleBasedRegisterFormProps> = ({
//   role,
// }) => {
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [schools, setSchools] = useState<SchoolProfile[]>([]);
//   const [loadingSchools, setLoadingSchools] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm<RegisterFormValues>({
//     defaultValues: {
//       displayName: '',
//       email: '',
//       password: '',
//       year: role === 'student' ? 1 : undefined,
//       gender: role === 'student' ? 'boy' : undefined,
//     },
//   });

//   // Load schools for student and teacher registration
//   useEffect(() => {
//     if (role === 'student' || role === 'teacher') {
//       const loadSchools = async () => {
//         setLoadingSchools(true);
//         try {
//           const schoolsList = await getAllSchoolsService();
//           setSchools(schoolsList);
//         } catch (error) {
//           console.error('Error loading schools:', error);
//         } finally {
//           setLoadingSchools(false);
//         }
//       };
//       loadSchools();
//     }
//   }, [role]);

//   const onSubmit = async (data: RegisterFormValues) => {
//     setLoading(true);
//     setSubmitError(null);

//     try {
//       // Transform data based on role
//       let payload: any = {
//         displayName: data.displayName,
//         email: data.email,
//         password: data.password,
//         role: role,
//       };

//       // Add role-specific fields
//       switch (role) {
//         case 'student':
//           payload = {
//             ...payload,
//             year: data.year || 1,
//             gender: data.gender || 'boy',
//             parentEmail: data.parentEmail || undefined,
//             schoolId: data.schoolId || undefined,
//           };
//           break;

//         case 'teacher':
//           payload = {
//             ...payload,
//             schoolId: data.schoolId!,
//             subject: data.subject || undefined,
//             qualification: data.qualification || undefined,
//           };
//           break;

//         case 'parent':
//           payload = {
//             ...payload,
//             phoneNumber: data.phoneNumber || undefined,
//             address: data.address || undefined,
//             childrenEmails: data.childrenEmails
//               ? data.childrenEmails
//                   .split(',')
//                   .map((email) => email.trim())
//                   .filter((email) => email)
//               : undefined,
//           };
//           break;

//         case 'school':
//           payload = {
//             ...payload,
//             schoolName: data.schoolName!,
//             address: data.address!,
//             phoneNumber: data.phoneNumber!,
//             principalName: data.principalName || undefined,
//             establishedYear: data.establishedYear || undefined,
//           };
//           break;
//       }

//       const res = await dispatch(registerUser(payload));

//       if (res.meta.requestStatus === 'fulfilled') {
//         console.log('Registration successful:', res.payload);
//         reset();
//       } else {
//         setSubmitError('Registration failed. Please try again.');
//         console.log('Registration failed:', res.payload);
//       }
//     } catch (error) {
//       setSubmitError('An error occurred. Please try again.');
//       console.log('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const renderRoleSpecificFields = () => {
//     switch (role) {
//       case 'student':
//         return (
//           <>
//             <div className={classes['form-input']}>
//               <select
//                 {...register('year', { required: 'Year is required' })}
//                 className={errors.year ? classes.error : ''}
//               >
//                 <option value=''>--Select Year--</option>
//                 {[1, 2, 3, 4, 5, 6].map((year) => (
//                   <option key={year} value={year}>
//                     Year {year}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={classes['form-input']}>
//               <select
//                 {...register('gender', { required: 'Gender is required' })}
//                 className={errors.gender ? classes.error : ''}
//               >
//                 <option value=''>--Select Gender--</option>
//                 <option value='boy'>Boy</option>
//                 <option value='girl'>Girl</option>
//               </select>
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='email'
//                 {...register('parentEmail')}
//                 placeholder='Parent Email (Optional)'
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <select {...register('schoolId')} disabled={loadingSchools}>
//                 <option value=''>Select School (Optional)</option>
//                 {schools.map((school) => (
//                   <option key={school.uid} value={school.uid}>
//                     {school.schoolName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </>
//         );

//       case 'teacher':
//         return (
//           <>
//             <div className={classes['form-input']}>
//               <select
//                 {...register('schoolId', { required: 'School is required' })}
//                 className={errors.schoolId ? classes.error : ''}
//                 disabled={loadingSchools}
//               >
//                 <option value=''>Select School</option>
//                 {schools.map((school) => (
//                   <option key={school.uid} value={school.uid}>
//                     {school.schoolName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='text'
//                 {...register('subject')}
//                 placeholder='Subject (Optional)'
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='text'
//                 {...register('qualification')}
//                 placeholder='Qualification (Optional)'
//               />
//             </div>
//           </>
//         );

//       case 'parent':
//         return (
//           <>
//             <div className={classes['form-input']}>
//               <input
//                 type='tel'
//                 {...register('phoneNumber')}
//                 placeholder='Phone Number (Optional)'
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='text'
//                 {...register('address')}
//                 placeholder='Address (Optional)'
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='text'
//                 {...register('childrenEmails')}
//                 placeholder='Children Emails (Optional, comma separated)'
//               />
//             </div>
//           </>
//         );

//       case 'school':
//         return (
//           <>
//             <div className={classes['form-input']}>
//               <input
//                 type='text'
//                 {...register('schoolName', {
//                   required: 'School name is required',
//                 })}
//                 placeholder='School Name'
//                 className={errors.schoolName ? classes.error : ''}
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='text'
//                 {...register('address', { required: 'Address is required' })}
//                 placeholder='School Address'
//                 className={errors.address ? classes.error : ''}
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='tel'
//                 {...register('phoneNumber', {
//                   required: 'Phone number is required',
//                 })}
//                 placeholder='School Phone Number'
//                 className={errors.phoneNumber ? classes.error : ''}
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='text'
//                 {...register('principalName')}
//                 placeholder='Principal Name (Optional)'
//               />
//             </div>

//             <div className={classes['form-input']}>
//               <input
//                 type='number'
//                 {...register('establishedYear', {
//                   min: { value: 1800, message: 'Invalid year' },
//                   max: {
//                     value: new Date().getFullYear(),
//                     message: 'Invalid year',
//                   },
//                 })}
//                 placeholder='Established Year (Optional)'
//                 className={errors.establishedYear ? classes.error : ''}
//               />
//             </div>
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   const getRoleTitle = () => {
//     return role.charAt(0).toUpperCase() + role.slice(1);
//   };

//   const getElementHeight = () => {
//     switch (role) {
//       case 'student':
//         return 600;
//       case 'teacher':
//         return 550;
//       case 'parent':
//         return 550;
//       case 'school':
//         return 700;
//       default:
//         return 450;
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
//         {/* Basic fields for all roles */}
//         <div className={classes['form-input']}>
//           <input
//             type='text'
//             {...register('displayName', {
//               required: 'Name is required',
//               minLength: {
//                 value: 3,
//                 message: 'Name must be at least 3 characters',
//               },
//             })}
//             placeholder='Enter Your Name'
//             className={errors.displayName ? classes.error : ''}
//           />
//         </div>

//         <div className={classes['form-input']}>
//           <input
//             type='email'
//             {...register('email', {
//               required: 'Email is required',
//               pattern: {
//                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                 message: 'Invalid email address',
//               },
//             })}
//             placeholder='Enter Email'
//             className={errors.email ? classes.error : ''}
//           />
//         </div>

//         <div className={classes['form-input']}>
//           <div className={classes.passwordContainer}>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               {...register('password', {
//                 required: 'Password is required',
//                 minLength: {
//                   value: 6,
//                   message: 'Password must be at least 6 characters',
//                 },
//               })}
//               placeholder='Enter Password'
//               className={errors.password ? classes.error : ''}
//             />
//             <button
//               type='button'
//               onClick={togglePasswordVisibility}
//               className={classes.toggleButton}
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//           </div>
//         </div>

//         {/* Role-specific fields */}
//         {renderRoleSpecificFields()}

//         <div className={classes['form-button']}>
//           <CustomButton type='submit' disabled={loading || loadingSchools}>
//             {loading ? 'LOADING...' : 'SUBMIT'}
//           </CustomButton>
//         </div>
//       </form>

//       {/* Error messages */}
//       {errors.displayName && (
//         <p className={classes.errorMsg}>- {errors.displayName.message}</p>
//       )}
//       {errors.email && (
//         <p className={classes.errorMsg}>- {errors.email.message}</p>
//       )}
//       {errors.password && (
//         <p className={classes.errorMsg}>- {errors.password.message}</p>
//       )}
//       {errors.year && (
//         <p className={classes.errorMsg}>- {errors.year.message}</p>
//       )}
//       {errors.gender && (
//         <p className={classes.errorMsg}>- {errors.gender.message}</p>
//       )}
//       {errors.schoolId && (
//         <p className={classes.errorMsg}>- {errors.schoolId.message}</p>
//       )}
//       {errors.schoolName && (
//         <p className={classes.errorMsg}>- {errors.schoolName.message}</p>
//       )}
//       {errors.address && (
//         <p className={classes.errorMsg}>- {errors.address.message}</p>
//       )}
//       {errors.phoneNumber && (
//         <p className={classes.errorMsg}>- {errors.phoneNumber.message}</p>
//       )}
//       {errors.establishedYear && (
//         <p className={classes.errorMsg}>- {errors.establishedYear.message}</p>
//       )}
//       {submitError && <p className={classes.errorMsg}>{submitError}</p>}
//       {loadingSchools && <p className={classes.infoMsg}>Loading schools...</p>}
//     </div>
//   );
// };

// export default RoleBasedRegisterForm;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../../features/auth/authSlice';
import { useAppDispatch } from '../../../app/hooks';

// Mock services for demonstration
const getAllSchoolsService = async () => {
  return [
    { uid: '1', schoolName: 'Sunshine Elementary School' },
    { uid: '2', schoolName: 'Rainbow Academy' },
    { uid: '3', schoolName: 'Happy Kids School' },
    { uid: '4', schoolName: 'Little Scholars Academy' },
  ];
};

const mockDispatch = () => {
  return Promise.resolve({
    meta: { requestStatus: 'fulfilled' },
    payload: { success: true },
  });
};

// Define TypeScript type for form values based on all possible fields
interface RegisterFormValues {
  displayName: string;
  email: string;
  password: string;
  // Student specific fields
  year?: number;
  gender?: 'boy' | 'girl';
  parentEmail?: string;
  schoolId?: string;
  // Teacher specific fields
  subject?: string;
  qualification?: string;
  // Parent specific fields
  phoneNumber?: string;
  address?: string;
  childrenEmails?: string;
  // School specific fields
  schoolName?: string;
  principalName?: string;
  establishedYear?: number;
}

interface RoleBasedRegisterFormProps {
  role: 'student' | 'teacher' | 'parent' | 'school';
}

const RoleBasedRegisterForm: React.FC<RoleBasedRegisterFormProps> = ({
  role = 'student',
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      year: role === 'student' ? 1 : undefined,
      gender: role === 'student' ? 'boy' : undefined,
    },
  });

  // Load schools for student and teacher registration
  useEffect(() => {
    if (role === 'student' || role === 'teacher') {
      const loadSchools = async () => {
        setLoadingSchools(true);
        try {
          const schoolsList = await getAllSchoolsService();
          setSchools(schoolsList);
        } catch (error) {
          console.error('Error loading schools:', error);
        } finally {
          setLoadingSchools(false);
        }
      };
      loadSchools();
    }
  }, [role]);

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setSubmitError(null);

    try {
      // Transform data based on role
      let payload: any = {
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        role: role,
      };

      // Add role-specific fields
      switch (role) {
        case 'student':
          payload = {
            ...payload,
            year: data.year || 1,
            gender: data.gender || 'boy',
            parentEmail: data.parentEmail || undefined,
            schoolId: data.schoolId || undefined,
          };
          break;

        case 'teacher':
          payload = {
            ...payload,
            schoolId: data.schoolId!,
            subject: data.subject || undefined,
            qualification: data.qualification || undefined,
          };
          break;

        case 'parent':
          payload = {
            ...payload,
            phoneNumber: data.phoneNumber || undefined,
            address: data.address || undefined,
            childrenEmails: data.childrenEmails
              ? data.childrenEmails
                  .split(',')
                  .map((email) => email.trim())
                  .filter((email) => email)
              : undefined,
          };
          break;

        case 'school':
          payload = {
            ...payload,
            schoolName: data.schoolName!,
            address: data.address!,
            phoneNumber: data.phoneNumber!,
            principalName: data.principalName || undefined,
            establishedYear: data.establishedYear || undefined,
          };
          break;
      }

      const res = await dispatch(registerUser(payload));

      if (res.meta.requestStatus === 'fulfilled') {
        console.log('Registration successful:', res.payload);
        reset();
      } else {
        setSubmitError('Registration failed. Please try again.');
        console.log('Registration failed:', res.payload);
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const renderRoleSpecificFields = () => {
    switch (role) {
      case 'student':
        return (
          <>
            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                📚 What year are you in?
              </label>
              <select
                {...register('year', { required: 'Year is required' })}
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 focus:from-yellow-200 focus:to-orange-200 transition-all duration-300 border ${
                  errors.year
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                }`}
              >
                <option value=''>🎯 Pick your year!</option>
                {[1, 2, 3, 4, 5, 6].map((year) => (
                  <option key={year} value={year}>
                    Year {year} 🎓
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                👫 Are you a boy or girl?
              </label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-pink-100 to-blue-100 focus:from-pink-200 focus:to-blue-200 transition-all duration-300 border ${
                  errors.gender
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                }`}
              >
                <option value=''>🤔 Tell us!</option>
                <option value='boy'>👦 Boy</option>
                <option value='girl'>👧 Girl</option>
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                👨‍👩‍👧‍👦 Parent's Email (Optional)
              </label>
              <input
                type='email'
                {...register('parentEmail')}
                placeholder='mommy@email.com or daddy@email.com'
                className='w-full p-4 border-3 border-green-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-green-50 to-emerald-50 focus:from-green-100 focus:to-emerald-100 focus:border-green-500 transition-all duration-300 placeholder-green-400 border'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                🏫 Your School (Optional)
              </label>
              <select
                {...register('schoolId')}
                disabled={loadingSchools}
                className='w-full p-4 border-3 border-indigo-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 focus:from-indigo-100 focus:to-purple-100 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50 border'
              >
                <option value=''>🎒 Pick your school!</option>
                {schools.map((school) => (
                  <option key={school.uid} value={school.uid}>
                    {school.schoolName}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'teacher':
        return (
          <>
            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                🏫 Your School *
              </label>
              <select
                {...register('schoolId', { required: 'School is required' })}
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 focus:from-indigo-200 focus:to-purple-200 transition-all duration-300 border ${
                  errors.schoolId
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                }`}
                disabled={loadingSchools}
              >
                <option value=''>📚 Choose your school</option>
                {schools.map((school) => (
                  <option key={school.uid} value={school.uid}>
                    {school.schoolName}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                📖 What subject do you teach? (Optional)
              </label>
              <input
                type='text'
                {...register('subject')}
                placeholder='Math, Science, English...'
                className='w-full p-4 border-3 border-orange-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-orange-50 to-yellow-50 focus:from-orange-100 focus:to-yellow-100 focus:border-orange-500 transition-all duration-300 placeholder-orange-400 border'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                🎓 Your Qualification (Optional)
              </label>
              <input
                type='text'
                {...register('qualification')}
                placeholder='Bachelor of Education, Masters...'
                className='w-full p-4 border-3 border-teal-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-teal-50 to-cyan-50 focus:from-teal-100 focus:to-cyan-100 focus:border-teal-500 transition-all duration-300 placeholder-teal-400 border'
              />
            </div>
          </>
        );

      case 'parent':
        return (
          <>
            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                📱 Phone Number (Optional)
              </label>
              <input
                type='tel'
                {...register('phoneNumber')}
                placeholder='Your phone number'
                className='w-full p-4 border-3 border-green-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-green-50 to-emerald-50 focus:from-green-100 focus:to-emerald-100 focus:border-green-500 transition-all duration-300 placeholder-green-400 border'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                🏠 Address (Optional)
              </label>
              <input
                type='text'
                {...register('address')}
                placeholder='Your home address'
                className='w-full p-4 border-3 border-blue-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 focus:from-blue-100 focus:to-indigo-100 focus:border-blue-500 transition-all duration-300 placeholder-blue-400 border'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                👶 Children's Emails (Optional)
              </label>
              <input
                type='text'
                {...register('childrenEmails')}
                placeholder='child1@email.com, child2@email.com'
                className='w-full p-4 border-3 border-pink-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-pink-50 to-rose-50 focus:from-pink-100 focus:to-rose-100 focus:border-pink-500 transition-all duration-300 placeholder-pink-400 border'
              />
            </div>
          </>
        );

      case 'school':
        return (
          <>
            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                🏫 School Name *
              </label>
              <input
                type='text'
                {...register('schoolName', {
                  required: 'School name is required',
                })}
                placeholder='Amazing Kids School'
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 focus:from-blue-200 focus:to-indigo-200 transition-all duration-300 border ${
                  errors.schoolName
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                } placeholder-blue-400`}
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                🏠 School Address *
              </label>
              <input
                type='text'
                {...register('address', { required: 'Address is required' })}
                placeholder='123 Education Street'
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-green-100 to-emerald-100 focus:from-green-200 focus:to-emerald-200 transition-all duration-300 border ${
                  errors.address
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                } placeholder-green-400`}
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                📞 School Phone *
              </label>
              <input
                type='tel'
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                })}
                placeholder='School phone number'
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-orange-100 to-yellow-100 focus:from-orange-200 focus:to-yellow-200 transition-all duration-300 border ${
                  errors.phoneNumber
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                } placeholder-orange-400`}
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                👨‍💼 Principal Name (Optional)
              </label>
              <input
                type='text'
                {...register('principalName')}
                placeholder='Principal Johnson'
                className='w-full p-4 border-3 border-teal-300 rounded-2xl text-lg font-semibold bg-gradient-to-r from-teal-50 to-cyan-50 focus:from-teal-100 focus:to-cyan-100 focus:border-teal-500 transition-all duration-300 placeholder-teal-400 border'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                📅 Established Year (Optional)
              </label>
              <input
                type='number'
                {...register('establishedYear', {
                  min: { value: 1800, message: 'Invalid year' },
                  max: {
                    value: new Date().getFullYear(),
                    message: 'Invalid year',
                  },
                })}
                placeholder='2010'
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-purple-100 to-pink-100 focus:from-purple-200 focus:to-pink-200 transition-all duration-300 border ${
                  errors.establishedYear
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                } placeholder-purple-400`}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getRoleTitle = () => {
    const titles = {
      student: '🎒 Student',
      teacher: '👩‍🏫 Teacher',
      parent: '👨‍👩‍👧‍👦 Parent',
      school: '🏫 School',
    };
    return titles[role] || role;
  };

  const getRoleEmoji = () => {
    const emojis = {
      student: '🎓',
      teacher: '📚',
      parent: '💝',
      school: '🏫',
    };
    return emojis[role] || '✨';
  };

  return (
    <div
      // className='w-full min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 p-4 font-comic'
      className='w-full min-h-screen px-4 py-8 bg-gradient-to-br from-purple-400/70 via-pink-300/20 to-yellow-300/70  font-comic'
    >
      <div className='max-w-3xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='text-7xl mb-4 animate-bounce'>{getRoleEmoji()}</div>
          <h1 className='text-4xl font-black text-white drop-shadow-lg mb-2'>
            Join Our School!
          </h1>
          <h2 className='text-2xl font-bold text-purple-800 bg-white/80 rounded-full px-4 py-2 inline-block'>
            {getRoleTitle()} Registration
          </h2>
        </div>

        {/* Form Container */}
        <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm p-8 border-2 border-white'>
          <div className=' grid grid-cols-2 gap-4 items-start'>
            {/* Basic fields for all roles */}
            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                👋 What's your name?
              </label>
              <input
                type='text'
                {...register('displayName', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters',
                  },
                })}
                placeholder='Your awesome name!'
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-pink-100 to-purple-100 focus:from-pink-200 focus:to-purple-200 transition-all duration-300 border ${
                  errors.displayName
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                } placeholder-purple-400`}
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                📧 Your email address
              </label>
              <input
                type='email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                placeholder='your@email.com'
                className={`w-full p-4 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-100 to-teal-100 focus:from-blue-200 focus:to-teal-200 transition-all duration-300 border ${
                  errors.email
                    ? 'border-red-400 shadow-lg shadow-red-200'
                    : 'border-purple-300 focus:border-purple-500'
                } placeholder-blue-400`}
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-purple-700 font-bold text-sm'>
                🔒 Create a password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  placeholder='Super secret password!'
                  className={`w-full p-4 pr-16 border-3 rounded-2xl text-lg font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 focus:from-yellow-200 focus:to-orange-200 transition-all duration-300 border ${
                    errors.password
                      ? 'border-red-400 shadow-lg shadow-red-200'
                      : 'border-purple-300 focus:border-purple-500'
                  } placeholder-yellow-500`}
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform duration-200'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Role-specific fields */}
            {renderRoleSpecificFields()}

            {/* Submit Button */}
          </div>

          <div className='pt-4'>
            <button
              type='button'
              onClick={() => handleSubmit(onSubmit)()}
              disabled={loading || loadingSchools}
              className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-black text-xl py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 border-4 border-white disabled:opacity-50'
            >
              {loading ? '🔄 Loading...' : '🚀 Join the Fun!'}
            </button>
          </div>

          {/* Error messages */}
          <div className='grid grid-cols-2 gap-4'>
            {errors.displayName && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                😅 {errors.displayName.message}
              </p>
            )}
            {errors.email && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                📧 {errors.email.message}
              </p>
            )}
            {errors.password && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                🔒 {errors.password.message}
              </p>
            )}
            {errors.year && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                📚 {errors.year.message}
              </p>
            )}
            {errors.gender && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                👫 {errors.gender.message}
              </p>
            )}
            {errors.schoolId && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                🏫 {errors.schoolId.message}
              </p>
            )}
            {errors.schoolName && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                🏫 {errors.schoolName.message}
              </p>
            )}
            {errors.address && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                🏠 {errors.address.message}
              </p>
            )}
            {errors.phoneNumber && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                📱 {errors.phoneNumber.message}
              </p>
            )}
            {errors.establishedYear && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                📅 {errors.establishedYear.message}
              </p>
            )}
            {submitError && (
              <p className='text-red-600 font-bold text-sm bg-red-100 p-2 rounded-lg'>
                😔 {submitError}
              </p>
            )}
            {loadingSchools && (
              <p className='text-blue-600 font-bold text-sm bg-blue-100 p-2 rounded-lg'>
                🔄 Loading schools...
              </p>
            )}
          </div>
        </div>

        {/* Fun decorative elements */}
        <div className='flex justify-center mt-8 space-x-4 text-4xl hidden'>
          <div className='animate-pulse'>⭐</div>
          <div className='animate-bounce'>🌈</div>
          <div className='animate-pulse'>✨</div>
          <div className='animate-bounce'>🎉</div>
          <div className='animate-pulse'>🎨</div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedRegisterForm;
