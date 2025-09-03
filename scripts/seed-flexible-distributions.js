const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const defaultDistributions = [
    // السنة الأولى - نظامي
    {
        name: "السنة الأولى - نظامي",
        educationLevel: "السنة الأولى",
        studySystem: "نظامي",
        
        // إعدادات الفترة الأولى
        firstPeriodMonthsCount: 2,
        firstPeriodMonthlyGrade: 12,
        firstPeriodPeriodExam: 12,
        
        // إعدادات الفترة الثانية
        secondPeriodMonthsCount: 2,
        secondPeriodMonthlyGrade: 12,
        secondPeriodPeriodExam: 12,
        
        // إعدادات الفترة الثالثة
        thirdPeriodMonthsCount: 0,
        thirdPeriodMonthlyGrade: 0,
        thirdPeriodPeriodExam: 20,
        thirdPeriodTotalGrade: 20,
        
        // إعدادات الحساب النهائي
        firstAndSecondWeight: 0.4,
        thirdPeriodWeight: 0.2,
        totalGrade: 100
    },
    // السنة الأولى - انتساب
    {
        name: "السنة الأولى - انتساب",
        educationLevel: "السنة الأولى",
        studySystem: "انتساب",
        
        // إعدادات الفترة الأولى
        firstPeriodMonthsCount: 0,
        firstPeriodMonthlyGrade: 0,
        firstPeriodPeriodExam: 0,
        
        // إعدادات الفترة الثانية
        secondPeriodMonthsCount: 0,
        secondPeriodMonthlyGrade: 0,
        secondPeriodPeriodExam: 0,
        
        // إعدادات الفترة الثالثة
        thirdPeriodMonthsCount: 0,
        thirdPeriodMonthlyGrade: 0,
        thirdPeriodPeriodExam: 25,
        thirdPeriodTotalGrade: 25,
        
        // إعدادات الحساب النهائي
        firstAndSecondWeight: 0,
        thirdPeriodWeight: 1.0,
        totalGrade: 100
    },
    // السنة الثانية - نظامي
    {
        name: "السنة الثانية - نظامي",
        educationLevel: "السنة الثانية",
        studySystem: "نظامي",
        
        // إعدادات الفترة الأولى
        firstPeriodMonthsCount: 2,
        firstPeriodMonthlyGrade: 12,
        firstPeriodPeriodExam: 12,
        
        // إعدادات الفترة الثانية
        secondPeriodMonthsCount: 2,
        secondPeriodMonthlyGrade: 12,
        secondPeriodPeriodExam: 12,
        
        // إعدادات الفترة الثالثة
        thirdPeriodMonthsCount: 0,
        thirdPeriodMonthlyGrade: 0,
        thirdPeriodPeriodExam: 20,
        thirdPeriodTotalGrade: 20,
        
        // إعدادات الحساب النهائي
        firstAndSecondWeight: 0.4,
        thirdPeriodWeight: 0.2,
        totalGrade: 100
    },
    // السنة الثانية - انتساب
    {
        name: "السنة الثانية - انتساب",
        educationLevel: "السنة الثانية",
        studySystem: "انتساب",
        
        // إعدادات الفترة الأولى
        firstPeriodMonthsCount: 0,
        firstPeriodMonthlyGrade: 0,
        firstPeriodPeriodExam: 0,
        
        // إعدادات الفترة الثانية
        secondPeriodMonthsCount: 0,
        secondPeriodMonthlyGrade: 0,
        secondPeriodPeriodExam: 0,
        
        // إعدادات الفترة الثالثة
        thirdPeriodMonthsCount: 0,
        thirdPeriodMonthlyGrade: 0,
        thirdPeriodPeriodExam: 25,
        thirdPeriodTotalGrade: 25,
        
        // إعدادات الحساب النهائي
        firstAndSecondWeight: 0,
        thirdPeriodWeight: 1.0,
        totalGrade: 100
    },
    // السنة الثالثة - نظامي
    {
        name: "السنة الثالثة - نظامي",
        educationLevel: "السنة الثالثة",
        studySystem: "نظامي",
        
        // إعدادات الفترة الأولى
        firstPeriodMonthsCount: 3,
        firstPeriodMonthlyGrade: 10,
        firstPeriodPeriodExam: 10,
        
        // إعدادات الفترة الثانية
        secondPeriodMonthsCount: 3,
        secondPeriodMonthlyGrade: 10,
        secondPeriodPeriodExam: 10,
        
        // إعدادات الفترة الثالثة
        thirdPeriodMonthsCount: 0,
        thirdPeriodMonthlyGrade: 0,
        thirdPeriodPeriodExam: 0,
        thirdPeriodTotalGrade: 0,
        
        // إعدادات الحساب النهائي
        firstAndSecondWeight: 0.5,
        thirdPeriodWeight: 0,
        totalGrade: 100
    },
    // السنة الثالثة - انتساب
    {
        name: "السنة الثالثة - انتساب",
        educationLevel: "السنة الثالثة",
        studySystem: "انتساب",
        
        // إعدادات الفترة الأولى
        firstPeriodMonthsCount: 0,
        firstPeriodMonthlyGrade: 0,
        firstPeriodPeriodExam: 0,
        
        // إعدادات الفترة الثانية
        secondPeriodMonthsCount: 0,
        secondPeriodMonthlyGrade: 0,
        secondPeriodPeriodExam: 0,
        
        // إعدادات الفترة الثالثة
        thirdPeriodMonthsCount: 0,
        thirdPeriodMonthlyGrade: 0,
        thirdPeriodPeriodExam: 0,
        thirdPeriodTotalGrade: 0,
        
        // إعدادات الحساب النهائي
        firstAndSecondWeight: 0,
        thirdPeriodWeight: 0,
        totalGrade: 100
    }
]

async function seedDistributions() {
    try {
        console.log('🌱 بدء إدراج توزيعات الدرجات الافتراضية...')
        
        for (const distribution of defaultDistributions) {
            try {
                // محاولة إنشاء التوزيع
                const created = await prisma.flexibleGradeDistribution.create({
                    data: distribution
                })
                console.log(`✅ تم إنشاء توزيع: ${created.name}`)
            } catch (error) {
                if (error.code === 'P2002') {
                    // التوزيع موجود بالفعل، جرب التحديث
                    const updated = await prisma.flexibleGradeDistribution.update({
                        where: {
                            educationLevel_studySystem: {
                                educationLevel: distribution.educationLevel,
                                studySystem: distribution.studySystem
                            }
                        },
                        data: distribution
                    })
                    console.log(`🔄 تم تحديث توزيع: ${updated.name}`)
                } else {
                    console.error(`❌ خطأ في إنشاء توزيع ${distribution.name}:`, error.message)
                }
            }
        }
        
        console.log('🎉 تم إدراج جميع توزيعات الدرجات بنجاح!')
    } catch (error) {
        console.error('❌ خطأ في إدراج التوزيعات:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedDistributions()
