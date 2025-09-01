import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // جلب إجمالي الطلاب
    const totalStudents = await prisma.student.count();

    // جلب نسبة الحضور (متوسط الحضور لليوم الحالي)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    let attendancePercentage = 0;
    if (todayAttendance.length > 0) {
      const presentCount = todayAttendance.filter(a => a.present).length;
      attendancePercentage = Math.round((presentCount / todayAttendance.length) * 100);
    }

    // جلب الأحداث القادمة (الأحداث التي لم تنتهي بعد)
    const upcomingEvents = await prisma.event.count({
      where: {
        endTime: {
          gte: new Date()
        },
        status: 'ACTIVE'
      }
    });

    // جلب آخر الأنشطة
    const recentActivities = await Promise.all([
      // آخر تسجيل حضور
      prisma.attendance.findFirst({
        where: {
          date: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // آخر 24 ساعة
          }
        },
        orderBy: {
          date: 'desc'
        },
        include: {
          Student: {
            select: {
              fullName: true
            }
          }
        }
      }),
      // آخر طالب تم إضافته
      prisma.student.findFirst({
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          fullName: true,
          createdAt: true
        }
      })
    ]);

    const stats = {
      totalStudents,
      attendancePercentage,
      upcomingEvents,
      recentActivities: {
        lastAttendance: recentActivities[0] ? {
          studentName: recentActivities[0].Student.fullName,
          date: recentActivities[0].date
        } : null,
        lastStudentAdded: recentActivities[1] ? {
          studentName: recentActivities[1].fullName,
          date: recentActivities[1].createdAt
        } : null
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('خطأ في جلب إحصائيات الموظف:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الإحصائيات' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
