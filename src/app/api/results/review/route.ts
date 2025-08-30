import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const classId = searchParams.get('classId')
    const search = searchParams.get('search')

    let whereClause: any = {}

    if (status && status !== 'all') {
      whereClause.status = status
    }

    if (classId && classId !== 'all') {
      whereClause.student = {
        classId: parseInt(classId)
      }
    }

    if (search) {
      whereClause.OR = [
        {
          student: {
            fullName: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          student: {
            studentId: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          subject: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    const reviewData = await prisma.subjectGrade.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            studentId: true,
            class: {
              select: {
                name: true
              }
            }
          }
        },
        subject: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // تحويل البيانات إلى الشكل المطلوب
    const formattedData = reviewData.map(item => ({
      id: item.id,
      studentName: item.student.fullName,
      studentId: item.student.studentId,
      class: item.student.class.name,
      subject: item.subject.name,
      currentGrade: item.grade,
      previousGrade: item.previousGrade || item.grade,
      difference: item.previousGrade ? item.grade - item.previousGrade : 0,
      status: item.status || 'قيد المراجعة',
      reviewDate: item.updatedAt.toISOString().split('T')[0]
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching review data:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات المراجعة' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, subjectId, newGrade, reason } = body

    // تحديث الدرجة
    const updatedGrade = await prisma.subjectGrade.update({
      where: {
        studentId_subjectId: {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId)
        }
      },
      data: {
        grade: parseFloat(newGrade),
        status: 'تم المراجعة',
        reviewReason: reason,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedGrade)
  } catch (error) {
    console.error('Error updating grade:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الدرجة' },
      { status: 500 }
    )
  }
}
