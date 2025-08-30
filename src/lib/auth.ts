import { NextRequest } from 'next/server';

export interface User {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'staff' | 'teacher' | 'student';
}

export function getSessionFromCookie(request: NextRequest): User | null {
    try {
        const sessionCookie = request.cookies.get('session');
        
        if (!sessionCookie) {
            return null;
        }

        const sessionData = JSON.parse(
            Buffer.from(sessionCookie.value, 'base64').toString()
        );

        // التحقق من صحة الجلسة (لم تنته صلاحيتها)
        const loginTime = sessionData.loginTime;
        const maxAge = 60 * 60 * 24 * 7 * 1000; // أسبوع بالميللي ثانية
        
        if (Date.now() - loginTime > maxAge) {
            return null; // انتهت صلاحية الجلسة
        }

        return {
            id: sessionData.userId,
            username: sessionData.username,
            name: sessionData.name || sessionData.username,
            role: sessionData.role
        };

    } catch (error) {
        console.error('خطأ في قراءة الجلسة:', error);
        return null;
    }
}

export function getSessionFromLocalStorage(): User | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userStr = localStorage.getItem('user');

        if (isAuthenticated === 'true' && userStr) {
            return JSON.parse(userStr);
        }

        return null;
    } catch (error) {
        console.error('خطأ في قراءة بيانات المستخدم:', error);
        return null;
    }
}

export function clearLocalStorageSession(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
    }
}
