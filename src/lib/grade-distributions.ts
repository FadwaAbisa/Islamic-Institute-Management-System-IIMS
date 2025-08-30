/**
 * نظام توزيع الدرجات للمعهد الإسلامي
 * يحتوي على توزيعات مختلفة للسنة الأولى والثانية مقابل السنة الثالثة
 * ويدعم نظامي الدراسة: النظامي والانتساب
 */

export interface GradeDistribution {
    monthlyGrade: number;        // درجة الشهر
    monthlyAverage: number;      // متوسط درجة الأشهر
    periodExam: number;          // درجة الامتحان
    twoPeriodsTotal: number;     // درجة امتحان الفترتين
    thirdPeriodTotal: number;    // درجة امتحان الفترة الثالثة
}

export interface SubjectGradeDistribution {
    [key: string]: {
        firstAndSecondYear: GradeDistribution;
        thirdYear: GradeDistribution;
        correspondence?: GradeDistribution; // للانتساب إذا كان مختلف
    };
}

// توزيع الدرجات للسنة الأولى والثانية
export const FIRST_SECOND_YEAR_DISTRIBUTIONS: SubjectGradeDistribution = {
    "القـرآن وأحكامه": {
        firstAndSecondYear: {
            monthlyGrade: 8,
            monthlyAverage: 8,
            periodExam: 8,
            twoPeriodsTotal: 16,
            thirdPeriodTotal: 48
        },
        thirdYear: {
            monthlyGrade: 6,
            monthlyAverage: 6,
            periodExam: 6,
            twoPeriodsTotal: 12,
            thirdPeriodTotal: 36
        }
    },
    "السيرة": {
        firstAndSecondYear: {
            monthlyGrade: 12,
            monthlyAverage: 12,
            periodExam: 12,
            twoPeriodsTotal: 24,
            thirdPeriodTotal: 36
        },
        thirdYear: {
            monthlyGrade: 9,
            monthlyAverage: 9,
            periodExam: 9,
            twoPeriodsTotal: 18,
            thirdPeriodTotal: 27
        }
    },
    "التفسير": {
        firstAndSecondYear: {
            monthlyGrade: 12,
            monthlyAverage: 12,
            periodExam: 12,
            twoPeriodsTotal: 24,
            thirdPeriodTotal: 36
        },
        thirdYear: {
            monthlyGrade: 12,
            monthlyAverage: 12,
            periodExam: 12,
            twoPeriodsTotal: 24,
            thirdPeriodTotal: 36
        }
    },
    "علوم الحديث": {
        firstAndSecondYear: {
            monthlyGrade: 4,
            monthlyAverage: 4,
            periodExam: 4,
            twoPeriodsTotal: 8,
            thirdPeriodTotal: 12
        },
        thirdYear: {
            monthlyGrade: 3,
            monthlyAverage: 3,
            periodExam: 3,
            twoPeriodsTotal: 6,
            thirdPeriodTotal: 9
        }
    },
    "الفقة": {
        firstAndSecondYear: {
            monthlyGrade: 12,
            monthlyAverage: 12,
            periodExam: 12,
            twoPeriodsTotal: 24,
            thirdPeriodTotal: 36
        },
        thirdYear: {
            monthlyGrade: 9,
            monthlyAverage: 9,
            periodExam: 9,
            twoPeriodsTotal: 18,
            thirdPeriodTotal: 27
        }
    },
    "العقيدة": {
        firstAndSecondYear: {
            monthlyGrade: 12,
            monthlyAverage: 12,
            periodExam: 12,
            twoPeriodsTotal: 24,
            thirdPeriodTotal: 36
        },
        thirdYear: {
            monthlyGrade: 9,
            monthlyAverage: 9,
            periodExam: 9,
            twoPeriodsTotal: 18,
            thirdPeriodTotal: 27
        }
    },
    "الدراسات الأدبية": {
        firstAndSecondYear: {
            monthlyGrade: 8,
            monthlyAverage: 8,
            periodExam: 8,
            twoPeriodsTotal: 16,
            thirdPeriodTotal: 48
        },
        thirdYear: {
            monthlyGrade: 6,
            monthlyAverage: 6,
            periodExam: 6,
            twoPeriodsTotal: 12,
            thirdPeriodTotal: 36
        }
    },
    "الدراسات اللغوية": {
        firstAndSecondYear: {
            monthlyGrade: 8,
            monthlyAverage: 8,
            periodExam: 8,
            twoPeriodsTotal: 16,
            thirdPeriodTotal: 48
        },
        thirdYear: {
            monthlyGrade: 6,
            monthlyAverage: 6,
            periodExam: 6,
            twoPeriodsTotal: 12,
            thirdPeriodTotal: 36
        }
    },
    "أصول الفقه": {
        firstAndSecondYear: {
            monthlyGrade: 8,
            monthlyAverage: 8,
            periodExam: 8,
            twoPeriodsTotal: 16,
            thirdPeriodTotal: 48
        },
        thirdYear: {
            monthlyGrade: 6,
            monthlyAverage: 6,
            periodExam: 6,
            twoPeriodsTotal: 12,
            thirdPeriodTotal: 36
        }
    },
    "منهج الدعوة": {
        firstAndSecondYear: {
            monthlyGrade: 4,
            monthlyAverage: 4,
            periodExam: 4,
            twoPeriodsTotal: 8,
            thirdPeriodTotal: 12
        },
        thirdYear: {
            monthlyGrade: 3,
            monthlyAverage: 3,
            periodExam: 3,
            twoPeriodsTotal: 6,
            thirdPeriodTotal: 9
        }
    },
    "اللغة الإنجليزية": {
        firstAndSecondYear: {
            monthlyGrade: 8,
            monthlyAverage: 8,
            periodExam: 8,
            twoPeriodsTotal: 16,
            thirdPeriodTotal: 48
        },
        thirdYear: {
            monthlyGrade: 6,
            monthlyAverage: 6,
            periodExam: 6,
            twoPeriodsTotal: 12,
            thirdPeriodTotal: 36
        }
    },
    "الحاسوب": {
        firstAndSecondYear: {
            monthlyGrade: 8,
            monthlyAverage: 8,
            periodExam: 8,
            twoPeriodsTotal: 16,
            thirdPeriodTotal: 48
        },
        thirdYear: {
            monthlyGrade: 6,
            monthlyAverage: 6,
            periodExam: 6,
            twoPeriodsTotal: 12,
            thirdPeriodTotal: 36
        }
    }
};

