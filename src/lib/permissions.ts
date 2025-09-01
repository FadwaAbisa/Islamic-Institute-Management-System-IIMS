// نظام إدارة الصلاحيات الشامل
// Comprehensive Permission Management System

export type UserRole = 'admin' | 'staff' | 'teacher' | 'student' | 'parent';

export interface Permission {
  id: string;
  name: string;
  description: string;
  arabicName: string;
  arabicDescription: string;
}

export interface RolePermissions {
  role: UserRole;
  roleName: string;
  roleNameArabic: string;
  permissions: Permission[];
  allowedRoutes: string[];
  restrictedRoutes: string[];
}

// تعريف جميع الصلاحيات المتاحة
export const ALL_PERMISSIONS: Permission[] = [
  // الصلاحيات الأساسية
  {
    id: 'login',
    name: 'User Login',
    description: 'Ability to log into the system',
    arabicName: 'تسجيل دخول',
    arabicDescription: 'القدرة على تسجيل الدخول للنظام'
  },
  {
    id: 'dashboard_access',
    name: 'Dashboard Access',
    description: 'Access to main dashboard',
    arabicName: 'الوصول للوحة التحكم',
    arabicDescription: 'الوصول للوحة التحكم الرئيسية'
  },
  
  // إدارة المستخدمين
  {
    id: 'manage_students',
    name: 'Manage Students',
    description: 'Full student management capabilities',
    arabicName: 'إدارة الطلاب',
    arabicDescription: 'إمكانيات إدارة الطلاب الكاملة'
  },
  {
    id: 'manage_teachers',
    name: 'Manage Teachers',
    description: 'Full teacher management capabilities',
    arabicName: 'إدارة المعلمين',
    arabicDescription: 'إمكانيات إدارة المعلمين الكاملة'
  },
  {
    id: 'manage_parents',
    name: 'Manage Administrative Staff',
    description: 'Full administrative staff management capabilities',
    arabicName: 'إدارة الموظفين الإداريين',
    arabicDescription: 'إمكانيات إدارة الموظفين الإداريين الكاملة'
  },
  {
    id: 'manage_staff',
    name: 'Manage Staff',
    description: 'Full staff management capabilities',
    arabicName: 'إدارة الموظفين',
    arabicDescription: 'إمكانيات إدارة الموظفين الكاملة'
  },
  
  // إدارة الأكاديمية
  {
    id: 'manage_subjects',
    name: 'Manage Subjects',
    description: 'Manage academic subjects and curriculum',
    arabicName: 'إدارة المواد الدراسية',
    arabicDescription: 'إدارة المواد الدراسية والمناهج'
  },
  {
    id: 'manage_classes',
    name: 'Manage Classes',
    description: 'Manage class structure and assignments',
    arabicName: 'إدارة الفصول',
    arabicDescription: 'إدارة هيكل الفصول والتعيينات'
  },
  {
    id: 'manage_lessons',
    name: 'Manage Lessons',
    description: 'Schedule and manage lessons',
    arabicName: 'إدارة الدروس',
    arabicDescription: 'جدولة وإدارة الدروس'
  },
  
  // إدارة الحضور
  {
    id: 'manage_attendance',
    name: 'Manage Attendance',
    description: 'Record and manage student attendance',
    arabicName: 'إدارة الحضور',
    arabicDescription: 'تسجيل وإدارة حضور الطلاب'
  },
  {
    id: 'view_attendance',
    name: 'View Attendance',
    description: 'View attendance records',
    arabicName: 'عرض الحضور',
    arabicDescription: 'عرض سجلات الحضور'
  },
  
  // إدارة الدرجات
  {
    id: 'manage_grades',
    name: 'Manage Grades',
    description: 'Input and manage student grades',
    arabicName: 'إدارة الدرجات',
    arabicDescription: 'إدخال وإدارة درجات الطلاب'
  },
  {
    id: 'view_grades',
    name: 'View Grades',
    description: 'View student grades and results',
    arabicName: 'عرض الدرجات',
    arabicDescription: 'عرض درجات الطلاب والنتائج'
  },
  
  // إدارة الواجبات
  {
    id: 'manage_assignments',
    name: 'Manage Assignments',
    description: 'Create and manage assignments',
    arabicName: 'إدارة الواجبات',
    arabicDescription: 'إنشاء وإدارة الواجبات'
  },
  {
    id: 'view_assignments',
    name: 'View Assignments',
    description: 'View and submit assignments',
    arabicName: 'عرض الواجبات',
    arabicDescription: 'عرض وتسليم الواجبات'
  },
  
  // إدارة الامتحانات
  {
    id: 'manage_exams',
    name: 'Manage Exams',
    description: 'Schedule and manage exams',
    arabicName: 'إدارة الامتحانات',
    arabicDescription: 'جدولة وإدارة الامتحانات'
  },
  {
    id: 'view_exams',
    name: 'View Exams',
    description: 'View exam schedules and results',
    arabicName: 'عرض الامتحانات',
    arabicDescription: 'عرض جداول الامتحانات والنتائج'
  },
  
  // إدارة الأحداث
  {
    id: 'manage_events',
    name: 'Manage Events',
    description: 'Create and manage school events',
    arabicName: 'إدارة الأحداث',
    arabicDescription: 'إنشاء وإدارة الأحداث المدرسية'
  },
  {
    id: 'view_events',
    name: 'View Events',
    description: 'View school events calendar',
    arabicName: 'عرض الأحداث',
    arabicDescription: 'عرض تقويم الأحداث المدرسية'
  },
  
  // إدارة الإعلانات
  {
    id: 'manage_announcements',
    name: 'Manage Announcements',
    description: 'Create and manage announcements',
    arabicName: 'إدارة الإعلانات',
    arabicDescription: 'إنشاء وإدارة الإعلانات'
  },
  {
    id: 'view_announcements',
    name: 'View Announcements',
    description: 'View system announcements',
    arabicName: 'عرض الإعلانات',
    arabicDescription: 'عرض إعلانات النظام'
  },
  
  // إدارة الرسائل
  {
    id: 'manage_messages',
    name: 'Manage Messages',
    description: 'Send and manage messages and conversations',
    arabicName: 'إدارة الرسائل',
    arabicDescription: 'إرسال وإدارة الرسائل والمحادثات'
  },
  {
    id: 'view_messages',
    name: 'View Messages',
    description: 'View and reply to messages',
    arabicName: 'عرض الرسائل',
    arabicDescription: 'عرض والرد على الرسائل'
  },
  
  // التقارير والإحصائيات
  {
    id: 'manage_reports',
    name: 'Manage Reports',
    description: 'Generate and manage system reports',
    arabicName: 'إدارة التقارير',
    arabicDescription: 'إنشاء وإدارة تقارير النظام'
  },
  {
    id: 'view_reports',
    name: 'View Reports',
    description: 'View system reports and statistics',
    arabicName: 'عرض التقارير',
    arabicDescription: 'عرض تقارير النظام والإحصائيات'
  },
  
  // إدارة النظام
  {
    id: 'system_settings',
    name: 'System Settings',
    description: 'Access to system configuration',
    arabicName: 'إعدادات النظام',
    arabicDescription: 'الوصول لإعدادات النظام'
  },
  {
    id: 'user_management',
    name: 'User Management',
    description: 'Manage all system users',
    arabicName: 'إدارة المستخدمين',
    arabicDescription: 'إدارة جميع مستخدمي النظام'
  }
];

