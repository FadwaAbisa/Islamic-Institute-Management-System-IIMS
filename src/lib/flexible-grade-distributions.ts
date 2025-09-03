// نظام توزيع الدرجات المرن
export interface FlexibleGradeDistribution {
    id: string
    name: string
    educationLevel: string
    studySystem: string
    periods: {
        firstPeriod: {
            monthsCount: number // عدد الأشهر (2 أو 3)
            monthlyGrade: number // درجة كل شهر
            periodExam: number // درجة امتحان الفترة
        }
        secondPeriod: {
            monthsCount: number
            monthlyGrade: number
            periodExam: number
        }
        thirdPeriod: {
            monthsCount: number
            monthlyGrade: number
            periodExam: number
            totalGrade: number // الدرجة الكلية للفترة الثالثة
        }
    }
    finalCalculation: {
        firstAndSecondWeight: number // وزن الفترتين الأولى والثانية
        thirdPeriodWeight: number // وزن الفترة الثالثة
        totalGrade: number // المجموع الكلي
    }
}

// توزيعات الدرجات الافتراضية
export const defaultGradeDistributions: FlexibleGradeDistribution[] = [
    // السنة الأولى - نظامي
    {
        id: "first-year-regular",
        name: "السنة الأولى - نظامي",
        educationLevel: "السنة الأولى",
        studySystem: "نظامي",
        periods: {
            firstPeriod: {
                monthsCount: 2, // شهرين في الفترة الأولى
                monthlyGrade: 12,
                periodExam: 12
            },
            secondPeriod: {
                monthsCount: 2, // شهرين في الفترة الثانية
                monthlyGrade: 12,
                periodExam: 12
            },
            thirdPeriod: {
                monthsCount: 0, // لا توجد أشهر - امتحان مباشر فقط
                monthlyGrade: 0,
                periodExam: 20, // امتحان الفترة الثالثة
                totalGrade: 20
            }
        },
        finalCalculation: {
            firstAndSecondWeight: 0.4, // 40% لكل فترة
            thirdPeriodWeight: 0.2, // 20% للفترة الثالثة
            totalGrade: 100
        }
    },
    // السنة الأولى - انتساب
    {
        id: "first-year-distance",
        name: "السنة الأولى - انتساب",
        educationLevel: "السنة الأولى",
        studySystem: "انتساب",
        periods: {
            firstPeriod: {
                monthsCount: 0, // لا توجد فترة أولى
                monthlyGrade: 0,
                periodExam: 0
            },
            secondPeriod: {
                monthsCount: 0, // لا توجد فترة ثانية
                monthlyGrade: 0,
                periodExam: 0
            },
            thirdPeriod: {
                monthsCount: 0, // لا توجد أشهر في الفترة الثالثة
                monthlyGrade: 0,
                periodExam: 25, // امتحان السنة الأولى - انتساب
                totalGrade: 25
            }
        },
        finalCalculation: {
            firstAndSecondWeight: 0, // لا توجد فترات أولى وثانية
            thirdPeriodWeight: 1.0, // 100% للفترة الثالثة فقط
            totalGrade: 100
        }
    },
    // السنة الثانية - نظامي
    {
        id: "second-year-regular",
        name: "السنة الثانية - نظامي",
        educationLevel: "السنة الثانية",
        studySystem: "نظامي",
        periods: {
            firstPeriod: {
                monthsCount: 2, // شهرين في الفترة الأولى
                monthlyGrade: 12,
                periodExam: 12
            },
            secondPeriod: {
                monthsCount: 2, // شهرين في الفترة الثانية
                monthlyGrade: 12,
                periodExam: 12
            },
            thirdPeriod: {
                monthsCount: 0, // لا توجد أشهر - امتحان مباشر فقط
                monthlyGrade: 0,
                periodExam: 20, // امتحان الفترة الثالثة
                totalGrade: 20
            }
        },
        finalCalculation: {
            firstAndSecondWeight: 0.4, // 40% لكل فترة
            thirdPeriodWeight: 0.2, // 20% للفترة الثالثة
            totalGrade: 100
        }
    },
    // السنة الثانية - انتساب
    {
        id: "second-year-distance",
        name: "السنة الثانية - انتساب",
        educationLevel: "السنة الثانية",
        studySystem: "انتساب",
        periods: {
            firstPeriod: {
                monthsCount: 0, // لا توجد فترة أولى
                monthlyGrade: 0,
                periodExam: 0
            },
            secondPeriod: {
                monthsCount: 0, // لا توجد فترة ثانية
                monthlyGrade: 0,
                periodExam: 0
            },
            thirdPeriod: {
                monthsCount: 0, // لا توجد أشهر في الفترة الثالثة
                monthlyGrade: 0,
                periodExam: 25, // امتحان السنة الثانية - انتساب
                totalGrade: 25
            }
        },
        finalCalculation: {
            firstAndSecondWeight: 0, // لا توجد فترات أولى وثانية
            thirdPeriodWeight: 1.0, // 100% للفترة الثالثة فقط
            totalGrade: 100
        }
    },
    {
        id: "third-year-regular",
        name: "السنة الثالثة - نظامي",
        educationLevel: "السنة الثالثة",
        studySystem: "نظامي",
        periods: {
            firstPeriod: {
                monthsCount: 3,
                monthlyGrade: 10,
                periodExam: 10
            },
            secondPeriod: {
                monthsCount: 3,
                monthlyGrade: 10,
                periodExam: 10
            },
            thirdPeriod: {
                monthsCount: 0, // لا توجد فترة ثالثة
                monthlyGrade: 0,
                periodExam: 0,
                totalGrade: 0
            }
        },
        finalCalculation: {
            firstAndSecondWeight: 0.5, // 50% لكل فترة
            thirdPeriodWeight: 0,
            totalGrade: 100
        }
    },
    {
        id: "third-year-distance",
        name: "السنة الثالثة - انتساب",
        educationLevel: "السنة الثالثة",
        studySystem: "انتساب",
        periods: {
            firstPeriod: {
                monthsCount: 0,
                monthlyGrade: 0,
                periodExam: 0
            },
            secondPeriod: {
                monthsCount: 0,
                monthlyGrade: 0,
                periodExam: 0
            },
            thirdPeriod: {
                monthsCount: 0, // عرض الأسماء فقط
                monthlyGrade: 0,
                periodExam: 0,
                totalGrade: 0
            }
        },
        finalCalculation: {
            firstAndSecondWeight: 0,
            thirdPeriodWeight: 0,
            totalGrade: 0
        }
    }
]

