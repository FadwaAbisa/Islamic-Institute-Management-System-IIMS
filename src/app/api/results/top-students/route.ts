import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const limit = searchParams.get('limit') || '10'

    let whereClause: any = {}

    if (classId && classId !== 'all') {
      whereClause.student = {
        classId: parseInt(classId)
      }
    }

    // جلب جميع درجات الطلاب مع حساب المعدل
    const studentsWithGrades = await prisma.student.findMany({
      where: whereClause,
      include: {
        subjectGrades: {
          include: {
            subject: true
          }
        },
        class: true
      }
    })

    // حساب المعدل لكل طالب
    const studentsWithAverages = studentsWithGrades.map(student => {
      const totalGrade = student.subjectGrades.reduce((sum, grade) => sum + grade.grade, 0)
      const average = student.subjectGrades.length > 0 ? totalGrade / student.subjectGrades.length : 0
      
      return {
        id: student.id,
        studentName: student.fullName,
        studentId: student.studentId,
        class: student.class.name,
        totalGrade,
        average: Math.round(average * 100) / 100,
        subjects: student.subjectGrades.reduce((acc, grade) => {
          acc[grade.subject.name] = grade.grade
          return acc
        }, {} as Record<string, number>),
        improvement: '+0%' // سيتم حسابها لاحقاً
      }
    })

    // ترتيب الطلاب حسب المعدل
    const sortedStudents = studentsWithAverages
      .sort((a, b) => b.average - a.average)
      .slice(0, parseInt(limit))
      .map((student, index) => ({
        ...student,
        rank: index + 1
      }))

    return NextResponse.json(sortedStudents)
  } catch (error) {
    console.error('Error fetching top students:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الأوائل' },
      { status: 500 }
    )
  }
}
