// const SchoolDashboard = () => {
//   return (
//     <div className='school-dashboard'>
//       <h1>School Dashboard</h1>
//       <div className='dashboard-content'>
//         {/* Add your dashboard components here */}
//       </div>
//     </div>
//   );
// };

// export default SchoolDashboard;

import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  BarChart3,
  Calendar,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Filter,
  Download,
  TrendingUp,
  Clock,
  Award,
  GraduationCap,
  UserCheck,
  Activity,
} from 'lucide-react';

const SchoolDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('school'); // teacher, parent, school
  const [notifications, setNotifications] = useState(3);

  // Mock data based on your dashboard slice structure
  const mockData = {
    school: {
      totalTeachers: 24,
      totalStudents: 450,
      totalParents: 380,
      totalClasses: 18,
      averageScore: 85.2,
      activeUsers: 342,
      recentActivity: [
        {
          id: 1,
          type: 'assessment',
          student: 'John Doe',
          score: 92,
          time: '2 hours ago',
        },
        { id: 2, type: 'login', user: 'Mrs. Smith', time: '3 hours ago' },
        {
          id: 3,
          type: 'mission',
          student: 'Alice Johnson',
          missions: 5,
          time: '4 hours ago',
        },
      ],
      topPerformingClasses: [
        { name: 'Class 5A', average: 92.1, students: 28 },
        { name: 'Class 4B', average: 89.5, students: 25 },
        { name: 'Class 6A', average: 87.3, students: 30 },
      ],
    },
    teacher: {
      totalStudents: 28,
      totalClasses: 2,
      averageScore: 88.5,
      totalTimePlayed: 1247,
      students: [
        { name: 'Emma Wilson', score: 94, missions: 12, time: 45 },
        { name: 'Liam Brown', score: 87, missions: 8, time: 32 },
        { name: 'Sophia Davis', score: 91, missions: 10, time: 38 },
      ],
    },
    parent: {
      totalChildren: 2,
      activeChildren: 2,
      children: [
        { name: 'Alex Smith', grade: '5th', score: 89, missions: 15, time: 67 },
        { name: 'Maya Smith', grade: '3rd', score: 92, missions: 12, time: 54 },
      ],
    },
  };

  const sidebarItems = {
    school: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'teachers', label: 'Teachers', icon: GraduationCap },
      { id: 'classes', label: 'Classes', icon: BookOpen },
      { id: 'performance', label: 'Performance', icon: BarChart3 },
      { id: 'activity', label: 'Activity', icon: Activity },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    teacher: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'students', label: 'My Students', icon: Users },
      { id: 'classes', label: 'My Classes', icon: BookOpen },
      { id: 'performance', label: 'Performance', icon: BarChart3 },
      { id: 'activity', label: 'Activity', icon: Activity },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    parent: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'children', label: 'My Children', icon: Users },
      { id: 'performance', label: 'Progress', icon: BarChart3 },
      { id: 'activity', label: 'Activity', icon: Activity },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'blue',
  }: any) => (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
          {subtitle && <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className='flex items-center mt-4'>
          <TrendingUp className='h-4 w-4 text-green-500 mr-1' />
          <span className='text-sm text-green-600 font-medium'>{trend}</span>
        </div>
      )}
    </div>
  );

  const ActivityItem = ({ activity }: any) => {
    const getActivityIcon = (type: any) => {
      switch (type) {
        case 'assessment':
          return BarChart3;
        case 'login':
          return UserCheck;
        case 'mission':
          return Award;
        default:
          return Activity;
      }
    };

    const Icon = getActivityIcon(activity.type);

    return (
      <div className='flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
        <div className='p-2 bg-blue-50 rounded-lg'>
          <Icon className='h-4 w-4 text-blue-600' />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-900'>
            {activity.student || activity.user}
          </p>
          <p className='text-sm text-gray-500'>
            {activity.type === 'assessment' && `Scored ${activity.score}%`}
            {activity.type === 'login' && 'Logged in'}
            {activity.type === 'mission' &&
              `Completed ${activity.missions} missions`}
          </p>
        </div>
        <div className='text-xs text-gray-400'>{activity.time}</div>
      </div>
    );
  };

  const renderOverviewContent = () => {
    const data = mockData[userRole];

    return (
      <div className='space-y-6'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {userRole === 'school' && (
            <>
              <StatCard
                title='Total Students'
                value={data.totalStudents}
                icon={Users}
                trend='+12% this month'
              />
              <StatCard
                title='Total Teachers'
                value={data.totalTeachers}
                icon={GraduationCap}
                color='green'
              />
              <StatCard
                title='Active Classes'
                value={data.totalClasses}
                icon={BookOpen}
                color='purple'
              />
              <StatCard
                title='Avg. Performance'
                value={`${data.averageScore}%`}
                icon={BarChart3}
                color='orange'
                trend='+5%'
              />
            </>
          )}
          {userRole === 'teacher' && (
            <>
              <StatCard
                title='My Students'
                value={data.totalStudents}
                icon={Users}
              />
              <StatCard
                title='My Classes'
                value={data.totalClasses}
                icon={BookOpen}
                color='green'
              />
              <StatCard
                title='Avg. Score'
                value={`${data.averageScore}%`}
                icon={BarChart3}
                color='purple'
              />
              <StatCard
                title='Total Time'
                value={`${data.totalTimePlayed}h`}
                icon={Clock}
                color='orange'
              />
            </>
          )}
          {userRole === 'parent' && (
            <>
              <StatCard
                title='My Children'
                value={data.totalChildren}
                icon={Users}
              />
              <StatCard
                title='Active'
                value={data.activeChildren}
                icon={UserCheck}
                color='green'
              />
              <StatCard
                title='Total Missions'
                value='27'
                icon={Award}
                color='purple'
              />
              <StatCard
                title='Study Time'
                value='121h'
                icon={Clock}
                color='orange'
              />
            </>
          )}
        </div>

        {/* Charts and Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Performance Chart Placeholder */}
          <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Performance Overview
              </h3>
              <div className='flex space-x-2'>
                <button className='px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg'>
                  Week
                </button>
                <button className='px-3 py-1 text-sm text-gray-600 rounded-lg'>
                  Month
                </button>
                <button className='px-3 py-1 text-sm text-gray-600 rounded-lg'>
                  Year
                </button>
              </div>
            </div>
            <div className='h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center'>
              <div className='text-center'>
                <BarChart3 className='h-12 w-12 text-blue-400 mx-auto mb-3' />
                <p className='text-gray-600'>
                  Chart visualization would go here
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Recent Activity
              </h3>
              <button className='text-sm text-blue-600 hover:text-blue-700'>
                View All
              </button>
            </div>
            <div className='space-y-1'>
              {(userRole === 'school'
                ? mockData.school.recentActivity
                : []
              ).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              {userRole === 'teacher' &&
                mockData.teacher.students.slice(0, 3).map((student, idx) => (
                  <ActivityItem
                    key={idx}
                    activity={{
                      id: idx,
                      type: 'assessment',
                      student: student.name,
                      score: student.score,
                      time: '2h ago',
                    }}
                  />
                ))}
              {userRole === 'parent' &&
                mockData.parent.children.map((child, idx) => (
                  <ActivityItem
                    key={idx}
                    activity={{
                      id: idx,
                      type: 'mission',
                      student: child.name,
                      missions: child.missions,
                      time: '1h ago',
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentsContent = () => (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {userRole === 'parent'
              ? 'My Children'
              : userRole === 'teacher'
              ? 'My Students'
              : 'All Students'}
          </h3>
          <div className='flex space-x-3'>
            <button className='flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50'>
              <Filter className='h-4 w-4 mr-2' />
              Filter
            </button>
            <button className='flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
              <Download className='h-4 w-4 mr-2' />
              Export
            </button>
          </div>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Student
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Grade
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Score
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Missions
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Time
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {(userRole === 'parent'
              ? mockData.parent.children
              : mockData.teacher.students
            ).map((student, idx) => (
              <tr key={idx} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-sm font-medium text-blue-600'>
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div className='ml-3'>
                      <div className='text-sm font-medium text-gray-900'>
                        {student.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {student.grade || '5th Grade'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <span className='text-sm font-medium text-gray-900'>
                      {student.score}%
                    </span>
                    <div className='ml-2 w-16 bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full'
                        style={{ width: `${student.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {student.missions}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {student.time}h
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full'>
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          {!sidebarCollapsed && (
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <GraduationCap className='h-5 w-5 text-white' />
              </div>
              <span className='text-xl font-bold text-gray-900'>EduDash</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
          >
            {sidebarCollapsed ? (
              <ChevronRight className='h-5 w-5' />
            ) : (
              <ChevronLeft className='h-5 w-5' />
            )}
          </button>
        </div>

        {/* Role Selector */}
        {!sidebarCollapsed && (
          <div className='p-4 border-b border-gray-200'>
            <select
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value);
                setActiveTab('overview');
              }}
              className='w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='school'>School Admin</option>
              <option value='teacher'>Teacher</option>
              <option value='parent'>Parent</option>
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className='flex-1 p-4 space-y-2'>
          {sidebarItems[userRole].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? 'text-blue-700' : 'text-gray-500'
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className='font-medium'>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 capitalize'>
                {activeTab === 'children' ? 'My Children' : activeTab}
              </h1>
              <p className='text-sm text-gray-600'>
                {userRole === 'school' && "Manage your school's performance"}
                {userRole === 'teacher' && "Track your students' progress"}
                {userRole === 'parent' && "Monitor your children's learning"}
              </p>
            </div>

            <div className='flex items-center space-x-4'>
              {/* Search */}
              <div className='relative'>
                <Search className='h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search...'
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              {/* Notifications */}
              <button className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'>
                <Bell className='h-5 w-5' />
                {notifications > 0 && (
                  <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className='flex items-center space-x-3'>
                <div className='h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-medium text-white'>JD</span>
                </div>
                <div className='hidden md:block'>
                  <p className='text-sm font-medium text-gray-900'>John Doe</p>
                  <p className='text-xs text-gray-500 capitalize'>{userRole}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-6'>
          {activeTab === 'overview' && renderOverviewContent()}
          {(activeTab === 'students' || activeTab === 'children') &&
            renderStudentsContent()}
          {[
            'classes',
            'teachers',
            'performance',
            'activity',
            'settings',
          ].includes(activeTab) && (
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <BookOpen className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2 capitalize'>
                {activeTab} Section
              </h3>
              <p className='text-gray-600'>
                This section is under development. Content will be added soon.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SchoolDashboard;
