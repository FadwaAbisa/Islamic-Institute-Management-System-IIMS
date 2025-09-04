"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Calculator,
    Upload,
    Download,
    FileSpreadsheet,
    Users,
    BookOpen,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Filter,
    Save,
    Eye,
    Settings,
    Info,
    RefreshCw
} from "lucide-react"
import {
    getGradeDistribution,
    validateGrade,
    calculateTotals,
    calculateFinalResult,
    getStudentRestrictions,
    type StudyLevel,
    type StudySystem,
    type EvaluationPeriod,
    type GradeDistribution
} from "@/lib/grade-distributions"
import {
    FlexibleGradeDistribution,
    getFlexibleGradeDistribution,
    calculateMonthlyAverage,
    calculatePeriodTotal,
    calculateFinalTotal,
    validateFlexibleGrade,
    getPeriodInfo,
    calculatePercentageAndGrade,
    pullGradesFromPreviousPeriods,
    updateGradeDistribution,
    getUpdatedGradeDistribution
} from "@/lib/flexible-grade-distributions"
import FlexibleGradeDistributionManager from "./FlexibleGradeDistributionManager"
import ThirdPeriodManagerFixed from "./ThirdPeriodManagerFixed"

interface Student {
    id: string
    studentNumber: string
    studentName: string
    academicYear: string
    educationLevel: StudyLevel
    studySystem: StudySystem
    specialization: string
    isDiploma: boolean
    grades: {
        [period: string]: {
            month1?: number | null
            month2?: number | null
            month3?: number | null
            periodExam?: number | null
            workTotal?: number
            periodTotal?: number
            // خصائص إضافية للفترة الثالثة
            firstPeriodTotal?: number
            secondPeriodTotal?: number
            finalTotal?: number
            percentage?: number
            grade?: string
            gradeColor?: string
        }
    }
}

interface Subject {
    id: number
    name: string
}

interface AcademicYear {
    id: string
    name: string
}

