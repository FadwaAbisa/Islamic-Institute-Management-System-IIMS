// نظام حماية المسارات
// Route Protection System

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { canAccessRoute, getUserRolePermissions, UserRole } from "./permissions";

export interface RouteGuardOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * دالة حماية المسار - تتحقق من صلاحيات المستخدم
 * Route Guard Function - Checks user permissions
 */
export async function protectRoute(
  request: NextRequest,
  options: RouteGuardOptions = {}
): Promise<{ 
  isAuthorized: boolean; 
  userRole?: UserRole; 
  userId?: string;
  redirectUrl?: string;
  error?: string;
}> {
  const { requireAuth = true, allowedRoles = [], redirectTo = '/' } = options;

  try {
    // التحقق من تسجيل الدخول
    const { userId, sessionClaims } = await auth();
    
    if (requireAuth && !userId) {
      return {
        isAuthorized: false,
        redirectUrl: `/?redirect_url=${encodeURIComponent(request.url)}`,
        error: 'يجب تسجيل الدخول للوصول لهذه الصفحة'
      };
    }

    if (!userId) {
      return { isAuthorized: true };
    }

    // الحصول على دور المستخدم
    const userRole = (sessionClaims?.metadata as { role?: UserRole })?.role as UserRole;
    
    if (!userRole) {
      return {
        isAuthorized: false,
        redirectUrl: '/?error=no_role',
        error: 'لم يتم تحديد دور المستخدم'
      };
    }

    // التحقق من الأدوار المسموحة
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      const rolePermissions = getUserRolePermissions(userRole);
      return {
        isAuthorized: false,
        userRole,
        redirectUrl: `/${userRole}?error=insufficient_permissions`,
        error: `لا تملك صلاحيات كافية. دورك: ${rolePermissions?.roleNameArabic || 'غير محدد'}`
      };
    }

    // التحقق من صلاحية الوصول للمسار
    const currentPath = new URL(request.url).pathname;
    if (!canAccessRoute(userRole, currentPath)) {
      const rolePermissions = getUserRolePermissions(userRole);
      return {
        isAuthorized: false,
        userRole,
        redirectUrl: `/${userRole}?error=route_access_denied`,
        error: `لا يمكنك الوصول لهذا المسار. دورك: ${rolePermissions?.roleNameArabic || 'غير محدد'}`
      };
    }

    return {
      isAuthorized: true,
      userRole,
      userId
    };

  } catch (error) {
    console.error('خطأ في حماية المسار:', error);
    return {
      isAuthorized: false,
      redirectUrl: '/?error=system_error',
      error: 'خطأ في النظام'
    };
  }
}

/**
 * دالة إنشاء استجابة إعادة التوجيه
 * Function to create redirect response
 */
export function createRedirectResponse(url: string, status: number = 302): NextResponse {
  return NextResponse.redirect(url, status);
}

/**
 * دالة إنشاء استجابة خطأ
 * Function to create error response
 */
export function createErrorResponse(message: string, status: number = 403): NextResponse {
  return NextResponse.json(
    { 
      error: message,
      timestamp: new Date().toISOString(),
      status 
    }, 
    { status }
  );
}

/**
 * دالة حماية API Route
 * Function to protect API routes
 */
export async function protectApiRoute(
  request: NextRequest,
  options: RouteGuardOptions = {}
): Promise<NextResponse | null> {
  const guardResult = await protectRoute(request, options);
  
  if (!guardResult.isAuthorized) {
    if (guardResult.redirectUrl) {
      return createRedirectResponse(guardResult.redirectUrl);
    } else {
      return createErrorResponse(guardResult.error || 'غير مصرح', 403);
    }
  }
  
  return null; // يعني أن المستخدم مصرح له
}

/**
 * دالة حماية Page Route
 * Function to protect page routes
 */
export async function protectPageRoute(
  request: NextRequest,
  options: RouteGuardOptions = {}
): Promise<NextResponse | null> {
  const guardResult = await protectRoute(request, options);
  
  if (!guardResult.isAuthorized && guardResult.redirectUrl) {
    return createRedirectResponse(guardResult.redirectUrl);
  }
  
  return null; // يعني أن المستخدم مصرح له
}

/**
 * دالة التحقق من الصلاحيات في المكونات
 * Function to check permissions in components
 */
export function checkComponentPermission(
  userRole: UserRole | undefined,
  requiredPermission: string,
  fallback: boolean = false
): boolean {
  if (!userRole) return fallback;
  
  // استيراد ديناميكي لتجنب مشاكل SSR
  try {
    const { hasPermission } = require('./permissions');
    return hasPermission(userRole, requiredPermission);
  } catch {
    return fallback;
  }
}

/**
 * دالة إنشاء قائمة المسارات المسموحة للمستخدم
 * Function to create list of allowed routes for user
 */
export function getUserAllowedRoutes(userRole: UserRole | undefined): string[] {
  if (!userRole) return [];
  
  try {
    const { getUserRolePermissions } = require('./permissions');
    const rolePermissions = getUserRolePermissions(userRole);
    return rolePermissions?.allowedRoutes || [];
  } catch {
    return [];
  }
}

/**
 * دالة إنشاء قائمة المسارات المقيدة للمستخدم
 * Function to create list of restricted routes for user
 */
export function getUserRestrictedRoutes(userRole: UserRole | undefined): string[] {
  if (!userRole) return [];
  
  try {
    const { getUserRolePermissions } = require('./permissions');
    const rolePermissions = getUserRolePermissions(userRole);
    return rolePermissions?.restrictedRoutes || [];
  } catch {
    return [];
  }
}

