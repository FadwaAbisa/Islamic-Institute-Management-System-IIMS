import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let whereClause: any = {
      OR: [
        { grade: { lt: 60 } }, // درجات أقل من 60
        { status: 'مؤجل للدور الثاني' }
      ]
    }

    if (classId && classId !== 'all') {
      whereClause.student = {
        classId: parseInt(classId)
      }
    }

    if (status && status !== 'all') {
      whereClause.status = status
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

    // جلب الطلاب المؤجلين للدور الثاني
    const secondRoundStudents = await prisma.subjectGrade.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            class: true,
            subjectGrades: {
              include: {
                subject: true
              }
            }
          }
        },
        subject: true
      }
    })

    // تجميع البيانات حسب الطالب
    const studentsMap = new Map()
    
    secondRoundStudents.forEach(grade => {
      const studentId = grade.studentId
      
      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: studentId,
          studentName: grade.student.fullName,
          studentId: grade.student.studentId,
          class: grade.student.class.name,
          failedSubjects: [],
          currentGrades: {},
          requiredGrades: {},
          status: 'قيد الدراسة',
          examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // بعد 30 يوم
          contactInfo: {
            phone: grade.student.phone || 'غير متوفر',
            email: grade.student.email || 'غير متوفر'
          }
        })
      }
      
      const student = studentsMap.get(studentId)
      
      if (grade.grade < 60) {
        student.failedSubjects.push(grade.subject.name)
        student.currentGrades[grade.subject.name] = grade.grade
        student.requiredGrades[grade.subject.name] = 60
      }
    })

    const formattedStudents = Array.from(studentsMap.values())

    return NextResponse.json(formattedStudents)
  } catch (error) {
    console.error('Error fetching second round students:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات طلاب الدور الثاني' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, subjectId, newGrade, examDate } = body

    // تحديث الدرجة وتاريخ الاختبار
    const updatedGrade = await prisma.subjectGrade.update({
      where: {
        studentId_subjectId: {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId)
        }
      },
      data: {
        grade: parseFloat(newGrade),
        status: newGrade >= 60 ? 'ناجح' : 'مؤجل للدور الثاني',
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedGrade)
  } catch (error) {
    console.error('Error updating second round grade:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الدرجة' },
      { status: 500 }
    )
  }
}