export default function EnhancedGradesManager() {
    // حالات الفلاتر الأساسية
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedLevel, setSelectedLevel] = useState<StudyLevel | "">("")
    const [selectedSystem, setSelectedSystem] = useState<StudySystem | "">("")
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState<EvaluationPeriod | "">("")
    
    // حالات التحميل
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isLoadingStudents, setIsLoadingStudents] = useState(false)

    // حالات البيانات
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])

    // حالات التحكم
    const [isFormEnabled, setIsFormEnabled] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    
    // حالات النظام المرن
    const [useFlexibleSystem, setUseFlexibleSystem] = useState(false)
    const [flexibleDistribution, setFlexibleDistribution] = useState<FlexibleGradeDistribution | null>(null)
    
    // حالات المراجعة والاعتماد
    const [pendingReview, setPendingReview] = useState<{[studentId: string]: boolean}>({})
    const [reviewedGrades, setReviewedGrades] = useState<{[studentId: string]: boolean}>({})
    const [approvedGrades, setApprovedGrades] = useState<{[studentId: string]: boolean}>({})
    const [reviewMode, setReviewMode] = useState(false)
    const [approvalMode, setApprovalMode] = useState(false)

    // تحديث التوزيع المرن عند تغيير المعايير
    useEffect(() => {
        if (selectedLevel && selectedSystem) {
            console.log("🔍 Debug - Updating flexible distribution for:", { selectedLevel, selectedSystem })
            const distribution = getUpdatedGradeDistribution(selectedLevel, selectedSystem)
            console.log("🔍 Debug - Setting flexible distribution:", distribution)
            setFlexibleDistribution(distribution)
        } else {
            console.log("🔍 Debug - Clearing flexible distribution")
            setFlexibleDistribution(null)
        }
    }, [selectedLevel, selectedSystem])

    // تحديث التوزيع المرن عند تغيير أي فلتر (لضمان الحصول على أحدث البيانات)
    useEffect(() => {
        if (selectedYear && selectedLevel && selectedSystem) {
            console.log("🔍 Debug - Refreshing flexible distribution for all filters:", { selectedYear, selectedLevel, selectedSystem })
            // إعادة تحميل التوزيع المرن لضمان الحصول على أحدث البيانات
            const distribution = getUpdatedGradeDistribution(selectedLevel, selectedSystem)
            console.log("🔍 Debug - Refreshed flexible distribution:", distribution)
            setFlexibleDistribution(distribution)
        }
    }, [selectedYear, selectedLevel, selectedSystem])

    // دالة لتحديث النظام المرن يدوياً
    const refreshFlexibleDistribution = () => {
        if (selectedLevel && selectedSystem) {
            console.log("🔍 Debug - Manually refreshing flexible distribution")
            const distribution = getUpdatedGradeDistribution(selectedLevel, selectedSystem)
            console.log("🔍 Debug - Manually refreshed flexible distribution:", distribution)
            setFlexibleDistribution(distribution)
        }
    }

    // حالات استيراد Excel
    const [importMode, setImportMode] = useState(false)
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [importResults, setImportResults] = useState<{
        success: number
        errors: string[]
        warnings: string[]
    } | null>(null)

    // تحميل البيانات الأولية
    useEffect(() => {
        loadInitialData()
    }, [])

    // منطق الفلاتر المتتالية
    useEffect(() => {
        // إعادة تعيين الفلاتر التابعة عند تغيير الفلتر الأساسي
        if (!selectedYear) {
            setSelectedLevel("")
            setSelectedSystem("")
            setSelectedSubject(null)
            setSelectedPeriod("")
        } else if (!selectedLevel) {
            setSelectedSystem("")
            setSelectedSubject(null)
            setSelectedPeriod("")
        } else if (!selectedSystem) {
            setSelectedSubject(null)
            setSelectedPeriod("")
        } else if (!selectedSubject) {
            setSelectedPeriod("")
        }
    }, [selectedYear, selectedLevel, selectedSystem, selectedSubject])

    // التحقق من إمكانية تفعيل النموذج وتطبيق الفلاتر تلقائياً
    useEffect(() => {
        const canEnable = Boolean(
            selectedYear &&
            selectedLevel &&
            selectedSystem &&
            selectedSubject &&
            (selectedPeriod || (selectedLevel === "السنة الثالثة" && selectedSystem === "انتساب"))
        )
        
        console.log("🔍 فحص إمكانية تفعيل النموذج:", {
            selectedYear: !!selectedYear,
            selectedLevel: !!selectedLevel,
            selectedSystem: !!selectedSystem,
            selectedSubject: !!selectedSubject,
            selectedPeriod: !!selectedPeriod,
            isThirdYearAffiliated: selectedLevel === "السنة الثالثة" && selectedSystem === "انتساب",
            canEnable
        })
        
        setIsFormEnabled(canEnable)

        if (canEnable) {
            console.log("✅ النموذج مفعل، بدء تحميل الطلاب...")
            validateFiltersAndLoadStudents()
        } else {
            console.log("❌ النموذج غير مفعل")
        }
    }, [selectedYear, selectedLevel, selectedSystem, selectedSubject, selectedPeriod])

    const loadInitialData = async () => {
        try {
            console.log("🚀 بدء تحميل البيانات الأولية...")
            setLoading(true)

            // تحميل المواد
            console.log("📚 تحميل المواد...")
            const subjectsData = await loadSubjects()
            console.log("✅ تم تحميل المواد:", subjectsData.length)
            setSubjects(subjectsData)

            // تحميل السنوات الدراسية
            console.log("📅 تحميل السنوات الدراسية...")
            const yearsRes = await fetch("/api/academic-years")
            if (yearsRes.ok) {
                const yearsData = await yearsRes.json()
                console.log("✅ تم تحميل السنوات الدراسية:", yearsData.academicYears?.length || 0)
                setAcademicYears(yearsData.academicYears || [])
            } else {
                console.error("❌ خطأ في تحميل السنوات الدراسية:", yearsRes.status)
            }
        } catch (error) {
            console.error("خطأ في تحميل البيانات:", error)
        } finally {
            setLoading(false)
            console.log("🏁 انتهى تحميل البيانات الأولية")
        }
    }

    const loadSubjects = async (): Promise<Subject[]> => {
        // يمكن تحميلها من API أو استخدام البيانات الثابتة
        return [
            { id: 1, name: "القـرآن وأحكامه" },
            { id: 2, name: "السيرة" },
            { id: 3, name: "التفسير" },
            { id: 4, name: "علوم الحديث" },
            { id: 5, name: "الفقة" },
            { id: 6, name: "العقيدة" },
            { id: 7, name: "الدراسات الأدبية" },
            { id: 8, name: "الدراسات اللغوية" },
            { id: 9, name: "أصول الفقه" },
            { id: 10, name: "منهج الدعوة" },
            { id: 11, name: "اللغة الإنجليزية" },
            { id: 12, name: "الحاسوب" }
        ]
    }

    const validateFiltersAndLoadStudents = async () => {
        const errors: string[] = []

        if (!selectedYear) errors.push("يجب اختيار العام الدراسي")
        if (!selectedLevel) errors.push("يجب اختيار المرحلة التعليمية")
        if (!selectedSystem) errors.push("يجب اختيار نظام الدراسة")
        if (!selectedSubject) errors.push("يجب اختيار المادة")

        setValidationErrors(errors)

        if (errors.length === 0) {
            await loadStudents()
        }
    }

    const loadStudents = async () => {
        console.log("🚀 بدء تحميل الطلاب...", {
            isFormEnabled,
            selectedYear,
            selectedLevel,
            selectedSystem,
            selectedSubject: selectedSubject?.name,
            selectedPeriod
        })

        if (!isFormEnabled) {
            console.log("❌ النموذج غير مفعل")
            return
        }

        try {
            setIsLoadingData(true)
            setIsLoadingStudents(true)
            
            const params = new URLSearchParams({
                academicYear: selectedYear,
                educationLevel: selectedLevel as string,
                studySystem: selectedSystem as string,
                subject: selectedSubject?.name || "",
                period: selectedPeriod as string
            })

            console.log("🔍 إرسال استعلام للطلاب:", params.toString())

            const res = await fetch(`/api/students/filtered?${params}`)
            console.log("📡 استجابة الخادم:", res.status, res.statusText)
            
            if (res.ok) {
                const data = await res.json()
                console.log("✅ تم استلام البيانات:", data)
                setStudents(data.students || [])
            } else {
                const errorText = await res.text()
                console.error("❌ خطأ في الاستعلام:", res.status, errorText)
                setStudents([])
            }
        } catch (error) {
            console.error("خطأ في تحميل الطلاب:", error)
            setStudents([])
        } finally {
            setIsLoadingData(false)
            setIsLoadingStudents(false)
            console.log("🏁 انتهى تحميل الطلاب")
        }
    }

    const getGradeDistributionForSelected = (): GradeDistribution | null => {
        console.log("🔍 Debug - getGradeDistributionForSelected called with:", { selectedSubject, selectedLevel })
        if (!selectedSubject || !selectedLevel) {
            console.log("🔍 Debug - No subject or level selected")
            return null
        }
        const result = getGradeDistribution(selectedSubject.name, selectedLevel as string)
        console.log("🔍 Debug - getGradeDistribution result:", result)
        console.log("🔍 Debug - selectedSubject.name:", selectedSubject.name)
        console.log("🔍 Debug - selectedLevel:", selectedLevel)
        console.log("🔍 Debug - selectedSubject.id:", selectedSubject.id)
        console.log("🔍 Debug - result.monthlyGrade:", result?.monthlyGrade)
        console.log("🔍 Debug - result.periodExam:", result?.periodExam)
        return result
    }

    const getStudentRestrictionsForSelected = (student: Student) => {
        console.log("🔍 Debug - getStudentRestrictionsForSelected called with:", { 
            educationLevel: student.educationLevel, 
            studySystem: student.studySystem, 
            isDiploma: student.isDiploma 
        })
        const result = getStudentRestrictions(
            student.educationLevel,
            student.studySystem,
            student.isDiploma
        )
        console.log("🔍 Debug - getStudentRestrictions result:", result)
        console.log("🔍 Debug - student.educationLevel:", student.educationLevel)
        console.log("🔍 Debug - student.studySystem:", student.studySystem)
        console.log("🔍 Debug - student.isDiploma:", student.isDiploma)
        console.log("🔍 Debug - student.id:", student.id)
        console.log("🔍 Debug - student.studentName:", student.studentName)
        console.log("🔍 Debug - result.canEnterGrades:", result?.canEnterGrades)
        console.log("🔍 Debug - result.availablePeriods:", result?.availablePeriods)
        return result
    }

    // دالة التحقق من صحة الدرجة مع التقيد بنظام التوزيع المرن
    const validateGradeWithFlexibleSystem = (
        grade: number,
        field: 'monthly' | 'exam',
        studentId: string,
        period: string
    ): { isValid: boolean; error?: string; maxGrade?: number } => {
        if (!flexibleDistribution) {
            return { isValid: false, error: "نظام التوزيع المرن غير محدد" }
        }

        const periodKey = period === "الفترة الأولى" ? "firstPeriod" : 
                         period === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod"
        const periodConfig = flexibleDistribution.periods[periodKey]

        if (!periodConfig) {
            return { isValid: false, error: "إعدادات الفترة غير موجودة" }
        }

        let maxGrade = 0
        if (field === 'monthly') {
            maxGrade = periodConfig.monthlyGrade
        } else if (field === 'exam') {
            maxGrade = periodConfig.periodExam
        }

        // التحقق من عدم تجاوز الحد الأقصى
        if (grade > maxGrade) {
            return { 
                isValid: false, 
                error: `الدرجة لا يمكن أن تتجاوز ${maxGrade}`,
                maxGrade 
            }
        }

        // التحقق من أن الدرجة ليست سالبة
        if (grade < 0) {
            return { 
                isValid: false, 
                error: "الدرجة لا يمكن أن تكون سالبة",
                maxGrade 
            }
        }

        // التحقق من صحة الأرقام العشرية لدرجات الأشهر
        if (field === 'monthly') {
            // التحقق من أن الدرجة تحتوي على منزلتين عشريتين كحد أقصى
            const decimalPlaces = (grade.toString().split('.')[1] || '').length
            if (decimalPlaces > 2) {
                return { 
                    isValid: false, 
                    error: "درجة الشهر يجب أن تحتوي على منزلتين عشريتين كحد أقصى",
                    maxGrade 
                }
            }
        }

        return { isValid: true, maxGrade }
    }

    // دالة حساب متوسط درجات الأشهر مع التقريب للأرقام الصحيحة
    const calculateMonthlyAverageWithRounding = (monthGrades: (number | null)[]): number => {
        const validGrades = monthGrades.filter(grade => grade !== null && grade !== undefined) as number[]
        
        if (validGrades.length === 0) return 0
        
        const sum = validGrades.reduce((total, grade) => total + grade, 0)
        const average = sum / validGrades.length
        
        // تقريب المتوسط لرقم صحيح
        return Math.round(average)
    }

    // دالة حساب مجموع الفترة مع التقريب للأرقام الصحيحة
    const calculatePeriodTotalWithRounding = (
        monthlyAverage: number,
        periodExam: number | null,
        period: string
    ): number => {
        const examGrade = periodExam || 0
        const total = monthlyAverage + examGrade
        
        // تقريب المجموع لرقم صحيح
        return Math.round(total)
    }

    // دالة حساب النتيجة النهائية
    const calculateFinalResultWithFlexibleSystem = (
        firstPeriodTotal: number,
        secondPeriodTotal: number,
        thirdPeriodTotal: number
    ): { finalTotal: number; percentage: number; grade: string; color: string } => {
        if (!flexibleDistribution) {
            return { finalTotal: 0, percentage: 0, grade: "غير محدد", color: "text-gray-600" }
        }

        const { firstAndSecondWeight, thirdPeriodWeight, totalGrade } = flexibleDistribution.finalCalculation
        
        const weightedFirst = firstPeriodTotal * firstAndSecondWeight
        const weightedSecond = secondPeriodTotal * firstAndSecondWeight
        const weightedThird = thirdPeriodTotal * thirdPeriodWeight
        
        const finalTotal = weightedFirst + weightedSecond + weightedThird
        const percentage = Math.round((finalTotal / totalGrade) * 100 * 100) / 100
        
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
        
        return { finalTotal, percentage, grade, color }
    }

    // دوال المراجعة والاعتماد
    const markForReview = (studentId: string) => {
        setPendingReview(prev => ({ ...prev, [studentId]: true }))
        setReviewedGrades(prev => ({ ...prev, [studentId]: false }))
        setApprovedGrades(prev => ({ ...prev, [studentId]: false }))
    }

    const markAsReviewed = (studentId: string) => {
        setPendingReview(prev => ({ ...prev, [studentId]: false }))
        setReviewedGrades(prev => ({ ...prev, [studentId]: true }))
        setApprovedGrades(prev => ({ ...prev, [studentId]: false }))
    }

    const markAsApproved = (studentId: string) => {
        setPendingReview(prev => ({ ...prev, [studentId]: false }))
        setReviewedGrades(prev => ({ ...prev, [studentId]: true }))
        setApprovedGrades(prev => ({ ...prev, [studentId]: true }))
    }

    const canSaveGrades = (studentId: string): boolean => {
        return approvedGrades[studentId] === true
    }

    const getGradeStatus = (studentId: string): 'pending' | 'reviewed' | 'approved' | 'none' => {
        if (approvedGrades[studentId]) return 'approved'
        if (reviewedGrades[studentId]) return 'reviewed'
        if (pendingReview[studentId]) return 'pending'
        return 'none'
    }

    // دالة لفك الاعتماد
    const unapproveGrades = (studentId: string) => {
        setApprovedGrades(prev => {
            const newApproved = { ...prev }
            delete newApproved[studentId]
            return newApproved
        })
        
        // إعادة الدرجة إلى حالة المراجعة
        setReviewedGrades(prev => {
            const newReviewed = { ...prev }
            newReviewed[studentId] = true
            return newReviewed
        })
    }

    // دالة لتوليد حقول إدخال الدرجات ديناميكياً
    const renderDynamicGradeInputs = (student: Student, currentPeriodGrades: any) => {
        console.log("🔍 Debug - renderDynamicGradeInputs called")
        console.log("🔍 Debug - flexibleDistribution:", flexibleDistribution)
        console.log("🔍 Debug - selectedPeriod:", selectedPeriod)
        console.log("🔍 Debug - student:", student)
        console.log("🔍 Debug - currentPeriodGrades:", currentPeriodGrades)
        console.log("🔍 Debug - student.id:", student.id)
        console.log("🔍 Debug - student.studentName:", student.studentName)
        console.log("🔍 Debug - student.grades:", student.grades)
        
        // التحقق من وجود النظام المرن
        if (!flexibleDistribution || !flexibleDistribution.periods) {
            console.log("🔍 Debug - No flexible distribution found")
            return (
                <div className="text-center text-red-600 p-4">
                    <p>يجب تحديد نظام توزيع درجات مرن أولاً</p>
                </div>
            )
        }

        // النظام المرن - عرض الحقول حسب عدد الأشهر
        console.log("🔍 Debug - Using flexible system")
        console.log("🔍 Debug - selectedPeriod for getPeriodInfo:", selectedPeriod)
        
        // تحويل selectedPeriod إلى المفتاح الصحيح
        let periodKey: 'firstPeriod' | 'secondPeriod' | 'thirdPeriod'
        if (selectedPeriod === "الفترة الأولى") {
            periodKey = "firstPeriod"
        } else if (selectedPeriod === "الفترة الثانية") {
            periodKey = "secondPeriod"
        } else if (selectedPeriod === "الفترة الثالثة") {
            periodKey = "thirdPeriod"
        } else {
            periodKey = "firstPeriod" // fallback
        }
        
        console.log("🔍 Debug - periodKey:", periodKey)
        const periodInfo = getPeriodInfo(flexibleDistribution, periodKey)
        const monthlyGradeMax = periodInfo.monthlyGrade
        const periodExamMax = periodInfo.periodExam
        
        console.log("🔍 Debug - periodInfo:", periodInfo)
        console.log("🔍 Debug - monthsCount:", periodInfo.monthsCount)
        console.log("🔍 Debug - monthlyGradeMax:", monthlyGradeMax)
        console.log("🔍 Debug - periodExamMax:", periodExamMax)
        console.log("🔍 Debug - flexibleDistribution:", flexibleDistribution)
        console.log("🔍 Debug - flexibleDistribution.periods:", flexibleDistribution?.periods)

                // إنشاء حقول الأشهر بالترتيب من اليمين إلى اليسار - قابلة للإدخال
        // فقط للأشهر المحددة في التوزيع المرن
        const monthInputs: JSX.Element[] = []
        
        // التأكد من أن عدد الأشهر أكبر من 0
        if (periodInfo.monthsCount > 0 && periodInfo.monthsCount <= 3) {
            console.log("🔍 Debug - Creating month inputs for", periodInfo.monthsCount, "months")
            // إنشاء حقول الأشهر فقط للعدد المحدد في التوزيع المرن
            for (let i = 1; i <= periodInfo.monthsCount; i++) {
                const monthKey = `month${i}` as 'month1' | 'month2' | 'month3'
                monthInputs.push(
                    <div key={monthKey} className="flex-1 min-w-[120px]">
                        <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">الشهر {i === 1 ? 'الأول' : i === 2 ? 'الثاني' : 'الثالث'}</Label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={currentPeriodGrades[monthKey] || ""}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (!isNaN(value)) {
                                    const validation = validateGradeWithFlexibleSystem(value, 'monthly', student.id, selectedPeriod as string)
                                    if (!validation.isValid) {
                                        alert(validation.error)
                                        return
                                    }
                                }
                                handleGradeChange(student.id, monthKey, e.target.value)
                            }}
                            className="modern-input text-center text-lg font-bold border-2 border-lama-yellow focus:border-lama-sky bg-white"
                            min="0"
                            max={monthlyGradeMax}
                            step="0.01"
                        />
                        <div className="text-xs text-lama-sky mt-1 text-center">
                            الحد الأقصى: {monthlyGradeMax} (منزلتان عشريتان)
                        </div>
                    </div>
                )
            }
        } else {
            // إذا لم تكن هناك أشهر، أضف رسالة توضيحية
            console.log("🔍 Debug - No months in flexible system")
            console.log("🔍 Debug - periodInfo.monthsCount:", periodInfo.monthsCount)
            console.log("🔍 Debug - periodInfo:", periodInfo)
            monthInputs.push(
                <div key="no-months" className="flex-1 min-w-[120px]">
                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">لا توجد أشهر</Label>
                    <div className="modern-input text-center text-lg font-bold border-2 border-gray-200 bg-gray-100 p-3 rounded-xl">
                        لا توجد أشهر في هذه الفترة
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-center">
                        امتحان مباشر فقط
                    </div>
                </div>
            )
        }

        // حساب متوسط الأشهر - فقط للأشهر المحددة في التوزيع المرن
        const monthlyGrades: number[] = []
        
        // فقط للأشهر المحددة في التوزيع المرن
        for (let i = 1; i <= periodInfo.monthsCount; i++) {
            const monthKey = `month${i}` as 'month1' | 'month2' | 'month3'
            const grade = currentPeriodGrades[monthKey]
            if (grade !== null && grade !== undefined) {
                monthlyGrades.push(grade)
            }
        }
        const monthlyAverage = monthlyGrades.length > 0 ? 
            (monthlyGrades.reduce((sum, grade) => sum + grade, 0) / monthlyGrades.length) : 0
        
        console.log("🔍 Debug - monthlyGrades for display:", monthlyGrades)
        console.log("🔍 Debug - monthlyAverage for display:", monthlyAverage)
        console.log("🔍 Debug - periodInfo.monthsCount for calculation:", periodInfo.monthsCount)

        // حساب المجموع
        const periodTotal = monthlyAverage + (currentPeriodGrades.periodExam || 0)
        console.log("🔍 Debug - periodTotal for display:", periodTotal)
        console.log("🔍 Debug - currentPeriodGrades.periodExam for display:", currentPeriodGrades.periodExam)

        // حساب النسبة والتقدير
        const percentage = flexibleDistribution.finalCalculation.totalGrade > 0 
            ? (periodTotal / flexibleDistribution.finalCalculation.totalGrade) * 100 
            : 0
        
        let grade = ""
        let gradeColor = ""
        if (percentage >= 90) {
            grade = "ممتاز"
            gradeColor = "text-green-600"
        } else if (percentage >= 80) {
            grade = "جيد جداً"
            gradeColor = "text-blue-600"
        } else if (percentage >= 70) {
            grade = "جيد"
            gradeColor = "text-yellow-600"
        } else if (percentage >= 60) {
            grade = "مقبول"
            gradeColor = "text-orange-600"
        } else {
            grade = "راسب"
            gradeColor = "text-red-600"
        }
        
        console.log("🔍 Debug - Final calculations:", { monthlyAverage, periodTotal, percentage, grade })
        console.log("🔍 Debug - flexibleDistribution.finalCalculation.totalGrade:", flexibleDistribution.finalCalculation.totalGrade)
        console.log("🔍 Debug - percentage calculation:", periodTotal, "/", flexibleDistribution.finalCalculation.totalGrade, "* 100 =", percentage)

        console.log("🔍 Debug - Rendering flexible system UI")
        console.log("🔍 Debug - monthInputs length:", monthInputs.length)
        console.log("🔍 Debug - periodInfo.monthsCount for UI:", periodInfo.monthsCount)
        return (
            <>
                {/* ترتيب الخانات من اليمين إلى اليسار: الشهر الأول (1) في أقصى اليمين، ثم الثاني (2)، ثم الثالث (3)، ثم المتوسط (4)، ثم امتحان الفترة (5)، ثم المجموع (6) */}
                {/* الشهر الأول (1) - في أقصى اليمين */}
                {periodInfo.monthsCount >= 1 && (
                    <div className="flex-1 min-w-[120px]">
                        <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">الشهر الأول</Label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={currentPeriodGrades.month1 || ""}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (!isNaN(value)) {
                                    const validation = validateGradeWithFlexibleSystem(value, 'monthly', student.id, selectedPeriod as string)
                                    if (!validation.isValid) {
                                        alert(validation.error)
                                        return
                                    }
                                }
                                handleGradeChange(student.id, 'month1', e.target.value)
                            }}
                            className={`modern-input text-center text-lg font-bold border-2 focus:border-lama-sky ${
                                getGradeStatus(student.id) === 'approved' 
                                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
                                    : 'border-lama-yellow bg-white'
                            }`}
                            min="0"
                            max={monthlyGradeMax}
                            step="0.01"
                            disabled={getGradeStatus(student.id) === 'approved'}
                        />
                        <div className="text-xs text-lama-sky mt-1 text-center">
                            الحد الأقصى: {monthlyGradeMax} (منزلتان عشريتان)
                        </div>
                    </div>
                )}
                
                {/* الشهر الثاني (2) - يظهر فقط إذا كان محدد في النظام المرن */}
                {periodInfo.monthsCount >= 2 && (
                    <div className="flex-1 min-w-[120px]">
                        <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">الشهر الثاني</Label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={currentPeriodGrades.month2 || ""}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (!isNaN(value)) {
                                    const validation = validateGradeWithFlexibleSystem(value, 'monthly', student.id, selectedPeriod as string)
                                    if (!validation.isValid) {
                                        alert(validation.error)
                                        return
                                    }
                                }
                                handleGradeChange(student.id, 'month2', e.target.value)
                            }}
                            className={`modern-input text-center text-lg font-bold border-2 focus:border-lama-sky ${
                                getGradeStatus(student.id) === 'approved' 
                                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
                                    : 'border-lama-yellow bg-white'
                            }`}
                            min="0"
                            max={monthlyGradeMax}
                            step="0.01"
                            disabled={getGradeStatus(student.id) === 'approved'}
                        />
                        <div className="text-xs text-lama-sky mt-1 text-center">
                            الحد الأقصى: {monthlyGradeMax} (منزلتان عشريتان)
                        </div>
                    </div>
                )}
                
                {/* الشهر الثالث (3) - يظهر فقط إذا كان محدد في النظام المرن */}
                {periodInfo.monthsCount >= 3 && (
                    <div className="flex-1 min-w-[120px]">
                        <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">الشهر الثالث</Label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={currentPeriodGrades.month3 || ""}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (!isNaN(value)) {
                                    const validation = validateGradeWithFlexibleSystem(value, 'monthly', student.id, selectedPeriod as string)
                                    if (!validation.isValid) {
                                        alert(validation.error)
                                        return
                                    }
                                }
                                handleGradeChange(student.id, 'month3', e.target.value)
                            }}
                            className={`modern-input text-center text-lg font-bold border-2 focus:border-lama-sky ${
                                getGradeStatus(student.id) === 'approved' 
                                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
                                    : 'border-lama-yellow bg-white'
                            }`}
                            min="0"
                            max={monthlyGradeMax}
                            step="0.01"
                            disabled={getGradeStatus(student.id) === 'approved'}
                        />
                        <div className="text-xs text-lama-sky mt-1 text-center">
                            الحد الأقصى: {monthlyGradeMax} (منزلتان عشريتان)
                        </div>
                    </div>
                )}
                
                {/* متوسط الأشهر (4) */}
                <div className="flex-1 min-w-[120px]">
                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">متوسط الأشهر</Label>
                    <div className="modern-input text-center text-lg font-bold bg-gray-100 border-2 border-gray-300 p-3 rounded-xl text-gray-500">
                        -
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                        غير متاح بعد
                    </div>
                </div>
                
                {/* امتحان الفترة (5) */}
                <div className="flex-1 min-w-[120px]">
                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">امتحان الفترة</Label>
                    <div className="modern-input text-center text-lg font-bold bg-gray-100 border-2 border-gray-300 p-3 rounded-xl text-gray-500">
                        -
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                        غير متاح بعد
                    </div>
                </div>
                
                {/* المجموع (6) - في أقصى اليسار */}
                <div className="flex-1 min-w-[120px]">
                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">المجموع</Label>
                    <div className="modern-input text-center text-lg font-bold bg-gray-100 border-2 border-gray-300 p-3 rounded-xl text-gray-500">
                        -
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                        غير متاح بعد
                    </div>
                </div>

            </>
        )
    }

    const handleGradeChange = (
        studentId: string,
        field: 'month1' | 'month2' | 'month3' | 'periodExam',
        value: string
    ) => {
        console.log("🔍 Debug - handleGradeChange called with:", { studentId, field, value })
        console.log("🔍 Debug - students before update:", students)
        console.log("🔍 Debug - students length before update:", students.length)
        
        // التحقق من حالة الدرجة - منع التعديل إذا كانت معتمدة
        const currentStatus = getGradeStatus(studentId)
        if (currentStatus === 'approved') {
            alert("لا يمكن تعديل الدرجة بعد الاعتماد. يجب فك الاعتماد أولاً.")
            return
        }
        
        const numValue = value === "" ? null : parseFloat(value)
        
        // استخدام النظام المرن إذا كان متاحاً
        const flexibleDist = flexibleDistribution
        const oldDistribution = getGradeDistributionForSelected()
        console.log("🔍 Debug - flexibleDist:", flexibleDist)
        console.log("🔍 Debug - oldDistribution:", oldDistribution)
        const distribution = flexibleDist || oldDistribution
        console.log("🔍 Debug - distribution:", distribution)

        if (!distribution) {
            console.log("🔍 Debug - No distribution found, returning")
            return
        }

        // التحقق من صحة الدرجة
        if (numValue !== null) {
            // استخدام النظام المرن فقط
            const currentPeriodKey = selectedPeriod === "الفترة الأولى" ? "firstPeriod" : 
                                   selectedPeriod === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod"
            console.log("🔍 Debug - handleGradeChange periodKey:", currentPeriodKey)
            const periodInfo = getPeriodInfo(flexibleDist, currentPeriodKey as any)
            console.log("🔍 Debug - periodInfo in handleGradeChange:", periodInfo)
            console.log("🔍 Debug - selectedPeriod in handleGradeChange:", selectedPeriod)
            
            let maxGrade: number
            switch (field) {
                case 'month1':
                case 'month2':
                case 'month3':
                    maxGrade = periodInfo.monthlyGrade
                    break
                case 'periodExam':
                    maxGrade = periodInfo.periodExam
                    break
                default:
                    return
            }
            
            console.log("🔍 Debug - maxGrade for field", field, ":", maxGrade)
            console.log("🔍 Debug - periodInfo.monthlyGrade:", periodInfo.monthlyGrade)
            console.log("🔍 Debug - periodInfo.periodExam:", periodInfo.periodExam)
            
            // قيود إضافية على الإدخال
            if (numValue < 0) {
                console.log("🔍 Debug - Grade is negative:", numValue)
                alert("الدرجة لا يمكن أن تكون سالبة")
                return
            }
            
            if (numValue > maxGrade) {
                console.log("🔍 Debug - Grade exceeds max:", numValue, "maxGrade:", maxGrade)
                alert(`الدرجة لا يمكن أن تتجاوز ${maxGrade}`)
                return
            }
            
            console.log("🔍 Debug - Grade validation passed:", numValue)

            const validation = validateFlexibleGrade(numValue, maxGrade, field === 'periodExam' ? 'exam' : 'monthly')
            
            console.log("🔍 Debug - validation:", validation)
            console.log("🔍 Debug - validation.isValid:", validation.isValid)
            console.log("🔍 Debug - validation.error:", validation.error)
            
            if (!validation.isValid) {
                console.log("🔍 Debug - Validation failed:", validation.error)
                alert(validation.error)
                return
            }
        }

        // تحديث الطالب مع الحفظ التلقائي
        console.log("🔍 Debug - Updating student with ID:", studentId)
        console.log("🔍 Debug - Field:", field)
        console.log("🔍 Debug - Value:", numValue)
        
        // وضع الدرجة في حالة مراجعة
        markForReview(studentId)
        
        setStudents(prev => prev.map(student => {
            if (student.id === studentId) {
                const currentPeriod = selectedPeriod as string || "الفترة الأولى"
                console.log("🔍 Debug - Current period:", currentPeriod)
                const updatedGrades = {
                    ...student.grades,
                    [currentPeriod]: {
                        ...student.grades[currentPeriod],
                        [field]: numValue
                    }
                }
                console.log("🔍 Debug - Updated grades:", updatedGrades)
                console.log("🔍 Debug - student.grades before update:", student.grades)

                // إعادة حساب المجاميع
                const periodGrades = updatedGrades[currentPeriod]
                console.log("🔍 Debug - periodGrades for calculation:", periodGrades)
                console.log("🔍 Debug - periodGrades.month1:", periodGrades.month1)
                console.log("🔍 Debug - periodGrades.month2:", periodGrades.month2)
                console.log("🔍 Debug - periodGrades.month3:", periodGrades.month3)
                console.log("🔍 Debug - periodGrades.periodExam:", periodGrades.periodExam)
                
                if (flexibleDist) {
                    // استخدام النظام المرن
                    const currentPeriodKey = currentPeriod === "الفترة الأولى" ? "firstPeriod" : 
                                           currentPeriod === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod"
                    console.log("🔍 Debug - handleGradeChange update periodKey:", currentPeriodKey)
                    const periodInfo = getPeriodInfo(flexibleDist, currentPeriodKey as any)
                    console.log("🔍 Debug - periodInfo for calculation:", periodInfo)
                    console.log("🔍 Debug - periodInfo.monthsCount for calculation:", periodInfo.monthsCount)
                    
                    // حساب متوسط الأشهر - فقط للأشهر المحددة في التوزيع المرن
                    let monthlyAverage = 0
                    if (currentPeriod !== "الفترة الثالثة") {
                        const monthlyGrades: number[] = []
                        for (let i = 1; i <= periodInfo.monthsCount; i++) {
                            const monthKey = `month${i}` as 'month1' | 'month2' | 'month3'
                            const grade = periodGrades[monthKey]
                            if (grade !== null && grade !== undefined) {
                                monthlyGrades.push(grade)
                            }
                        }
                        console.log("🔍 Debug - monthlyGrades for calculation:", monthlyGrades)
                        console.log("🔍 Debug - periodInfo.monthsCount:", periodInfo.monthsCount)
                        console.log("🔍 Debug - monthlyGrades.length:", monthlyGrades.length)
                        
                        monthlyAverage = monthlyGrades.length > 0 
                            ? monthlyGrades.reduce((sum, grade) => sum + grade, 0) / monthlyGrades.length
                            : 0
                        console.log("🔍 Debug - calculated monthlyAverage:", monthlyAverage)
                        console.log("🔍 Debug - monthlyGrades.reduce result:", monthlyGrades.reduce((sum, grade) => sum + grade, 0))
                    } else {
                        console.log("🔍 Debug - Third period, no monthly average calculation")
                    }
                    
                    // حساب مجموع الفترة
                    let periodTotal: number
                    if (currentPeriod === "الفترة الثالثة") {
                        // الفترة الثالثة بدون أشهر - فقط امتحان مباشر
                        periodTotal = periodGrades.periodExam || 0
                        console.log("🔍 Debug - Third period total (exam only):", periodTotal)
                        console.log("🔍 Debug - periodGrades.periodExam:", periodGrades.periodExam)
                    } else {
                        // الفترتين الأولى والثانية
                        periodTotal = monthlyAverage + (periodGrades.periodExam || 0)
                        console.log("🔍 Debug - First/Second period total:", periodTotal, "monthlyAverage:", monthlyAverage, "periodExam:", periodGrades.periodExam)
                        console.log("🔍 Debug - monthlyAverage + periodExam:", monthlyAverage, "+", periodGrades.periodExam, "=", periodTotal)
                    }
                    console.log("🔍 Debug - calculated periodTotal:", periodTotal)
                    console.log("🔍 Debug - currentPeriod:", currentPeriod)
                    
                    // حساب النسبة والتقدير
                    const percentage = flexibleDist.finalCalculation.totalGrade > 0 
                        ? (periodTotal / flexibleDist.finalCalculation.totalGrade) * 100 
                        : 0
                    
                    let grade = ""
                    let gradeColor = ""
                    if (percentage >= 90) {
                        grade = "ممتاز"
                        gradeColor = "text-green-600"
                    } else if (percentage >= 80) {
                        grade = "جيد جداً"
                        gradeColor = "text-blue-600"
                    } else if (percentage >= 70) {
                        grade = "جيد"
                        gradeColor = "text-yellow-600"
                    } else if (percentage >= 60) {
                        grade = "مقبول"
                        gradeColor = "text-orange-600"
                    } else {
                        grade = "راسب"
                        gradeColor = "text-red-600"
                    }
                    console.log("🔍 Debug - calculated percentage and grade:", { percentage, grade, gradeColor })
                    console.log("🔍 Debug - flexibleDist.finalCalculation.totalGrade:", flexibleDist.finalCalculation.totalGrade)
                    console.log("🔍 Debug - percentage calculation:", periodTotal, "/", flexibleDist.finalCalculation.totalGrade, "* 100 =", percentage)
                    console.log("🔍 Debug - flexibleDist.finalCalculation:", flexibleDist.finalCalculation)
                    
                    updatedGrades[currentPeriod] = {
                        ...periodGrades,
                        workTotal: monthlyAverage,
                        periodTotal: periodTotal,
                        percentage: percentage,
                        grade: grade,
                        gradeColor: gradeColor
                    }
                    console.log("🔍 Debug - updated grades:", updatedGrades[currentPeriod])
                    console.log("🔍 Debug - periodGrades before update:", periodGrades)
                    console.log("🔍 Debug - workTotal:", monthlyAverage)
                    console.log("🔍 Debug - periodTotal:", periodTotal)
                    console.log("🔍 Debug - percentage:", percentage)
                    console.log("🔍 Debug - grade:", grade)
                    console.log("🔍 Debug - gradeColor:", gradeColor)
                    console.log("🔍 Debug - updatedGrades[currentPeriod]:", updatedGrades[currentPeriod])
                    
                    // إذا كانت الفترة الثالثة، سحب الدرجات من الفترتين السابقتين
                    if (currentPeriod === "الفترة الثالثة" && flexibleDist) {
                        console.log("🔍 Debug - Processing third period")
                        const firstPeriodGrades = student.grades["الفترة الأولى"] || {}
                        const secondPeriodGrades = student.grades["الفترة الثانية"] || {}
                        
                        console.log("🔍 Debug - firstPeriodGrades:", firstPeriodGrades)
                        console.log("🔍 Debug - secondPeriodGrades:", secondPeriodGrades)
                        console.log("🔍 Debug - student.grades:", student.grades)
                        
                        const { firstPeriodTotal, secondPeriodTotal } = pullGradesFromPreviousPeriods(
                            firstPeriodGrades,
                            secondPeriodGrades,
                            flexibleDist
                        )
                        
                        // الفترة الثالثة بدون أشهر - فقط امتحان مباشر
                        const thirdPeriodTotal = periodGrades.periodExam || 0
                        
                        // حساب المجموع النهائي مع النسبة المئوية والتقدير
                        const finalTotal = calculateFinalTotal(
                            firstPeriodTotal,
                            secondPeriodTotal,
                            thirdPeriodTotal,
                            flexibleDist
                        )
                        
                        const { percentage, grade, color } = calculatePercentageAndGrade(
                            finalTotal,
                            flexibleDist.finalCalculation.totalGrade
                        )
                        
                        updatedGrades[currentPeriod] = {
                            ...updatedGrades[currentPeriod],
                            firstPeriodTotal,
                            secondPeriodTotal,
                            finalTotal,
                            percentage,
                            grade,
                            gradeColor: color
                        } as any
                        console.log("🔍 Debug - Updated third period grades:", updatedGrades[currentPeriod])
                        console.log("🔍 Debug - firstPeriodTotal:", firstPeriodTotal)
                        console.log("🔍 Debug - secondPeriodTotal:", secondPeriodTotal)
                        console.log("🔍 Debug - thirdPeriodTotal:", thirdPeriodTotal)
                        console.log("🔍 Debug - finalTotal:", finalTotal)
                        console.log("🔍 Debug - percentage:", percentage)
                        console.log("🔍 Debug - grade:", grade)
                        console.log("🔍 Debug - color:", color)
                    }
                }

                console.log("🔍 Debug - Final updated student:", { ...student, grades: updatedGrades })
                console.log("🔍 Debug - student.id:", student.id)
                console.log("🔍 Debug - student.studentName:", student.studentName)
                console.log("🔍 Debug - updatedGrades:", updatedGrades)
                console.log("🔍 Debug - updatedGrades[currentPeriod]:", updatedGrades[currentPeriod])
                return {
                    ...student,
                    grades: updatedGrades
                }
            }
            return student
        }))
        console.log("🔍 Debug - handleGradeChange completed")
        console.log("🔍 Debug - students after update:", students)
        console.log("🔍 Debug - students length:", students.length)
        console.log("🔍 Debug - students first item:", students[0])
        
        // لا يوجد حفظ تلقائي - الحفظ فقط بعد الاعتماد
    }

    const handleSaveGrades = async () => {
        console.log("🔍 Debug - handleSaveGrades called")
        console.log("🔍 Debug - students before save:", students)
        console.log("🔍 Debug - students length before save:", students.length)
        console.log("🔍 Debug - students first item before save:", students[0])
        
        // التحقق من أن جميع الدرجات معتمدة
        const unapprovedStudents = students.filter(student => !canSaveGrades(student.id))
        if (unapprovedStudents.length > 0) {
            alert(`يجب اعتماد درجات ${unapprovedStudents.length} طالب قبل الحفظ النهائي`)
            return
        }
        
        try {
            setSaveStatus('saving')

            // تحضير بيانات الحفظ
            console.log("🔍 Debug - Preparing grades data for", students.length, "students")
            console.log("🔍 Debug - selectedPeriod:", selectedPeriod)
            console.log("🔍 Debug - selectedSubject:", selectedSubject)
            console.log("🔍 Debug - selectedYear:", selectedYear)
            console.log("🔍 Debug - selectedLevel:", selectedLevel)
            console.log("🔍 Debug - selectedSystem:", selectedSystem)
            const gradesData = students.map(student => {
                const currentPeriod = selectedPeriod as string || "الفترة الأولى"
                const periodGrades = student.grades[currentPeriod] || {}
                console.log("🔍 Debug - Student grades for", currentPeriod, ":", periodGrades)
                console.log("🔍 Debug - student.grades:", student.grades)
                console.log("🔍 Debug - student.id:", student.id)
                console.log("🔍 Debug - student.studentName:", student.studentName)
                console.log("🔍 Debug - currentPeriod:", currentPeriod)

                const gradeData = {
                    studentId: student.id,
                    subjectName: selectedSubject?.name,
                    academicYear: selectedYear,
                    period: selectedPeriod,
                    month1: periodGrades.month1,
                    month2: periodGrades.month2,
                    month3: periodGrades.month3,
                    periodExam: periodGrades.periodExam,
                    workTotal: periodGrades.workTotal,
                    periodTotal: periodGrades.periodTotal,
                    percentage: periodGrades.percentage,
                    grade: periodGrades.grade,
                    gradeColor: periodGrades.gradeColor
                }
                console.log("🔍 Debug - Grade data for student:", gradeData)
                console.log("🔍 Debug - periodGrades.month1:", periodGrades.month1)
                console.log("🔍 Debug - periodGrades.month2:", periodGrades.month2)
                console.log("🔍 Debug - periodGrades.month3:", periodGrades.month3)
                console.log("🔍 Debug - periodGrades.periodExam:", periodGrades.periodExam)
                console.log("🔍 Debug - periodGrades.workTotal:", periodGrades.workTotal)
                console.log("🔍 Debug - periodGrades.periodTotal:", periodGrades.periodTotal)
                console.log("🔍 Debug - periodGrades.percentage:", periodGrades.percentage)
                console.log("🔍 Debug - periodGrades.grade:", periodGrades.grade)
                console.log("🔍 Debug - periodGrades.gradeColor:", periodGrades.gradeColor)
                console.log("🔍 Debug - selectedSubject?.name:", selectedSubject?.name)
                console.log("🔍 Debug - selectedYear:", selectedYear)
                console.log("🔍 Debug - selectedPeriod:", selectedPeriod)
                return gradeData
            })

            console.log("🔍 Debug - Sending grades data to API:", gradesData)
            console.log("🔍 Debug - gradesData length:", gradesData.length)
            console.log("🔍 Debug - gradesData first item:", gradesData[0])
            console.log("🔍 Debug - gradesData second item:", gradesData[1])
            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grades: gradesData })
            })

            if (response.ok) {
                console.log("🔍 Debug - Grades saved successfully")
                setSaveStatus('saved')
                setTimeout(() => setSaveStatus('idle'), 3000)
            } else {
                console.log("🔍 Debug - Error saving grades:", response.status, response.statusText)
                const errorText = await response.text()
                console.log("🔍 Debug - Error response:", errorText)
                setSaveStatus('error')
            }
        } catch (error) {
            console.error('خطأ في حفظ الدرجات:', error)
            console.log("🔍 Debug - Error details:", error)
            setSaveStatus('error')
        }
        console.log("🔍 Debug - handleSaveGrades completed")
        console.log("🔍 Debug - Final students state:", students)
        console.log("🔍 Debug - Final students length:", students.length)
    }

    const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("🔍 Debug - handleExcelUpload called")
        const file = event.target.files?.[0]
        if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            console.log("🔍 Debug - Excel file selected:", file.name)
            console.log("🔍 Debug - Excel file size:", file.size)
            console.log("🔍 Debug - Excel file type:", file.type)
            console.log("🔍 Debug - Excel file lastModified:", file.lastModified)
            setExcelFile(file)
        } else {
            console.log("🔍 Debug - Invalid file type:", file?.type)
            console.log("🔍 Debug - File:", file)
        }
    }

    const importExcelData = async () => {
        console.log("🔍 Debug - importExcelData called")
        console.log("🔍 Debug - excelFile:", excelFile)
        console.log("🔍 Debug - selectedSubject:", selectedSubject)
        console.log("🔍 Debug - selectedLevel:", selectedLevel)
        console.log("🔍 Debug - selectedSystem:", selectedSystem)
        console.log("🔍 Debug - selectedPeriod:", selectedPeriod)
        console.log("🔍 Debug - selectedYear:", selectedYear)
        if (!excelFile || !selectedSubject) {
            console.log("🔍 Debug - No excel file or subject selected")
            return
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("file", excelFile)
            formData.append("subjectId", selectedSubject.id.toString())
            formData.append("academicYear", selectedYear)
            formData.append("educationLevel", selectedLevel as string)
            formData.append("studySystem", selectedSystem as string)
            formData.append("period", selectedPeriod as string)
            
            console.log("🔍 Debug - FormData entries:")
            // استخدام Array.from لتحويل FormData.entries() إلى مصفوفة
            Array.from(formData.entries()).forEach(([key, value]) => {
                console.log("🔍 Debug -", key, ":", value)
            })
            console.log("🔍 Debug - selectedSubject.id:", selectedSubject.id)
            console.log("🔍 Debug - selectedYear:", selectedYear)
            console.log("🔍 Debug - selectedLevel:", selectedLevel)
            console.log("🔍 Debug - selectedSystem:", selectedSystem)
            console.log("🔍 Debug - selectedPeriod:", selectedPeriod)
            console.log("🔍 Debug - excelFile.name:", excelFile.name)
            console.log("🔍 Debug - excelFile.size:", excelFile.size)

            console.log("🔍 Debug - Sending import request with:", {
                subjectId: selectedSubject.id,
                academicYear: selectedYear,
                period: selectedPeriod,
                educationLevel: selectedLevel,
                studySystem: selectedSystem
            })
            const fileEntry = formData.get("file")
            console.log("🔍 Debug - FormData size:", fileEntry instanceof File ? fileEntry.size : 'N/A')
            console.log("🔍 Debug - FormData file name:", fileEntry instanceof File ? fileEntry.name : 'N/A')

            const res = await fetch("/api/grades/import-excel", {
                method: "POST",
                body: formData
            })

            console.log("🔍 Debug - Import response status:", res.status)
            console.log("🔍 Debug - Import response ok:", res.ok)
            console.log("🔍 Debug - Import response headers:", res.headers)
            console.log("🔍 Debug - Import response statusText:", res.statusText)

            if (res.ok) {
                const data = await res.json()
                console.log("🔍 Debug - Import response:", data)
                setImportResults(data)
                if (data.success > 0) {
                    console.log("🔍 Debug - Reloading students after import")
                    await loadStudents() // إعادة تحميل البيانات
                }
            } else {
                console.log("🔍 Debug - Import failed:", res.status, res.statusText)
                const errorText = await res.text()
                console.log("🔍 Debug - Import error response:", errorText)
            }
        } catch (error) {
            console.error("خطأ في استيراد البيانات:", error)
            console.log("🔍 Debug - Import error details:", error)
        } finally {
            setLoading(false)
        }
        console.log("🔍 Debug - importExcelData completed")
        console.log("🔍 Debug - Final students state after import:", students)
        console.log("🔍 Debug - Final students length after import:", students.length)
    }

    const distribution = getGradeDistributionForSelected()
    console.log("🔍 Debug - distribution:", distribution)
    console.log("🔍 Debug - selectedSubject:", selectedSubject)
    console.log("🔍 Debug - selectedLevel:", selectedLevel)
    console.log("🔍 Debug - selectedSystem:", selectedSystem)
    console.log("🔍 Debug - selectedPeriod:", selectedPeriod)
    console.log("🔍 Debug - selectedYear:", selectedYear)

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-lama-sky-light to-lama-yellow-light p-6" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* العنوان الرئيسي */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-4 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-2xl shadow-lg">
                            <Calculator className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold gradient-text font-tajawal">
                            نظام إدارة الدرجات المتقدم
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-cairo">
                        نظام شامل ومتطور لإدارة وإدخال درجات الطلاب مع دعم جميع المراحل التعليمية وأنظمة الدراسة المختلفة
                    </p>
                </div>

                {/* بطاقة إعدادات الفلاتر */}
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Filter className="w-6 h-6" />
                            إعدادات الفلاتر والمعايير
                        </CardTitle>
                        <CardDescription className="text-lama-purple-light">
                            حدد المعايير المطلوبة لإدارة درجات الطلاب
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* العام الدراسي */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    العام الدراسي
                                    {selectedYear && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </Label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="modern-input text-right" dir="rtl">
                                        <SelectValue placeholder="اختر العام الدراسي" />
                                    </SelectTrigger>
                                    <SelectContent className="text-right" dir="rtl">
                                        {academicYears.map((year) => (
                                            <SelectItem key={year.id} value={year.name}>
                                                {year.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* المرحلة التعليمية */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    المرحلة التعليمية
                                    {selectedLevel && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </Label>
                                <Select 
                                    value={selectedLevel} 
                                    onValueChange={(value: StudyLevel) => setSelectedLevel(value)}
                                    disabled={!selectedYear}
                                >
                                    <SelectTrigger className={`modern-input text-right ${!selectedYear ? 'opacity-50 cursor-not-allowed' : ''}`} dir="rtl">
                                        <SelectValue placeholder={!selectedYear ? "اختر العام الدراسي أولاً" : "اختر المرحلة"} />
                                    </SelectTrigger>
                                    <SelectContent className="text-right" dir="rtl">
                                        <SelectItem value="السنة الأولى">السنة الأولى</SelectItem>
                                        <SelectItem value="السنة الثانية">السنة الثانية</SelectItem>
                                        <SelectItem value="السنة الثالثة">السنة الثالثة</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* نظام الدراسة */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    نظام الدراسة
                                    {selectedSystem && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </Label>
                                <Select 
                                    value={selectedSystem} 
                                    onValueChange={(value: StudySystem) => setSelectedSystem(value)}
                                    disabled={!selectedLevel}
                                >
                                    <SelectTrigger className={`modern-input text-right ${!selectedLevel ? 'opacity-50 cursor-not-allowed' : ''}`} dir="rtl">
                                        <SelectValue placeholder={!selectedLevel ? "اختر المرحلة أولاً" : "اختر النظام"} />
                                    </SelectTrigger>
                                    <SelectContent className="text-right" dir="rtl">
                                        <SelectItem value="نظامي">نظامي</SelectItem>
                                        <SelectItem value="انتساب">انتساب</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* المادة الدراسية */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    المادة الدراسية
                                    {selectedSubject && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </Label>
                                <Select
                                    value={selectedSubject?.id.toString() || ""}
                                    onValueChange={(value: string) => {
                                        const subject = subjects.find(s => s.id.toString() === value)
                                        setSelectedSubject(subject || null)
                                    }}
                                    disabled={!selectedSystem}
                                >
                                    <SelectTrigger className={`modern-input text-right ${!selectedSystem ? 'opacity-50 cursor-not-allowed' : ''}`} dir="rtl">
                                        <SelectValue placeholder={!selectedSystem ? "اختر النظام أولاً" : "اختر المادة"} />
                                    </SelectTrigger>
                                    <SelectContent className="text-right" dir="rtl">
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* فترة التقييم */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    فترة التقييم
                                    {selectedPeriod && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </Label>
                                <Select
                                    value={selectedPeriod}
                                    onValueChange={(value: EvaluationPeriod) => setSelectedPeriod(value)}
                                    disabled={
                                        !selectedSubject ||
                                        // تعطيل الفترات للسنة الثالثة المنتسبات
                                        (selectedLevel === "السنة الثالثة" && selectedSystem === "انتساب")
                                    }
                                >
                                    <SelectTrigger className={`modern-input text-right ${!selectedSubject ? 'opacity-50 cursor-not-allowed' : ''}`} dir="rtl">
                                        <SelectValue placeholder={
                                            !selectedSubject ? "اختر المادة أولاً" : 
                                            "اختر الفترة"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent className="text-right" dir="rtl">
                                        {/* السنة الأولى والثانية النظاميات: جميع الفترات */}
                                        {((selectedLevel === "السنة الأولى" || selectedLevel === "السنة الثانية") && selectedSystem === "نظامي") && (
                                            <>
                                                <SelectItem value="الفترة الأولى">الفترة الأولى</SelectItem>
                                                <SelectItem value="الفترة الثانية">الفترة الثانية</SelectItem>
                                                <SelectItem value="الفترة الثالثة">الفترة الثالثة</SelectItem>
                                            </>
                                        )}
                                        {/* السنة الأولى والثانية المنتسبات: فترة ثالثة فقط */}
                                        {((selectedLevel === "السنة الأولى" || selectedLevel === "السنة الثانية") && selectedSystem === "انتساب") && (
                                            <SelectItem value="الفترة الثالثة">الفترة الثالثة</SelectItem>
                                        )}
                                        {/* السنة الثالثة النظاميات: فترات أولى وثانية فقط */}
                                        {(selectedLevel === "السنة الثالثة" && selectedSystem === "نظامي") && (
                                            <>
                                                <SelectItem value="الفترة الأولى">الفترة الأولى</SelectItem>
                                                <SelectItem value="الفترة الثانية">الفترة الثانية</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                                                    {/* مؤشر التحميل التلقائي */}
                        <div className="flex items-end gap-4">
                            {isLoadingData ? (
                                <div className="flex-1 flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-lama-sky-light to-lama-yellow-light rounded-xl border border-lama-sky">
                                    <div className="w-5 h-5 border-2 border-lama-sky border-t-transparent rounded-full animate-spin" />
                                    <span className="text-lama-sky font-semibold">جاري التحميل...</span>
                                </div>
                            ) : null}
                            
                            {/* زر اختبار قاعدة البيانات */}
                            <Button
                                onClick={async () => {
                                    try {
                                        const res = await fetch('/api/test-db')
                                        const data = await res.json()
                                        console.log("🧪 اختبار قاعدة البيانات:", data)
                                        alert(`عدد الطلاب: ${data.data?.studentCount || 0}\nعدد المواد: ${data.data?.subjectCount || 0}`)
                                    } catch (error) {
                                        console.error("خطأ في اختبار قاعدة البيانات:", error)
                                        alert("خطأ في الاتصال بقاعدة البيانات")
                                    }
                                }}
                                variant="outline"
                                className="border-lama-sky text-lama-sky hover:bg-lama-sky hover:text-white"
                            >
                                اختبار قاعدة البيانات
                            </Button>
                        </div>
                        </div>

                        {/* عرض أخطاء التحقق */}
                        {validationErrors.length > 0 && (
                            <Alert className="mt-6 border-red-300 bg-red-50 rounded-2xl">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <div className="font-semibold mb-2">يرجى تصحيح الأخطاء التالية:</div>
                                    <ul className="list-disc list-inside space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}


                    </CardContent>
                </Card>

                {/* عرض توزيع الدرجات الديناميكي */}
                {selectedSubject && flexibleDistribution && (
                    <Card className="modern-card">
                        <CardHeader className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white rounded-t-3xl">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Eye className="w-6 h-6" />
                                توزيع الدرجات - {selectedSubject.name}
                            </CardTitle>
                            <CardDescription className="text-lama-purple-light">
                                التوزيع المعتمد للمرحلة: {selectedLevel} - الفترة: {selectedPeriod}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {/* درجة الشهر - تظهر فقط إذا كانت الفترة تحتوي على أشهر */}
                                {(() => {
                                    const currentPeriodKey = selectedPeriod === "الفترة الأولى" ? "firstPeriod" : 
                                                           selectedPeriod === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod"
                                    const periodInfo = getPeriodInfo(flexibleDistribution, currentPeriodKey as any)
                                    
                                    if (periodInfo.monthsCount > 0) {
                                        return (
                                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all">
                                                <div className="text-3xl font-bold text-green-600 mb-2">{periodInfo.monthlyGrade}</div>
                                                <div className="text-sm text-green-700 font-semibold">درجة الشهر</div>
                                            </div>
                                        )
                                    }
                                    return null
                                })()}
                                
                                {/* متوسط الأشهر - تظهر فقط إذا كانت الفترة تحتوي على أشهر */}
                                {(() => {
                                    const currentPeriodKey = selectedPeriod === "الفترة الأولى" ? "firstPeriod" : 
                                                           selectedPeriod === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod"
                                    const periodInfo = getPeriodInfo(flexibleDistribution, currentPeriodKey as any)
                                    
                                    if (periodInfo.monthsCount > 0) {
                                        // المتوسط = مجموع درجات الأشهر ÷ عدد الأشهر
                                        // هنا نعرض درجة الشهر الواحدة (لأنها متساوية في النظام)
                                        const monthlyAverage = periodInfo.monthlyGrade
                                        return (
                                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all">
                                                <div className="text-3xl font-bold text-blue-600 mb-2">{monthlyAverage}</div>
                                                <div className="text-sm text-blue-700 font-semibold">متوسط الأشهر</div>
                                            </div>
                                        )
                                    }
                                    return null
                                })()}
                                
                                {/* امتحان الفترة - تظهر دائماً */}
                                {(() => {
                                    const currentPeriodKey = selectedPeriod === "الفترة الأولى" ? "firstPeriod" : 
                                                           selectedPeriod === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod"
                                    const periodInfo = getPeriodInfo(flexibleDistribution, currentPeriodKey as any)
                                    
                                    return (
                                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-all">
                                            <div className="text-3xl font-bold text-purple-600 mb-2">{periodInfo.periodExam}</div>
                                            <div className="text-sm text-purple-700 font-semibold">امتحان الفترة</div>
                                        </div>
                                    )
                                })()}
                                
                                {/* مجموع الفترة - يظهر حسب نوع الفترة */}
                                {(() => {
                                    const currentPeriodKey = selectedPeriod === "الفترة الأولى" ? "firstPeriod" : 
                                                           selectedPeriod === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod"
                                    const periodInfo = getPeriodInfo(flexibleDistribution, currentPeriodKey as any)
                                    
                                    let periodTotal = 0
                                    if (currentPeriodKey === "thirdPeriod") {
                                        // الفترة الثالثة: درجة الفترة الأولى + درجة الفترة الثانية + درجة الفترة الثالثة
                                        const firstPeriodInfo = getPeriodInfo(flexibleDistribution, "firstPeriod" as any)
                                        const secondPeriodInfo = getPeriodInfo(flexibleDistribution, "secondPeriod" as any)
                                        
                                        // حساب مجموع الفترة الأولى
                                        const firstPeriodTotal = firstPeriodInfo.monthsCount > 0 ? 
                                            (firstPeriodInfo.monthlyGrade * firstPeriodInfo.monthsCount + firstPeriodInfo.periodExam) : 
                                            firstPeriodInfo.periodExam
                                        
                                        // حساب مجموع الفترة الثانية
                                        const secondPeriodTotal = secondPeriodInfo.monthsCount > 0 ? 
                                            (secondPeriodInfo.monthlyGrade * secondPeriodInfo.monthsCount + secondPeriodInfo.periodExam) : 
                                            secondPeriodInfo.periodExam
                                        
                                        // المجموع الكلي = الفترة الأولى + الفترة الثانية + الفترة الثالثة
                                        periodTotal = firstPeriodTotal + secondPeriodTotal + periodInfo.periodExam
                                    } else {
                                        // الفترتين الأولى والثانية: متوسط درجة الأشهر + درجة امتحان الفترة
                                        const monthlyAverage = periodInfo.monthlyGrade // متوسط درجة الأشهر
                                        periodTotal = monthlyAverage + periodInfo.periodExam
                                    }
                                    
                                    return (
                                        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 hover:shadow-lg transition-all">
                                            <div className="text-3xl font-bold text-orange-600 mb-2">{periodTotal}</div>
                                            <div className="text-sm text-orange-700 font-semibold">
                                                {currentPeriodKey === "thirdPeriod" ? "المجموع الكلي" : "مجموع الفترة"}
                                            </div>
                                        </div>
                                    )
                                })()}
                                
                                {/* الفترة الثالثة - تظهر فقط إذا كانت الفترة الثالثة مختارة */}
                                {selectedPeriod === "الفترة الثالثة" && (() => {
                                    const periodInfo = getPeriodInfo(flexibleDistribution, "thirdPeriod" as any)
                                    return (
                                        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-all">
                                            <div className="text-3xl font-bold text-red-600 mb-2">{periodInfo.periodExam}</div>
                                            <div className="text-sm text-red-700 font-semibold">الفترة الثالثة</div>
                                        </div>
                                    )
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* أقسام إدخال الدرجات */}
                <Tabs defaultValue="manual" className="space-y-6">
                    <TabsList className="flex w-full bg-white/80 shadow-xl rounded-2xl p-2" dir="rtl">
                        <TabsTrigger
                            value="manual"
                            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-lama-sky data-[state=active]:to-lama-yellow data-[state=active]:text-white rounded-xl text-lg py-3 transition-all duration-300"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Users className="w-5 h-5" />
                                إدخال يدوي
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="flexible"
                            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-lama-sky data-[state=active]:to-lama-yellow data-[state=active]:text-white rounded-xl text-lg py-3 transition-all duration-300"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Settings className="w-5 h-5" />
                                نظام مرن
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="excel"
                            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-lama-sky data-[state=active]:to-lama-yellow data-[state=active]:text-white rounded-xl text-lg py-3 transition-all duration-300"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FileSpreadsheet className="w-5 h-5" />
                                استيراد Excel
                            </div>
                        </TabsTrigger>
                    </TabsList>

                    {/* محتوى الإدخال اليدوي */}
                    <TabsContent value="manual" className="space-y-6">
                        {/* مؤشر التحميل */}
                        {isLoadingStudents && (
                            <Card className="modern-card">
                                <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        جاري التحميل...
                                    </CardTitle>
                                    <CardDescription className="text-lama-purple-light">
                                        جلب بيانات الطلاب من قاعدة البيانات
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center gap-4 py-8">
                                        <div className="w-12 h-12 border-4 border-lama-sky border-t-transparent rounded-full animate-spin" />
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-lama-sky mb-2">جاري تحميل بيانات الطلاب...</h3>
                                            <p className="text-gray-600 mb-4">يرجى الانتظار بينما نقوم بجلب البيانات من قاعدة البيانات</p>
                                            <div className="bg-gradient-to-r from-lama-sky-light to-lama-yellow-light rounded-xl p-4">
                                                <p className="text-sm text-lama-sky font-semibold">
                                                    المعايير المحددة: {selectedYear} - {selectedLevel} - {selectedSystem} - {selectedSubject?.name} - {selectedPeriod}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* عرض النتائج */}
                        {isFormEnabled && students.length > 0 && !isLoadingStudents ? (
                            <Card className="modern-card">
                                <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                                    <div className="flex items-center justify-between" dir="rtl">
                                        <div>
                                            <CardTitle className="flex items-center gap-3 text-2xl">
                                                <Users className="w-6 h-6" />
                                                قائمة الطلاب - {students.length} طالب
                                                <Badge variant="secondary" className="bg-lama-yellow-light text-lama-sky">
                                                    تم التحميل بنجاح
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="text-lama-purple-light mt-2">
                                                المادة: {selectedSubject?.name} | الفترة: {selectedPeriod}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleSaveGrades}
                                                disabled={saveStatus === 'saving' || students.some(student => !canSaveGrades(student.id))}
                                                className="bg-white text-lama-yellow hover:bg-lama-purple-light disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {saveStatus === 'saving' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-lama-yellow border-t-transparent rounded-full animate-spin" />
                                                        جاري الحفظ...
                                                    </div>
                                                ) : saveStatus === 'saved' ? (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        تم الحفظ
                                                    </div>
                                                ) : saveStatus === 'error' ? (
                                                    <div className="flex items-center gap-2">
                                                        <XCircle className="w-5 h-5" />
                                                        خطأ في الحفظ
                                                    </div>
                                                ) : students.some(student => !canSaveGrades(student.id)) ? (
                                                    <div className="flex items-center gap-2">
                                                        <AlertTriangle className="w-5 h-5" />
                                                        يجب اعتماد جميع الدرجات
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Save className="w-5 h-5" />
                                                        حفظ الدرجات
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        {students.map((student) => {
                                            const restrictions = getStudentRestrictionsForSelected(student)
                                            const currentPeriodGrades = student.grades[selectedPeriod as string] || {}

                                            return (
                                                <div key={student.id} className="p-6 border-2 border-lama-sky-light rounded-2xl hover:shadow-xl transition-all bg-white/50 backdrop-blur-sm" dir="rtl">
                                                    <div className="flex items-center justify-between mb-4" dir="rtl">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                                {student.studentName.charAt(0)}
                                                            </div>
                                                            <div className="text-right">
                                                                <h4 className="text-xl font-bold text-gray-800">{student.studentName}</h4>
                                                                <p className="text-lama-yellow font-semibold">رقم الطالب: {student.studentNumber}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {student.educationLevel} - {student.studySystem} - {student.specialization}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Badge variant={student.isDiploma ? "destructive" : "default"} className="text-center">
                                                                {student.isDiploma ? "دبلوم" : "عادي"}
                                                            </Badge>
                                                            <Badge variant={student.studySystem === "نظامي" ? "default" : "secondary"}>
                                                                {student.studySystem}
                                                            </Badge>
                                                            {/* حالة المراجعة والاعتماد */}
                                                            {(() => {
                                                                const status = getGradeStatus(student.id)
                                                                switch (status) {
                                                                    case 'pending':
                                                                        return <Badge variant="destructive" className="text-center">في انتظار المراجعة</Badge>
                                                                    case 'reviewed':
                                                                        return <Badge variant="secondary" className="text-center">تم المراجعة</Badge>
                                                                    case 'approved':
                                                                        return <Badge variant="default" className="text-center bg-green-600">معتمد</Badge>
                                                                    default:
                                                                        return null
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    {!restrictions.canEnterGrades ? (
                                                        <Alert className="border-orange-300 bg-orange-50 rounded-xl">
                                                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                                                            <AlertDescription className="text-orange-800 font-semibold">
                                                                {restrictions.restrictions.join(" • ")}
                                                            </AlertDescription>
                                                        </Alert>
                                                    ) : selectedPeriod === "الفترة الثالثة" && flexibleDistribution ? (
                                                        // واجهة خاصة للفترة الثالثة - امتحان مباشر فقط
                                                        <div className="space-y-4">
                                                            <Alert className="border-lama-sky bg-gradient-to-r from-lama-sky-light to-lama-yellow-light">
                                                                <Info className="h-5 w-5 text-lama-sky" />
                                                                <AlertDescription className="text-lama-sky">
                                                                    <p className="font-semibold">الفترة الثالثة - امتحان مباشر</p>
                                                                    <p className="text-sm">لا توجد أشهر في الفترة الثالثة، فقط امتحان مباشر</p>
                                                                </AlertDescription>
                                                            </Alert>
                                                            
                                                            <div className="flex gap-4 flex-wrap" dir="ltr">
                                                                {/* الفترة الأولى - للعرض فقط */}
                                                                <div className="flex-1 min-w-[120px]">
                                                                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">الفترة الأولى</Label>
                                                                    <div className="modern-input text-center text-lg font-bold bg-gradient-to-r from-lama-sky-light to-lama-yellow-light border-2 border-lama-sky p-3 rounded-xl">
                                                                        {currentPeriodGrades.firstPeriodTotal?.toFixed(1) || "0.0"}
                                                                    </div>
                                                                    <div className="text-xs text-lama-sky mt-1 text-center">
                                                                        من الفترة الأولى
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* الفترة الثانية - للعرض فقط */}
                                                                <div className="flex-1 min-w-[120px]">
                                                                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">الفترة الثانية</Label>
                                                                    <div className="modern-input text-center text-lg font-bold bg-gradient-to-r from-lama-sky-light to-lama-yellow-light border-2 border-lama-sky p-3 rounded-xl">
                                                                        {currentPeriodGrades.secondPeriodTotal?.toFixed(1) || "0.0"}
                                                                    </div>
                                                                    <div className="text-xs text-lama-sky mt-1 text-center">
                                                                        من الفترة الثانية
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* امتحان الفترة الثالثة - قابل للتعديل */}
                                                                <div className="flex-1 min-w-[120px]">
                                                                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">امتحان الفترة الثالثة</Label>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="0"
                                                                        value={currentPeriodGrades.periodExam || ""}
                                                                        onChange={(e) => handleGradeChange(student.id, 'periodExam', e.target.value)}
                                                                        className="modern-input text-center text-lg font-bold border-2 border-lama-yellow focus:border-lama-sky"
                                                                        min="0"
                                                                        step="0.1"
                                                                    />
                                                                    <div className="text-xs text-lama-sky mt-1 text-center">
                                                                        درجة الامتحان القابلة للإدخال
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* المجموع النهائي */}
                                                                <div className="flex-1 min-w-[120px]">
                                                                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">المجموع النهائي</Label>
                                                                    <div className="modern-input text-center text-lg font-bold bg-gradient-to-r from-lama-sky-light to-lama-yellow-light border-2 border-lama-sky p-3 rounded-xl">
                                                                        {currentPeriodGrades.finalTotal?.toFixed(1) || "0.0"}
                                                                    </div>
                                                                    <div className="text-xs text-lama-sky mt-1 text-center">
                                                                        المجموع الكلي
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* النسبة المئوية */}
                                                                <div className="flex-1 min-w-[120px]">
                                                                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">النسبة المئوية</Label>
                                                                    <div className={`modern-input text-center text-lg font-bold p-3 rounded-xl border-2 ${currentPeriodGrades.gradeColor || 'text-lama-sky border-lama-sky'}`}>
                                                                        {currentPeriodGrades.percentage?.toFixed(2) || "0.00"}%
                                                                    </div>
                                                                    <div className="text-xs text-lama-sky mt-1 text-center">
                                                                        النسبة المئوية
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* التقدير */}
                                                                <div className="flex-1 min-w-[120px]">
                                                                    <Label className="text-sm font-semibold text-lama-yellow mb-2 block text-right">التقدير</Label>
                                                                    <div className={`modern-input text-center text-lg font-bold p-3 rounded-xl border-2 ${currentPeriodGrades.gradeColor || 'text-lama-sky border-lama-sky'}`}>
                                                                        {currentPeriodGrades.grade || "غير محدد"}
                                                                    </div>
                                                                    <div className="text-xs text-lama-sky mt-1 text-center">
                                                                        التقدير النهائي
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // الواجهة الديناميكية للفترتين الأولى والثانية
                                                        <div className="flex gap-4 flex-wrap" dir="ltr">
                                                            {renderDynamicGradeInputs(student, currentPeriodGrades)}
                                                        </div>
                                                    )}
                                                    
                                                    {/* أزرار المراجعة والاعتماد */}
                                                    {restrictions.canEnterGrades && (
                                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                                            <div className="flex items-center justify-between" dir="rtl">
                                                                <div className="text-sm text-gray-600">
                                                                    <span className="font-semibold">حالة الدرجة:</span>
                                                                    {(() => {
                                                                        const status = getGradeStatus(student.id)
                                                                        switch (status) {
                                                                            case 'pending':
                                                                                return <span className="text-orange-600 mr-2">في انتظار المراجعة</span>
                                                                            case 'reviewed':
                                                                                return <span className="text-blue-600 mr-2">تم المراجعة</span>
                                                                            case 'approved':
                                                                                return <span className="text-green-600 mr-2">معتمد</span>
                                                                            default:
                                                                                return <span className="text-gray-500 mr-2">لم يتم إدخال درجات</span>
                                                                        }
                                                                    })()}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {getGradeStatus(student.id) === 'pending' && (
                                                                        <Button
                                                                            onClick={() => markAsReviewed(student.id)}
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                            size="sm"
                                                                        >
                                                                            مراجعة
                                                                        </Button>
                                                                    )}
                                                                    {getGradeStatus(student.id) === 'reviewed' && (
                                                                        <Button
                                                                            onClick={() => markAsApproved(student.id)}
                                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                                            size="sm"
                                                                        >
                                                                            اعتماد
                                                                        </Button>
                                                                    )}
                                                                    {getGradeStatus(student.id) === 'approved' && (
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex items-center gap-2 text-green-600">
                                                                                <CheckCircle2 className="w-4 h-4" />
                                                                                <span className="text-sm font-semibold">معتمد</span>
                                                                            </div>
                                                                            <Button
                                                                                onClick={() => unapproveGrades(student.id)}
                                                                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                                                                size="sm"
                                                                            >
                                                                                فك الاعتماد
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : isFormEnabled ? (
                            <Card className="modern-card">
                                <CardContent className="p-12 text-center">
                                    <div className="text-gray-400 mb-6">
                                        <Users className="w-24 h-24 mx-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-4">لا يوجد طلاب</h3>
                                    <p className="text-lg text-gray-500">لم يتم العثور على طلاب يطابقون المعايير المحددة</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="modern-card">
                                <CardContent className="p-12 text-center">
                                    <div className="text-gray-400 mb-6">
                                        <Filter className="w-24 h-24 mx-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-4">اختر الفلاتر أولاً</h3>
                                    <p className="text-lg text-gray-500">قم بتحديد جميع المعايير المطلوبة لعرض الطلاب</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* محتوى النظام المرن */}
                    <TabsContent value="flexible" className="space-y-6">
                        <FlexibleGradeDistributionManager
                            selectedEducationLevel={selectedLevel}
                            selectedStudySystem={selectedSystem}
                            onDistributionChange={(distribution) => {
                                if (distribution && distribution.id !== flexibleDistribution?.id) {
                                    setFlexibleDistribution(distribution)
                                    
                                    // تحديث التوزيع في الوقت الفعلي
                                    const updatedDistribution = updateGradeDistribution(distribution.id, distribution)
                                    if (updatedDistribution) {
                                        setFlexibleDistribution(updatedDistribution)
                                    }
                                }
                            }}
                        />
                        
                        {flexibleDistribution && (
                            <Card className="modern-card">
                                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-3xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-3 text-2xl">
                                                <Calculator className="w-6 h-6" />
                                                إدخال الدرجات - النظام المرن
                                            </CardTitle>
                                            <CardDescription className="text-purple-100">
                                                نظام مرن لإدخال الدرجات مع حساب تلقائي
                                            </CardDescription>
                                        </div>
                                        <Button
                                            onClick={refreshFlexibleDistribution}
                                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                            size="sm"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            تحديث النظام
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <Alert className="border-purple-300 bg-purple-50 rounded-2xl mb-6">
                                        <Settings className="h-6 w-6 text-purple-600" />
                                        <AlertDescription className="text-purple-800">
                                            <p className="font-semibold mb-2">النظام المرن قيد التطوير</p>
                                            <p>سيتم إضافة واجهة إدخال الدرجات المرنة قريباً مع الحساب التلقائي للمتوسط والمجموع.</p>
                                        </AlertDescription>
                                    </Alert>

                                    <div className="text-center py-8">
                                        <div className="text-6xl mb-4">⚙️</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">قيد التطوير</h3>
                                        <p className="text-gray-600">النظام المرن لإدخال الدرجات سيكون متاحاً قريباً</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* محتوى استيراد Excel */}
                    <TabsContent value="excel" className="space-y-6">
                        <Card className="modern-card">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-3xl">
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <Upload className="w-6 h-6" />
                                    استيراد درجات من ملف Excel
                                </CardTitle>
                                <CardDescription className="text-green-100">
                                    قم برفع ملف Excel يحتوي على درجات الطلاب مع التحقق التلقائي من صحة البيانات
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-8">
                                    {/* تعليمات التنسيق */}
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                                        <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-lg">
                                            <FileSpreadsheet className="w-5 h-5" />
                                            تنسيق الملف المطلوب
                                        </h4>
                                        <ul className="text-blue-700 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                الأعمدة المطلوبة: رقم الطالب، اسم الطالب، الشهر الأول، الشهر الثاني، الشهر الثالث، الامتحان
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                جميع الدرجات يجب أن تكون أرقام صحيحة أو عشرية بخانة واحدة
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                عدم تجاوز الحد الأقصى المسموح لكل مادة
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                تنسيق الملف: .xlsx أو .xls
                                            </li>
                                        </ul>
                                    </div>

                                    {/* منطقة رفع الملف */}
                                    <div className="border-4 border-dashed border-lama-sky-light rounded-2xl p-12 text-center hover:border-lama-sky transition-colors bg-gradient-to-br from-white to-lama-purple-light">
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleExcelUpload}
                                            className="hidden"
                                            id="excel-upload"
                                        />
                                        <label htmlFor="excel-upload" className="cursor-pointer">
                                            <div className="text-lama-sky mb-6">
                                                <FileSpreadsheet className="w-20 h-20 mx-auto" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-lama-yellow mb-4">
                                                {excelFile ? excelFile.name : "اضغط لاختيار ملف Excel"}
                                            </h3>
                                            <p className="text-lg text-gray-600">
                                                {excelFile ? "تم اختيار الملف بنجاح" : "أو اسحب الملف هنا"}
                                            </p>
                                        </label>
                                    </div>

                                    {/* زر الاستيراد */}
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={importExcelData}
                                            disabled={!excelFile || !isFormEnabled || loading}
                                            className="modern-button text-xl py-4 px-8"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    جاري الاستيراد...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <Upload className="w-6 h-6" />
                                                    استيراد البيانات
                                                </div>
                                            )}
                                        </Button>
                                    </div>

                                    {/* نتائج الاستيراد */}
                                    {importResults && (
                                        <div className="space-y-6">
                                            <Separator className="bg-lama-sky-light" />
                                            <h4 className="text-2xl font-bold text-lama-yellow">نتائج الاستيراد</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                                                    <div className="text-4xl font-bold text-green-600 mb-2">{importResults.success}</div>
                                                    <div className="text-lg text-green-700 font-semibold">نجح الاستيراد</div>
                                                </div>

                                                {importResults.errors.length > 0 && (
                                                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                                                        <div className="text-4xl font-bold text-red-600 mb-2">{importResults.errors.length}</div>
                                                        <div className="text-lg text-red-700 font-semibold">أخطاء</div>
                                                    </div>
                                                )}

                                                {importResults.warnings.length > 0 && (
                                                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                                                        <div className="text-4xl font-bold text-yellow-600 mb-2">{importResults.warnings.length}</div>
                                                        <div className="text-lg text-yellow-700 font-semibold">تحذيرات</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* عرض الأخطاء والتحذيرات */}
                                            {importResults.errors.length > 0 && (
                                                <Alert className="border-red-300 bg-red-50 rounded-2xl">
                                                    <XCircle className="h-6 w-6 text-red-600" />
                                                    <AlertDescription className="text-red-800">
                                                        <h5 className="font-bold mb-3 text-lg">الأخطاء:</h5>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {importResults.errors.map((error, index) => (
                                                                <li key={index} className="text-sm">{error}</li>
                                                            ))}
                                                        </ul>
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {importResults.warnings.length > 0 && (
                                                <Alert className="border-yellow-300 bg-yellow-50 rounded-2xl">
                                                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                                    <AlertDescription className="text-yellow-800">
                                                        <h5 className="font-bold mb-3 text-lg">التحذيرات:</h5>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {importResults.warnings.map((warning, index) => (
                                                                <li key={index} className="text-sm">{warning}</li>
                                                            ))}
                                                        </ul>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* بطاقة القواعد والملاحظات */}
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-3xl">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <AlertTriangle className="w-6 h-6" />
                            القواعد والملاحظات المهمة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8" dir="rtl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-bold text-orange-800 text-xl text-right">القواعد الأساسية:</h4>
                                <ul className="text-orange-700 space-y-3">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>يجب تحديد جميع الفلاتر قبل إدخال الدرجات</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>لا يمكن إدخال درجات أعلى من الحد المسموح للمادة</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>طالبات الدبلوم المنتسبات لا يمكن إدخال درجات لهن</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>يتم التحقق من صحة البيانات تلقائياً</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-red-800 text-xl text-right">القيود والتحذيرات:</h4>
                                <ul className="text-red-700 space-y-3">
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>لا يمكن إدخال درجات لنفس الطالبة مرتين في نفس الفترة</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>يجب أن تكون جميع الدرجات أرقام صحيحة أو عشرية</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>المنتسبات (غير الثالثة) لهن فترة ثالثة فقط</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>يتم الاحتفاظ بتاريخ جميع التعديلات للمراجعة</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                                 {/* عرض النظام حسب الفترة المختارة */}
                 {isFormEnabled && students.length > 0 && (
                     <>
                         {selectedPeriod === "الفترة الثالثة" ? (
                             <ThirdPeriodManagerFixed
                                 selectedSubject={selectedSubject ? selectedSubject.id.toString() : undefined}
                                 selectedLevel={selectedLevel}
                                 selectedMode={selectedSystem}
                             />
                         ) : (selectedLevel === "السنة الثالثة" && selectedSystem === "انتساب") ? (
                             <Card className="modern-card">
                                 <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                                     <CardTitle className="flex items-center gap-3 text-2xl">
                                         <Users className="w-6 h-6" />
                                         قائمة الطالبات - السنة الثالثة المنتسبات
                                     </CardTitle>
                                     <CardDescription className="text-lama-purple-light">
                                         {students.length} طالبة - عرض الأسماء فقط
                                     </CardDescription>
                                 </CardHeader>
                                 <CardContent className="p-8">
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
                                         {students.map((student) => (
                                             <div key={student.id} className="p-4 bg-gradient-to-br from-lama-sky-light to-lama-yellow-light rounded-xl border border-lama-sky" dir="rtl">
                                                 <div className="flex items-center gap-3">
                                                     <div className="text-right">
                                                         <h4 className="font-bold text-gray-800">{student.studentName}</h4>
                                                         <p className="text-sm text-lama-sky font-semibold">رقم الطالبة: {student.studentNumber}</p>
                                                     </div>
                                                     <div className="w-12 h-12 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-full flex items-center justify-center text-white font-bold">
                                                         {student.studentName.charAt(0)}
                                                     </div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </CardContent>
                             </Card>
                         ) : (
                             <Card className="modern-card">
                                 <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                                     <CardTitle className="flex items-center gap-3 text-2xl">
                                         <Calculator className="w-6 h-6" />
                                         إدخال درجات {selectedPeriod}
                                     </CardTitle>
                                     <CardDescription className="text-lama-purple-light">
                                         {students.length} طالب متاح لإدخال الدرجات
                                     </CardDescription>
                                 </CardHeader>
                                 <CardContent className="p-6">
                                     <Alert className="border-lama-sky bg-gradient-to-r from-lama-sky-light to-lama-yellow-light rounded-2xl mb-6">
                                         <Calculator className="h-6 w-6 text-lama-sky" />
                                         <AlertDescription className="text-lama-sky">
                                             <p className="font-semibold mb-2">جاري تطوير نظام إدخال الدرجات للفترتين الأولى والثانية</p>
                                             <p>حالياً متاح فقط نظام الفترة الثالثة المتطور. باقي الفترات قيد التطوير.</p>
                                         </AlertDescription>
                                     </Alert>

                                     <div className="text-center py-8">
                                         <div className="text-6xl mb-4">⚙️</div>
                                         <h3 className="text-2xl font-bold text-gray-800 mb-2">قيد التطوير</h3>
                                         <p className="text-gray-600">نظام إدخال درجات {selectedPeriod} سيكون متاحاً قريباً</p>
                                     </div>
                                 </CardContent>
                             </Card>
                         )}
                     </>
                 )}

                {/* رسالة عدم وجود طلاب */}
                {isFormEnabled && students.length === 0 && !isLoadingStudents && (
                    <Card className="modern-card">
                        <CardContent className="p-8 text-center">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-2xl font-bold text-lama-sky mb-2">لا يوجد طلاب</h3>
                            <p className="text-lama-yellow">لا يوجد طلاب مطابقون للمعايير المحددة</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