// الحصول على توزيع الدرجات المناسب
export function getFlexibleGradeDistribution(
    educationLevel: string,
    studySystem: string
): FlexibleGradeDistribution | null {
    return defaultGradeDistributions.find(
        dist => dist.educationLevel === educationLevel && dist.studySystem === studySystem
    ) || null
}

// حساب متوسط درجات الأشهر
export function calculateMonthlyAverage(
    monthGrades: (number | null)[],
    monthsCount: number
): number {
    const validGrades = monthGrades.filter(grade => grade !== null && grade !== undefined) as number[]
    
    if (validGrades.length === 0) return 0
    
    const sum = validGrades.reduce((total, grade) => total + grade, 0)
    return sum / monthsCount
}

// حساب مجموع الفترة
export function calculatePeriodTotal(
    monthlyAverage: number,
    periodExam: number | null,
    distribution: FlexibleGradeDistribution,
    period: 'firstPeriod' | 'secondPeriod' | 'thirdPeriod'
): number {
    const periodConfig = distribution.periods[period]
    
    if (period === 'thirdPeriod') {
        // الفترة الثالثة بدون أشهر - فقط امتحان مباشر
        return periodExam || 0
    }
    
    // الفترتين الأولى والثانية
    return monthlyAverage + (periodExam || 0)
}

// حساب المجموع النهائي
export function calculateFinalTotal(
    firstPeriodTotal: number,
    secondPeriodTotal: number,
    thirdPeriodTotal: number,
    distribution: FlexibleGradeDistribution
): number {
    const { firstAndSecondWeight, thirdPeriodWeight, totalGrade } = distribution.finalCalculation
    
    const weightedFirst = firstPeriodTotal * firstAndSecondWeight
    const weightedSecond = secondPeriodTotal * firstAndSecondWeight
    const weightedThird = thirdPeriodTotal * thirdPeriodWeight
    
    return weightedFirst + weightedSecond + weightedThird
}