/**
 * الحصول على توزيع الدرجات للمادة حسب المرحلة التعليمية
 */
export function getGradeDistribution(
    subjectName: string,
    educationLevel: string
): GradeDistribution | null {
    const distributions = FIRST_SECOND_YEAR_DISTRIBUTIONS[subjectName];
    if (!distributions) return null;

    if (educationLevel === "السنة الثالثة" || educationLevel === "THIRD_YEAR") {
        return distributions.thirdYear;
    } else {
        return distributions.firstAndSecondYear;
    }
}

/**
 * التحقق من صحة الدرجة المدخلة
 */
export function validateGrade(
    grade: number,
    maxGrade: number,
    fieldType: 'monthly' | 'exam' | 'average'
): { isValid: boolean; error?: string } {
    if (grade < 0) {
        return { isValid: false, error: "الدرجة لا يمكن أن تكون سالبة" };
    }

    if (grade > maxGrade) {
        return {
            isValid: false,
            error: `الدرجة لا يمكن أن تتجاوز ${maxGrade}`
        };
    }

    // التحقق من أن الدرجة عدد صحيح أو عشري بخانة واحدة فقط
    if (!Number.isInteger(grade * 10)) {
        return {
            isValid: false,
            error: "يمكن إدخال عشر واحد فقط (مثال: 12.5)"
        };
    }

    return { isValid: true };
}

/**
 * حساب المجموع والنتيجة النهائية
 */
