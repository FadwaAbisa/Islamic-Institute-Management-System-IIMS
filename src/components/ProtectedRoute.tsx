"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionFromLocalStorage } from '@/lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    redirectTo?: string;
}

const ProtectedRoute = ({ 
    children, 
    allowedRoles = [], 
    redirectTo = '/simple-login' 
}: ProtectedRouteProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const user = getSessionFromLocalStorage();
            
            if (!user) {
                router.push(redirectTo);
                return;
            }

            // التحقق من الأدوار المسموحة
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                router.push(`/${user.role}`); // توجيه لصفحة الدور الصحيح
                return;
            }

            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router, allowedRoles, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lamaPurpleLight to-lamaPurple">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">جاري التحقق من صلاحية الدخول...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // سيتم إعادة التوجيه
    }

    return <>{children}</>;
};

export default ProtectedRoute;
