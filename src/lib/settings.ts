export const ITEM_PER_PAGE = 10

// استيراد نظام الصلاحيات الجديد
import { UserRole, canAccessRoute, getUserRolePermissions } from './permissions';

type RouteAccessMap = {
  [key: string]: UserRole[];
};

// تحديث خريطة الوصول للمسارات باستخدام النظام الجديد
export const routeAccessMap: RouteAccessMap = {
  // المسارات الرئيسية
  "/admin(.*)": ["admin"],
  "/staff(.*)": ["staff"],
  "/teacher(.*)": ["teacher"],
  "/student(.*)": ["student"],
  "/parent(.*)": ["parent"],
  
  // إدارة المعلمين
  "/list/teachers": ["admin"],
  "/list/teachers/add": ["admin"],
  "/list/teachers/reports": ["admin"],
  
  // إدارة الطلاب
  "/list/students": ["admin", "staff"],
  "/list/students/add": ["admin", "staff"],
  "/list/students/grades": ["admin", "staff", "teacher"],
  "/list/students/reviews": ["admin", "staff"],
  "/list/students/view_student": ["admin", "staff", "teacher"],
  "/list/students/import": ["admin", "staff"],
  
  // إدارة أولياء الأمور
  "/list/parents": ["admin", "staff"],
  "/list/parents/add": ["admin", "staff"],
  "/list/parents/messages": ["admin", "staff"],
  
  // إدارة المواد الدراسية
  "/list/subjects": ["admin"],
  "/list/subjects/add": ["admin"],
  "/list/subjects/curriculum": ["admin"],
  
  // إدارة الفصول
  "/list/classes": ["admin", "staff"],
  "/list/classes/add": ["admin", "staff"],
  "/list/classes/schedule": ["admin", "staff"],
  
  // إدارة الدروس
  "/list/lessons": ["admin", "staff"],
  "/list/lessons/add": ["admin", "staff"],
  
  // إدارة الامتحانات
  "/list/exams": ["admin", "staff", "teacher"],
  "/list/exams/add": ["admin", "staff", "teacher"],
  
  // إدارة الواجبات
  "/list/assignments": ["admin", "staff", "teacher", "student", "parent"],
  "/list/assignments/add": ["admin", "staff", "teacher"],
  
  // إدارة الحضور
  "/list/attendance": ["admin", "staff", "teacher", "student", "parent"],
  "/list/attendance/mark": ["admin", "staff", "teacher"],
  "/list/attendance/stats": ["admin", "staff", "teacher"],
  
  // إدارة الأحداث
  "/list/events": ["admin", "staff", "teacher", "student", "parent"],
  "/list/events/add": ["admin", "staff", "teacher"],
  
  // إدارة الإعلانات
  "/list/announcements": ["admin", "staff", "teacher", "student", "parent"],
  "/list/announcements/add": ["admin", "staff", "teacher"],
  
  // إدارة الدرجات
  "/grades": ["admin", "staff", "teacher", "student", "parent"],
  "/grades/add-grades": ["admin", "staff", "teacher"],
  "/grades/add-student": ["admin", "staff"],
  "/grades/results": ["admin", "staff", "teacher"],
  "/grades/review-requests": ["admin", "staff"],
  
  // إعدادات النظام
  "/settings": ["admin"],
  "/profile": ["admin", "staff", "teacher", "student", "parent"],
};

/**
 * دالة للتحقق من صلاحية الوصول للمسار
 * Function to check route access permission
 */
export function canAccessRouteByRole(userRole: UserRole, route: string): boolean {
  return canAccessRoute(userRole, route);
}

/**
 * دالة للحصول على الأدوار المسموحة للمسار
 * Function to get allowed roles for a route
 */
export function getAllowedRolesForRoute(route: string): UserRole[] {
  // البحث عن المسار في الخريطة
  for (const [pattern, roles] of Object.entries(routeAccessMap)) {
    if (new RegExp(pattern).test(route)) {
      return roles;
    }
  }
  return [];
}

/**
 * دالة للتحقق من صلاحية المستخدم للوصول للمسار
 * Function to check if user can access a route
 */
export function isRouteAccessible(userRole: UserRole, route: string): boolean {
  const allowedRoles = getAllowedRolesForRoute(route);
  return allowedRoles.includes(userRole);
}

/**
 * دالة للحصول على معلومات دور المستخدم
 * Function to get user role information
 */
export function getUserRoleInfo(userRole: UserRole) {
  return getUserRolePermissions(userRole);
}