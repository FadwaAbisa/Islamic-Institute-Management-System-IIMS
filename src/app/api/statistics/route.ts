import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // جلب إحصائيات الطلاب (جميع الطلاب)
        const studentsCount = await prisma.student.count();

        // جلب إحصائيات الموظفين
        const staffCount = await prisma.staff.count();

        // جلب إحصائيات المعلمين (جميع المعلمين)
        const teachersCount = await prisma.teacher.count();

        // إحصائيات إضافية
        const totalEvents = await prisma.event.count({
            where: {
                status: 'ACTIVE'
            }
        });

        const totalAnnouncements = await prisma.announcement.count({
            where: {
                status: 'نشط'
            }
        });

        const totalSubjects = await prisma.subject.count();

        // إحصائيات حسب المستوى الدراسي
        const studyLevelStats = await prisma.student.groupBy({
            by: ['studyLevel'],
            _count: {
                id: true
            },
            where: {
                studentStatus: 'ACTIVE',
                studyLevel: {
                    not: null
                }
            }
        });

        // إحصائيات حسب نمط الدراسة
        const studyModeStats = await prisma.student.groupBy({
            by: ['studyMode'],
            _count: {
                id: true
            },
            where: {
                studentStatus: 'ACTIVE',
                studyMode: {
                    not: null
                }
            }
        });

        console.log('Statistics fetched:', {
            students: studentsCount,
            teachers: teachersCount,
            staff: staffCount,
            subjects: totalSubjects
        });

        return NextResponse.json({
            students: studentsCount,
            staff: staffCount,
            teachers: teachersCount,
            events: totalEvents,
            announcements: totalAnnouncements,
            subjects: totalSubjects,
            studyLevelBreakdown: studyLevelStats.map(stat => ({
                level: stat.studyLevel,
                count: stat._count.id
            })),
            studyModeBreakdown: studyModeStats.map(stat => ({
                mode: stat.studyMode,
                count: stat._count.id
            }))
        });

    } catch (error) {
        console.error('Error fetching statistics:', error);
        
        // إرجاع بيانات افتراضية في حالة الخطأ
        return NextResponse.json({
            students: 0,
            staff: 0,
            teachers: 0,
            events: 0,
            announcements: 0,
            subjects: 0,
            studyLevelBreakdown: [],
            studyModeBreakdown: [],
            error: 'فشل في جلب الإحصائيات من قاعدة البيانات'
        }, { status: 200 }); // إرجاع 200 مع بيانات افتراضية بدلاً من 500
    }
}
