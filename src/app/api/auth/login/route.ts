import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface User {
    id: string;
    username: string;
    name: string;
    role: string;
}

interface TestAccount {
    username: string;
    password: string;
    role: string;
    name: string;
}

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'يجب إدخال اسم المستخدم وكلمة المرور' },
                { status: 400 }
            );
        }

        // التحقق من بيانات تسجيل الدخول
        let user: User | null = null;
        let role = '';

        // التحقق من حساب Admin
        if (username === 'admin2025' && password === 'AdminSystem2025!@#$%') {
            const admin = await prisma.admin.findFirst({
                where: { username: 'admin2025' }
            });
            
            if (admin) {
                user = {
                    id: admin.id,
                    username: admin.username,
                    name: 'مدير النظام',
                    role: 'admin'
                };
                role = 'admin';
            }
        }

        // التحقق من حساب Staff (إضافة اختيارية)
        if (!user && username.startsWith('staff_')) {
            // يمكن إضافة تحقق من Staff هنا
        }

        // التحقق من حساب Teacher
        if (!user && username.startsWith('teacher_')) {
            // يمكن إضافة تحقق من Teachers هنا
        }

        // التحقق من حساب Student
        if (!user && username.startsWith('student_')) {
            // يمكن إضافة تحقق من Students هنا
        }

        // حسابات تجريبية إضافية
        const testAccounts: TestAccount[] = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'مدير النظام'
            },
            {
                username: 'staff',
                password: 'staff123',
                role: 'staff',
                name: 'موظف إداري'
            },
            {
                username: 'teacher',
                password: 'teacher123',
                role: 'teacher',
                name: 'معلم'
            },
            {
                username: 'student',
                password: 'student123',
                role: 'student',
                name: 'طالب'
            }
        ];

        // التحقق من الحسابات التجريبية
        if (!user) {
            const testAccount = testAccounts.find(
                acc => acc.username === username && acc.password === password
            );

            if (testAccount) {
                user = {
                    id: `test_${testAccount.role}_${Date.now()}`,
                    username: testAccount.username,
                    name: testAccount.name,
                    role: testAccount.role
                };
                role = testAccount.role;
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
                { status: 401 }
            );
        }

        // إنشاء session token بسيط
        const sessionToken = Buffer.from(
            JSON.stringify({
                userId: user?.id,
                username: user?.username,
                role: user?.role,
                loginTime: Date.now()
            })
        ).toString('base64');

        // إعداد cookie للجلسة
        const response = NextResponse.json({
            success: true,
            user: user,
            message: 'تم تسجيل الدخول بنجاح'
        });

        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // أسبوع واحد
        });

        return response;

    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        return NextResponse.json(
            { error: 'خطأ في الخادم' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
