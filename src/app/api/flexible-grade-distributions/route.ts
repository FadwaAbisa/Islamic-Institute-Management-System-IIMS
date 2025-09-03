import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - استرجاع جميع التوزيعات أو توزيع محدد
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const educationLevel = searchParams.get('educationLevel')
        const studySystem = searchParams.get('studySystem')

        let distributions

        if (educationLevel && studySystem) {
            // البحث عن توزيع محدد
            distributions = await prisma.flexibleGradeDistribution.findUnique({
                where: {
                    educationLevel_studySystem: {
                        educationLevel,
                        studySystem
                    }
                }
            })
        } else {
            // استرجاع جميع التوزيعات
            distributions = await prisma.flexibleGradeDistribution.findMany({
                orderBy: [
                    { educationLevel: 'asc' },
                    { studySystem: 'asc' }
                ]
            })
        }

        return NextResponse.json(distributions)
    } catch (error) {
        console.error('خطأ في استرجاع توزيعات الدرجات:', error)
        return NextResponse.json(
            { error: 'فشل في استرجاع توزيعات الدرجات' },
            { status: 500 }
        )
    }
}

// POST - إنشاء توزيع جديد
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // التحقق من وجود توزيع بنفس المرحلة والنظام
        const existingDistribution = await prisma.flexibleGradeDistribution.findUnique({
            where: {
                educationLevel_studySystem: {
                    educationLevel: data.educationLevel,
                    studySystem: data.studySystem
                }
            }
        })

        if (existingDistribution) {
            return NextResponse.json(
                { error: 'يوجد توزيع بالفعل لهذه المرحلة والنظام' },
                { status: 400 }
            )
        }

        const distribution = await prisma.flexibleGradeDistribution.create({
            data: {
                name: data.name,
                educationLevel: data.educationLevel,
                studySystem: data.studySystem,
                
                // إعدادات الفترة الأولى
                firstPeriodMonthsCount: data.firstPeriodMonthsCount,
                firstPeriodMonthlyGrade: data.firstPeriodMonthlyGrade,
                firstPeriodPeriodExam: data.firstPeriodPeriodExam,
                
                // إعدادات الفترة الثانية
                secondPeriodMonthsCount: data.secondPeriodMonthsCount,
                secondPeriodMonthlyGrade: data.secondPeriodMonthlyGrade,
                secondPeriodPeriodExam: data.secondPeriodPeriodExam,
                
                // إعدادات الفترة الثالثة
                thirdPeriodMonthsCount: data.thirdPeriodMonthsCount,
                thirdPeriodMonthlyGrade: data.thirdPeriodMonthlyGrade,
                thirdPeriodPeriodExam: data.thirdPeriodPeriodExam,
                thirdPeriodTotalGrade: data.thirdPeriodTotalGrade || 0,
                
                // إعدادات الحساب النهائي
                firstAndSecondWeight: data.firstAndSecondWeight,
                thirdPeriodWeight: data.thirdPeriodWeight,
                totalGrade: data.totalGrade
            }
        })

        return NextResponse.json(distribution, { status: 201 })
    } catch (error) {
        console.error('خطأ في إنشاء توزيع الدرجات:', error)
        return NextResponse.json(
            { error: 'فشل في إنشاء توزيع الدرجات' },
            { status: 500 }
        )
    }
}

// PUT - تحديث توزيع موجود
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json()
        const { searchParams } = new URL(request.url)
        const educationLevel = searchParams.get('educationLevel')
        const studySystem = searchParams.get('studySystem')

        if (!educationLevel || !studySystem) {
            return NextResponse.json(
                { error: 'يجب تحديد المرحلة التعليمية ونظام الدراسة' },
                { status: 400 }
            )
        }

        const distribution = await prisma.flexibleGradeDistribution.update({
            where: {
                educationLevel_studySystem: {
                    educationLevel,
                    studySystem
                }
            },
            data: {
                name: data.name,
                
                // إعدادات الفترة الأولى
                firstPeriodMonthsCount: data.firstPeriodMonthsCount,
                firstPeriodMonthlyGrade: data.firstPeriodMonthlyGrade,
                firstPeriodPeriodExam: data.firstPeriodPeriodExam,
                
                // إعدادات الفترة الثانية
                secondPeriodMonthsCount: data.secondPeriodMonthsCount,
                secondPeriodMonthlyGrade: data.secondPeriodMonthlyGrade,
                secondPeriodPeriodExam: data.secondPeriodPeriodExam,
                
                // إعدادات الفترة الثالثة
                thirdPeriodMonthsCount: data.thirdPeriodMonthsCount,
                thirdPeriodMonthlyGrade: data.thirdPeriodMonthlyGrade,
                thirdPeriodPeriodExam: data.thirdPeriodPeriodExam,
                thirdPeriodTotalGrade: data.thirdPeriodTotalGrade || 0,
                
                // إعدادات الحساب النهائي
                firstAndSecondWeight: data.firstAndSecondWeight,
                thirdPeriodWeight: data.thirdPeriodWeight,
                totalGrade: data.totalGrade
            }
        })

        return NextResponse.json(distribution)
    } catch (error) {
        console.error('خطأ في تحديث توزيع الدرجات:', error)
        return NextResponse.json(
            { error: 'فشل في تحديث توزيع الدرجات' },
            { status: 500 }
        )
    }
}

// DELETE - حذف توزيع
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const educationLevel = searchParams.get('educationLevel')
        const studySystem = searchParams.get('studySystem')

        if (!educationLevel || !studySystem) {
            return NextResponse.json(
                { error: 'يجب تحديد المرحلة التعليمية ونظام الدراسة' },
                { status: 400 }
            )
        }

        await prisma.flexibleGradeDistribution.delete({
            where: {
                educationLevel_studySystem: {
                    educationLevel,
                    studySystem
                }
            }
        })

        return NextResponse.json({ message: 'تم حذف التوزيع بنجاح' })
    } catch (error) {
        console.error('خطأ في حذف توزيع الدرجات:', error)
        return NextResponse.json(
            { error: 'فشل في حذف توزيع الدرجات' },
            { status: 500 }
        )
    }
}