export function calculateTotals(
    month1: number | null,
    month2: number | null,
    month3: number | null,
    periodExam: number | null,
    distribution: GradeDistribution
): {
    workTotal: number;
    periodTotal: number;
    monthlyAverage: number;
} {
    // حساب متوسط الأشهر الثلاثة
    const validMonths = [month1, month2, month3].filter(m => m !== null) as number[];
    const monthlyAverage = validMonths.length > 0 ?
        validMonths.reduce((sum, grade) => sum + grade, 0) / validMonths.length : 0;

    // حساب مجموع الأعمال (متوسط الأشهر)
    const workTotal = Math.min(monthlyAverage, distribution.monthlyAverage);

    // حساب مجموع الفترة (أعمال + امتحان)
    const examGrade = periodExam || 0;
    const periodTotal = workTotal + Math.min(examGrade, distribution.periodExam);

    return {
        workTotal: Math.round(workTotal * 10) / 10,
        periodTotal: Math.round(periodTotal * 10) / 10,
        monthlyAverage: Math.round(monthlyAverage * 10) / 10
    };
}

/**
 * حساب النتيجة النهائية للطالب (مجموع الفترات الثلاث)
 */
export function calculateFinalResult(
    firstPeriodTotal: number,
    secondPeriodTotal: number,
    thirdPeriodExam: number,
    distribution: GradeDistribution
): {
    finalTotal: number;
    grade: string;
    status: 'نجح' | 'راسب' | 'غير مكتمل';
} {
    // مجموع الفترتين الأولى والثانية + امتحان الفترة الثالثة
    const finalTotal = firstPeriodTotal + secondPeriodTotal + Math.min(thirdPeriodExam, distribution.thirdPeriodTotal);

    // تحديد التقدير
    let grade = '';
    let status: 'نجح' | 'راسب' | 'غير مكتمل' = 'غير مكتمل';

    const totalPossible = distribution.twoPeriodsTotal * 2 + distribution.thirdPeriodTotal;
    const percentage = (finalTotal / totalPossible) * 100;

    if (percentage >= 90) {
        grade = 'ممتاز';
        status = 'نجح';
    } else if (percentage >= 80) {
        grade = 'جيد جداً';
        status = 'نجح';
    } else if (percentage >= 70) {
        grade = 'جيد';
        status = 'نجح';
    } else if (percentage >= 60) {
        grade = 'مقبول';
        status = 'نجح';
    } else if (percentage >= 50) {
        grade = 'ضعيف';
        status = 'راسب';
    } else {
        grade = 'راسب';
        status = 'راسب';
    }

    return {
        finalTotal: Math.round(finalTotal * 10) / 10,
        grade,
        status
    };
}

/**
 * التحقق من نوع الطالب والقيود المطبقة
 */
export function getStudentRestrictions(
    educationLevel: string,
    studySystem: string,
    isDiploma: boolean = false
): {
    canEnterGrades: boolean;
    availablePeriods: string[];
    restrictions: string[];
} {
    const restrictions: string[] = [];
    let canEnterGrades = true;
    let availablePeriods: string[] = [];

    // قيود الدبلوم المنتسبات
    if (isDiploma && studySystem === "انتساب") {
        canEnterGrades = false;
        restrictions.push("طالبات الدبلوم المنتسبات يخضعن لامتحانات وزارية");
        restrictions.push("لا يسمح بإدخال أي درجات في النظام");
        return { canEnterGrades, availablePeriods: [], restrictions };
    }

    // تحديد الفترات المتاحة
    if (studySystem === "انتساب" && educationLevel !== "السنة الثالثة") {
        // المنتسبات غير الدبلوم - فقط الفترة الثالثة
        availablePeriods = ["الفترة الثالثة"];
        restrictions.push("المنتسبات لهن فترة ثالثة فقط (امتحان نهائي)");
    } else if (studySystem === "نظامي" || (studySystem === "انتساب" && educationLevel === "السنة الثالثة")) {
        // النظاميات أو الثالثة انتساب - جميع الفترات
        availablePeriods = ["الفترة الأولى", "الفترة الثانية", "الفترة الثالثة"];
    }

    // قيود خاصة بالسنة الثالثة
    if (educationLevel === "السنة الثالثة") {
        if (isDiploma) {
            restrictions.push("الفترة الثالثة للدبلوم وزارية");
        }
        restrictions.push("توزيع درجات مختلف عن السنة الأولى والثانية");
    }

    return { canEnterGrades, availablePeriods, restrictions };
}

export type StudyLevel = "السنة الأولى" | "السنة الثانية" | "السنة الثالثة" | "التخرج";
export type StudySystem = "نظامي" | "انتساب";
export type EvaluationPeriod = "الفترة الأولى" | "الفترة الثانية" | "الفترة الثالثة";
