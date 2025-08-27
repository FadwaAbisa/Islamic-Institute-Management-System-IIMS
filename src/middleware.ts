import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { canAccessRoute } from "./lib/permissions";
import { clerkClient } from "@clerk/nextjs/server";

// تعريف المسارات المحمية
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/staff(.*)',
  '/teacher(.*)',
  '/student(.*)',
  '/parent(.*)',
  '/list(.*)',
  '/grades(.*)',
  '/settings(.*)',
  '/profile(.*)',
]);

// تعريف المسارات العامة (غير محمية)
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/auth(.*)',
  '/favicon.ico',
  '/_next(.*)',
  '/images(.*)',
  '/icons(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = new URL(req.url);

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    try {
      const { userId, sessionClaims } = await auth();

      if (!userId) {
        const signInUrl = new URL('/', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }

      // الحصول على الدور من Clerk API
      let userRole: string | undefined;

      try {
        const user = await clerkClient.users.getUser(userId);
        userRole = user.publicMetadata.role as string;
        console.log('Role from Clerk API:', userRole);
      } catch (apiError) {
        console.log('Could not get user from Clerk API:', apiError);
        // Fallback to session claims
        userRole = (sessionClaims?.publicMetadata as { role?: string })?.role;
      }

      // إضافة debug logging
      console.log('=== MIDDLEWARE DEBUG ===');
      console.log('Pathname:', pathname);
      console.log('User ID:', userId);
      console.log('Session Claims:', sessionClaims);
      console.log('User Role:', userRole);

      if (!userRole) {
        console.log('No role found, redirecting to no_role error');
        return NextResponse.redirect(new URL('/?error=no_role', req.url));
      }

      if (!canAccessRoute(userRole as any, pathname)) {
        const redirectUrl = new URL(`/${userRole}?error=insufficient_permissions`, req.url);
        return NextResponse.redirect(redirectUrl);
      }

      return NextResponse.next();

    } catch (error) {
      console.error('خطأ في middleware:', error);
      const signInUrl = new URL('/', req.url);
      signInUrl.searchParams.set('error', 'system_error');
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};