// التحقق من صحة الدرجة
export function validateFlexibleGrade(
    grade: number,
    maxGrade: number,
    field: 'monthly' | 'exam'
): { isValid: boolean; error?: string } {
    if (grade < 0) {
        return { isValid: false, error: "الدرجة لا يمكن أن تكون سالبة" }
    }
    
    if (grade > maxGrade) {
        return { isValid: false, error: `الدرجة لا يمكن أن تتجاوز ${maxGrade}` }
    }
    
    if (field === 'monthly' && grade % 0.5 !== 0) {
        return { isValid: false, error: "درجة الشهر يجب أن تكون من مضاعفات 0.5" }
    }
    
    return { isValid: true }
}

// الحصول على معلومات الفترة
export function getPeriodInfo(
    distribution: FlexibleGradeDistribution | null,
    period: 'firstPeriod' | 'secondPeriod' | 'thirdPeriod'
) {
    if (!distribution || !distribution.periods) {
        return {
            monthsCount: 0,
            monthlyGrade: 0,
            periodExam: 0,
            totalGrade: 0,
            isAvailable: false
        }
    }
    
    const periodConfig = distribution.periods[period]
    
    if (!periodConfig) {
        return {
            monthsCount: 0,
            monthlyGrade: 0,
            periodExam: 0,
            totalGrade: 0,
            isAvailable: false
        }
    }
    
    return {
        monthsCount: periodConfig.monthsCount,
        monthlyGrade: periodConfig.monthlyGrade,
        periodExam: periodConfig.periodExam,
        totalGrade: (periodConfig as any).totalGrade || 0,
        isAvailable: periodConfig.monthsCount > 0
    }
}

// حساب النسبة المئوية والتقدير
export function calculatePercentageAndGrade(
    totalGrade: number,
    maxGrade: number
): { percentage: number; grade: string; color: string } {
    const percentage = Math.round((totalGrade / maxGrade) * 100 * 100) / 100 // تقريب لرقمين عشريين
    
    let grade = ""
    let color = ""
    
    if (percentage >= 90) {
        grade = "ممتاز"
        color = "text-green-600"
    } else if (percentage >= 80) {
        grade = "جيد جداً"
        color = "text-blue-600"
    } else if (percentage >= 70) {
        grade = "جيد"
        color = "text-yellow-600"
    } else if (percentage >= 60) {
        grade = "مقبول"
        color = "text-orange-600"
    } else {
        grade = "راسب"
        color = "text-red-600"
    }
    
    return { percentage, grade, color }
}

// سحب الدرجات من الفترتين الأولى والثانية للفترة الثالثة
export function pullGradesFromPreviousPeriods(
    firstPeriodGrades: { month1?: number | null; month2?: number | null; month3?: number | null; periodExam?: number | null },
    secondPeriodGrades: { month1?: number | null; month2?: number | null; month3?: number | null; periodExam?: number | null },
    distribution: FlexibleGradeDistribution
): { firstPeriodTotal: number; secondPeriodTotal: number } {
    // حساب مجموع الفترة الأولى
    const firstPeriodMonthlyGrades = [
        firstPeriodGrades.month1,
        firstPeriodGrades.month2,
        firstPeriodGrades.month3
    ].filter(grade => grade !== null && grade !== undefined) as number[]
    
    const firstPeriodMonthlyAverage = firstPeriodMonthlyGrades.length > 0 
        ? firstPeriodMonthlyGrades.reduce((sum, grade) => sum + grade, 0) / distribution.periods.firstPeriod.monthsCount
        : 0
    
    const firstPeriodTotal = firstPeriodMonthlyAverage + (firstPeriodGrades.periodExam || 0)
    
    // حساب مجموع الفترة الثانية
    const secondPeriodMonthlyGrades = [
        secondPeriodGrades.month1,
        secondPeriodGrades.month2,
        secondPeriodGrades.month3
    ].filter(grade => grade !== null && grade !== undefined) as number[]
    
    const secondPeriodMonthlyAverage = secondPeriodMonthlyGrades.length > 0 
        ? secondPeriodMonthlyGrades.reduce((sum, grade) => sum + grade, 0) / distribution.periods.secondPeriod.monthsCount
        : 0
    
    const secondPeriodTotal = secondPeriodMonthlyAverage + (secondPeriodGrades.periodExam || 0)
    
    return { firstPeriodTotal, secondPeriodTotal }
}

