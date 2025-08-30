import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'تم تسجيل الخروج بنجاح'
        });

        // حذف cookie الجلسة
        response.cookies.delete('session');

        return response;

    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        return NextResponse.json(
            { error: 'خطأ في الخادم' },
            { status: 500 }
        );
    }
}