// تعريف صلاحيات كل دور
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    roleName: 'System Administrator',
    roleNameArabic: 'مدير النظام',
    permissions: ALL_PERMISSIONS, // جميع الصلاحيات
    allowedRoutes: [
      '/admin',
      '/profile',
      '/list/teachers',
      '/list/students', 
      '/list/parents',
      '/list/staff',
      '/list/subjects',
      '/list/classes',
      '/list/lessons',
      '/list/exams',
      '/list/assignments',
      '/list/attendance',
      '/list/events',
      '/list/announcements',
      '/list/messages',
      '/grades',
      '/settings'
    ],
    restrictedRoutes: []
  },
  {
    role: 'staff',
    roleName: 'Administrative Staff',
    roleNameArabic: 'موظف إداري',
    permissions: ALL_PERMISSIONS.filter(p => [
      'login',
      'dashboard_access',
      'manage_students',
      'manage_attendance',
      'manage_grades',
      'manage_assignments',
      'manage_events',
      'manage_reports',
      'manage_messages',
      'view_messages'
    ].includes(p.id)),
    allowedRoutes: [
      '/staff',
      '/profile',
      '/list/students',
      '/list/staff',
      '/list/attendance',
      '/grades',
      '/list/assignments',
      '/list/events',
      '/list/announcements',
      '/list/messages'
    ],
    restrictedRoutes: [
      '/admin',
      '/list/teachers',
      '/list/subjects',
      '/list/classes',
      '/list/lessons',
      '/system_settings'
    ]
  },
  {
    role: 'teacher',
    roleName: 'Teacher',
    roleNameArabic: 'معلم',
    permissions: ALL_PERMISSIONS.filter(p => [
      'login',
      'dashboard_access',
      'manage_students',
      'manage_attendance',
      'manage_grades',
      'manage_assignments',
      'manage_events',
      'view_reports',
      'manage_messages',
      'view_messages'
    ].includes(p.id)),
    allowedRoutes: [
      '/teacher',
      '/profile',
      '/list/students',
      '/list/attendance',
      '/grades',
      '/list/assignments',
      '/list/events',
      '/list/announcements',
      '/list/messages'
    ],
    restrictedRoutes: [
      '/admin',
      '/staff',
      '/list/teachers',
      '/list/parents',
      '/list/subjects',
      '/list/classes',
      '/list/lessons',
      '/system_settings'
    ]
  },
  {
    role: 'student',
    roleName: 'Student',
    roleNameArabic: 'طالب',
    permissions: ALL_PERMISSIONS.filter(p => [
      'login',
      'dashboard_access',
      'view_attendance',
      'view_grades',
      'view_assignments',
      'view_events',
      'view_messages'
    ].includes(p.id)),
    allowedRoutes: [
      '/student',
      '/profile',
      '/list/attendance',
      '/grades',
      '/list/assignments',
      '/list/events',
      '/list/announcements',
      '/list/messages'
    ],
    restrictedRoutes: [
      '/admin',
      '/staff',
      '/teacher',
      '/list/teachers',
      '/list/students',
      '/list/parents',
      '/list/subjects',
      '/list/classes',
      '/list/lessons',
      '/list/exams',
      '/system_settings'
    ]
  },
  {
    role: 'parent',
    roleName: 'Parent',
    roleNameArabic: 'ولي أمر',
    permissions: ALL_PERMISSIONS.filter(p => [
      'login',
      'dashboard_access',
      'view_attendance',
      'view_grades',
      'view_assignments',
      'view_events',
      'view_announcements',
      'view_messages'
    ].includes(p.id)),
    allowedRoutes: [
      '/parent',
      '/profile',
      '/list/attendance',
      '/grades',
      '/list/assignments',
      '/list/events',
      '/list/announcements',
      '/list/messages'
    ],
    restrictedRoutes: [
      '/admin',
      '/staff',
      '/teacher',
      '/student',
      '/list/teachers',
      '/list/students',
      '/list/parents',
      '/list/subjects',
      '/list/classes',
      '/list/lessons',
      '/list/exams',
      '/system_settings'
    ]
  }
];