// تحديث التوزيع في الوقت الفعلي
export function updateGradeDistribution(
    distributionId: string,
    updates: Partial<FlexibleGradeDistribution>
): FlexibleGradeDistribution | null {
    const distribution = defaultGradeDistributions.find(dist => dist.id === distributionId)
    if (!distribution) return null
    
    // تحديث التوزيع
    const updatedDistribution = { ...distribution, ...updates }
    
    // تحديث القائمة الافتراضية
    const index = defaultGradeDistributions.findIndex(dist => dist.id === distributionId)
    if (index !== -1) {
        defaultGradeDistributions[index] = updatedDistribution
    }
    
    return updatedDistribution
}

// الحصول على التوزيع المحدث
export function getUpdatedGradeDistribution(
    educationLevel: string,
    studySystem: string
): FlexibleGradeDistribution | null {
    return defaultGradeDistributions.find(
        dist => dist.educationLevel === educationLevel && dist.studySystem === studySystem
    ) || null
}

// تحويل البيانات من قاعدة البيانات إلى تنسيق FlexibleGradeDistribution
export function convertDbToFlexibleDistribution(dbData: any): FlexibleGradeDistribution {
    return {
        id: dbData.id,
        name: dbData.name,
        educationLevel: dbData.educationLevel,
        studySystem: dbData.studySystem,
        periods: {
            firstPeriod: {
                monthsCount: dbData.firstPeriodMonthsCount,
                monthlyGrade: dbData.firstPeriodMonthlyGrade,
                periodExam: dbData.firstPeriodPeriodExam
            },
            secondPeriod: {
                monthsCount: dbData.secondPeriodMonthsCount,
                monthlyGrade: dbData.secondPeriodMonthlyGrade,
                periodExam: dbData.secondPeriodPeriodExam
            },
            thirdPeriod: {
                monthsCount: dbData.thirdPeriodMonthsCount,
                monthlyGrade: dbData.thirdPeriodMonthlyGrade,
                periodExam: dbData.thirdPeriodPeriodExam,
                totalGrade: dbData.thirdPeriodTotalGrade
            }
        },
        finalCalculation: {
            firstAndSecondWeight: dbData.firstAndSecondWeight,
            thirdPeriodWeight: dbData.thirdPeriodWeight,
            totalGrade: dbData.totalGrade
        }
    }
}

// تحويل البيانات من تنسيق FlexibleGradeDistribution إلى قاعدة البيانات
export function convertFlexibleToDbFormat(distribution: FlexibleGradeDistribution) {
    return {
        name: distribution.name,
        educationLevel: distribution.educationLevel,
        studySystem: distribution.studySystem,
        
        // إعدادات الفترة الأولى
        firstPeriodMonthsCount: distribution.periods.firstPeriod.monthsCount,
        firstPeriodMonthlyGrade: distribution.periods.firstPeriod.monthlyGrade,
        firstPeriodPeriodExam: distribution.periods.firstPeriod.periodExam,
        
        // إعدادات الفترة الثانية
        secondPeriodMonthsCount: distribution.periods.secondPeriod.monthsCount,
        secondPeriodMonthlyGrade: distribution.periods.secondPeriod.monthlyGrade,
        secondPeriodPeriodExam: distribution.periods.secondPeriod.periodExam,
        
        // إعدادات الفترة الثالثة
        thirdPeriodMonthsCount: distribution.periods.thirdPeriod.monthsCount,
        thirdPeriodMonthlyGrade: distribution.periods.thirdPeriod.monthlyGrade,
        thirdPeriodPeriodExam: distribution.periods.thirdPeriod.periodExam,
        thirdPeriodTotalGrade: distribution.periods.thirdPeriod.totalGrade || 0,
        
        // إعدادات الحساب النهائي
        firstAndSecondWeight: distribution.finalCalculation.firstAndSecondWeight,
        thirdPeriodWeight: distribution.finalCalculation.thirdPeriodWeight,
        totalGrade: distribution.finalCalculation.totalGrade
    }
}
