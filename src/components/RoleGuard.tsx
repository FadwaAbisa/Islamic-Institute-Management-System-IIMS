"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  fallbackRoute?: string;
}

const RoleGuard = ({ allowedRoles, children, fallbackRoute = "/" }: RoleGuardProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      // الحصول على دور المستخدم من عدة مصادر
      const userRole = 
        user.publicMetadata?.role || 
        localStorage.getItem('userRole') || 
        'student'; // افتراضي

      // تحديث localStorage بالدور إذا لم يكن موجوداً
      if (!localStorage.getItem('userRole') && user.publicMetadata?.role) {
        localStorage.setItem('userRole', user.publicMetadata.role as string);
      }

      // إضافة معلومات debugging مفصلة
      console.log('=== ROLE DEBUG INFO ===');
      console.log('user.publicMetadata?.role:', user.publicMetadata?.role);
      console.log('localStorage userRole:', localStorage.getItem('userRole'));
      console.log('Final userRole:', userRole);
      console.log('allowedRoles:', allowedRoles);

      // فحص الصلاحيات (تحويل كل شيء للحروف الصغيرة للمقارنة)
      const normalizedUserRole = String(userRole).toLowerCase();
      const normalizedAllowedRoles = allowedRoles.map(role => String(role).toLowerCase());
      
      const hasPermission = normalizedAllowedRoles.includes(normalizedUserRole) || 
                           normalizedAllowedRoles.includes('all') ||
                           normalizedUserRole === 'admin'; // المدير له صلاحية الوصول لكل شيء
      
      console.log('normalizedUserRole:', normalizedUserRole);
      console.log('normalizedAllowedRoles:', normalizedAllowedRoles);
      console.log('hasPermission:', hasPermission);
      console.log('======================');

      if (!hasPermission) {
        console.log(`❌ PERMISSION DENIED - User role: ${userRole}, Required roles: ${allowedRoles.join(', ')}`);
        router.push(`/role-setup?error=insufficient_permissions&required=${allowedRoles.join(',')}&current=${userRole}`);
        return;
      } else {
        console.log(`✅ PERMISSION GRANTED - User role: ${userRole} can access roles: ${allowedRoles.join(', ')}`);
      }
    }
  }, [isLoaded, user, router, allowedRoles, fallbackRoute]);

  // عرض شاشة التحميل أثناء فحص الصلاحيات
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن هناك مستخدم، إعادة توجيه لتسجيل الدخول
  if (!user) {
    return null;
  }

  // عرض المحتوى إذا كانت الصلاحيات صحيحة
  return <>{children}</>;
};

export default RoleGuard;
