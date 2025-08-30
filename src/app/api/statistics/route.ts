import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // جلب إحصائيات الطلاب
        const studentsCount = await prisma.student.count({
            where: {
                studentStatus: {
                    in: ['ACTIVE'] // الطلاب النشطين فقط
                }
            }
        });

        // جلب إحصائيات الموظفين
        const staffCount = await prisma.staff.count();

        // جلب إحصائيات المعلمين
        const teachersCount = await prisma.teacher.count({
            where: {
                employmentStatus: {
                    in: ['APPOINTMENT', 'CONTRACT', 'SECONDMENT'] // المعلمين النشطين
                }
            }
        });

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
        return NextResponse.json(
            { error: 'فشل في جلب الإحصائيات' },
            { status: 500 }
        );
    }
}