// دوال مساعدة للصلاحيات
export const hasPermission = (userRole: UserRole, permissionId: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === userRole);
  if (!rolePermissions) return false;
  
  return rolePermissions.permissions.some(p => p.id === permissionId);
};

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  console.log('=== canAccessRoute DEBUG ===');
  console.log('userRole:', userRole);
  console.log('route:', route);
  
  // إزالة query parameters من المسار للتحقق
  const cleanRoute = route.split('?')[0];
  console.log('cleanRoute:', cleanRoute);
  
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === userRole);
  console.log('rolePermissions:', rolePermissions);
  
  if (!rolePermissions) {
    console.log('No role permissions found for role:', userRole);
    return false;
  }
  
  // التحقق من المسارات المقيدة
  const isRestricted = rolePermissions.restrictedRoutes.some(restricted => cleanRoute.startsWith(restricted));
  console.log('isRestricted:', isRestricted);
  console.log('restrictedRoutes:', rolePermissions.restrictedRoutes);
  
  if (isRestricted) {
    console.log('Route is restricted');
    return false;
  }
  
  // التحقق من المسارات المسموحة
  const isAllowed = rolePermissions.allowedRoutes.some(allowed => cleanRoute.startsWith(allowed));
  console.log('isAllowed:', isAllowed);
  console.log('allowedRoutes:', rolePermissions.allowedRoutes);
  
  console.log('Final result:', isAllowed);
  return isAllowed;
};

export const getUserRolePermissions = (userRole: UserRole): RolePermissions | undefined => {
  return ROLE_PERMISSIONS.find(rp => rp.role === userRole);
};

export const getRoleNameInArabic = (userRole: UserRole): string => {
  const rolePermissions = getUserRolePermissions(userRole);
  return rolePermissions?.roleNameArabic || 'مستخدم';
};

export const getRoleNameInEnglish = (userRole: UserRole): string => {
  const rolePermissions = getUserRolePermissions(userRole);
  return rolePermissions?.roleName || 'User';
};

