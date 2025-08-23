import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const year = searchParams.get('year')
    const search = searchParams.get('search')

    let whereClause: any = {
      status: 'معتمد'
    }

    if (classId && classId !== 'all') {
      whereClause.student = {
        classId: parseInt(classId)
      }
    }

    if (year && year !== 'all') {
      whereClause.academicYear = year
    }

    if (search) {
      whereClause.student = {
        ...whereClause.student,
        OR: [
          {
            fullName: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            studentId: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      }
    }

    // جلب الكشوفات المعتمدة
    const approvedTranscripts = await prisma.student.findMany({
      where: whereClause,
      include: {
        class: true,
        subjectGrades: {
          where: {
            status: 'معتمد'
          },
          include: {
            subject: true
          }
        }
      }
    })

    // تحويل البيانات إلى الشكل المطلوب
    const formattedTranscripts = approvedTranscripts.map(student => {
      const totalGrade = student.subjectGrades.reduce((sum, grade) => sum + grade.grade, 0)
      const average = student.subjectGrades.length > 0 ? totalGrade / student.subjectGrades.length : 0
      
      return {
        id: student.id,
        studentName: student.fullName,
        studentId: student.studentId,
        class: student.class.name,
        academicYear: '2023-2024', // يمكن تحديثها لاحقاً
        semester: 'الفصل الدراسي الثاني',
        approvalDate: student.updatedAt.toISOString().split('T')[0],
        approvalStatus: 'معتمد',
        totalGrade: Math.round(totalGrade * 100) / 100,
        average: Math.round(average * 100) / 100,
        subjects: student.subjectGrades.map(grade => ({
          name: grade.subject.name,
          grade: grade.grade,
          maxGrade: 100
        })),
        remarks: average >= 95 ? 'متفوق - ناجح' : average >= 85 ? 'ممتاز - ناجح' : 'جيد - ناجح'
      }
    })

    return NextResponse.json(formattedTranscripts)
  } catch (error) {
    console.error('Error fetching approved transcripts:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الكشوفات المعتمدة' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, action } = body

    if (action === 'approve') {
      // اعتماد جميع درجات الطالب
      await prisma.subjectGrade.updateMany({
        where: {
          studentId: parseInt(studentId)
        },
        data: {
          status: 'معتمد',
          updatedAt: new Date()
        }
      })

      return NextResponse.json({ message: 'تم اعتماد درجات الطالب بنجاح' })
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
  } catch (error) {
    console.error('Error updating transcript status:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث حالة الكشف' },
      { status: 500 }
    )
  }
}
