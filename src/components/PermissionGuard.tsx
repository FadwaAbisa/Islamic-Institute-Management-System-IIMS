"use client";

import { ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { hasPermission, UserRole } from '@/lib/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission: string;
  userRole?: UserRole;
  fallback?: ReactNode;
  showFallback?: boolean;
}

/**
 * مكون للتحقق من صلاحيات المستخدم
 * Component to check user permissions
 */
const PermissionGuard = ({ 
  children, 
  requiredPermission, 
  userRole, 
  fallback = null,
  showFallback = false 
}: PermissionGuardProps) => {
  const { user } = useUser();
  
  // استخدام الدور الممرر أو الحصول عليه من المستخدم
  const currentUserRole = userRole || (user?.publicMetadata?.role as UserRole);
  
  // التحقق من الصلاحية
  const hasRequiredPermission = hasPermission(currentUserRole, requiredPermission);
  
  // إذا كان لديه الصلاحية، عرض المحتوى
  if (hasRequiredPermission) {
    return <>{children}</>;
  }
  
  // إذا لم يكن لديه الصلاحية وعرض fallback مطلوب
  if (showFallback && fallback) {
    return <>{fallback}</>;
  }
  
  // إذا لم يكن لديه الصلاحية ولا fallback، لا تعرض شيئاً
  return null;
};

export default PermissionGuard;

/**
 * مكون للتحقق من دور المستخدم
 * Component to check user role
 */
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  userRole?: UserRole;
  fallback?: ReactNode;
  showFallback?: boolean;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  userRole, 
  fallback = null,
  showFallback = false 
}: RoleGuardProps) => {
  const { user } = useUser();
  
  // استخدام الدور الممرر أو الحصول عليه من المستخدم
  const currentUserRole = userRole || (user?.publicMetadata?.role as UserRole);
  
  // التحقق من الدور
  const hasAllowedRole = allowedRoles.includes(currentUserRole);
  
  // إذا كان لديه دور مسموح، عرض المحتوى
  if (hasAllowedRole) {
    return <>{children}</>;
  }
  
  // إذا لم يكن لديه دور مسموح وعرض fallback مطلوب
  if (showFallback && fallback) {
    return <>{fallback}</>;
  }
  
  // إذا لم يكن لديه دور مسموح ولا fallback، لا تعرض شيئاً
  return null;
};

/**
 * مكون للتحقق من الصلاحيات مع رسالة خطأ
 * Component to check permissions with error message
 */
interface PermissionGuardWithErrorProps {
  children: ReactNode;
  requiredPermission: string;
  userRole?: UserRole;
  errorMessage?: string;
}

export const PermissionGuardWithError = ({ 
  children, 
  requiredPermission, 
  userRole, 
  errorMessage = "لا تملك صلاحية للوصول لهذا المحتوى" 
}: PermissionGuardWithErrorProps) => {
  const { user } = useUser();
  
  // استخدام الدور الممرر أو الحصول عليه من المستخدم
  const currentUserRole = userRole || (user?.publicMetadata?.role as UserRole);
  
  // التحقق من الصلاحية
  const hasRequiredPermission = hasPermission(currentUserRole, requiredPermission);
  
  // إذا كان لديه الصلاحية، عرض المحتوى
  if (hasRequiredPermission) {
    return <>{children}</>;
  }
  
  // إذا لم يكن لديه الصلاحية، عرض رسالة خطأ
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">غير مصرح</h3>
        <p className="text-gray-600">{errorMessage}</p>
      </div>
    </div>
  );
};

/**
 * Hook للتحقق من الصلاحيات
 * Hook to check permissions
 */
export const usePermission = (requiredPermission: string, userRole?: UserRole) => {
  const { user } = useUser();
  
  // استخدام الدور الممرر أو الحصول عليه من المستخدم
  const currentUserRole = userRole || (user?.publicMetadata?.role as UserRole);
  
  // التحقق من الصلاحية
  const hasRequiredPermission = hasPermission(currentUserRole, requiredPermission);
  
  return {
    hasPermission: hasRequiredPermission,
    userRole: currentUserRole,
    isLoading: !user
  };
};

/**
 * Hook للتحقق من الأدوار
 * Hook to check roles
 */
export const useRole = (allowedRoles: UserRole[], userRole?: UserRole) => {
  const { user } = useUser();
  
  // استخدام الدور الممرر أو الحصول عليه من المستخدم
  const currentUserRole = userRole || (user?.publicMetadata?.role as UserRole);
  
  // التحقق من الدور
  const hasAllowedRole = allowedRoles.includes(currentUserRole);
  
  return {
    hasRole: hasAllowedRole,
    userRole: currentUserRole,
    isLoading: !user
  };
};

