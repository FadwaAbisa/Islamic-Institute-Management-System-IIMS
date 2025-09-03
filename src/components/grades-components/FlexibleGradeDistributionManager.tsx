"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
    Settings, 
    Calculator, 
    Save, 
    Plus, 
    Trash2, 
    Edit,
    CheckCircle2,
    AlertTriangle,
    Info
} from "lucide-react"
import {
    FlexibleGradeDistribution,
    defaultGradeDistributions,
    getFlexibleGradeDistribution,
    calculateMonthlyAverage,
    calculatePeriodTotal,
    calculateFinalTotal,
    validateFlexibleGrade,
    getPeriodInfo,
    convertDbToFlexibleDistribution,
    convertFlexibleToDbFormat
} from "@/lib/flexible-grade-distributions"

interface FlexibleGradeDistributionManagerProps {
    selectedEducationLevel: string
    selectedStudySystem: string
    onDistributionChange?: (distribution: FlexibleGradeDistribution | null) => void
    onDistributionSaved?: (distribution: FlexibleGradeDistribution) => void
}

export default function FlexibleGradeDistributionManager({
    selectedEducationLevel,
    selectedStudySystem,
    onDistributionChange,
    onDistributionSaved
}: FlexibleGradeDistributionManagerProps) {
    const [distributions, setDistributions] = useState<FlexibleGradeDistribution[]>(defaultGradeDistributions)
    const [currentDistribution, setCurrentDistribution] = useState<FlexibleGradeDistribution | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingDistribution, setEditingDistribution] = useState<FlexibleGradeDistribution | null>(null)
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    // تحديث التوزيع الحالي عند تغيير المعايير
    useEffect(() => {
        const loadDistribution = async () => {
            try {
                // محاولة تحميل من قاعدة البيانات أولاً
                const response = await fetch(
                    `/api/flexible-grade-distributions?educationLevel=${encodeURIComponent(selectedEducationLevel)}&studySystem=${encodeURIComponent(selectedStudySystem)}`
                )
                
                if (response.ok) {
                    const dbData = await response.json()
                    if (dbData) {
                        const distribution = convertDbToFlexibleDistribution(dbData)
                        setCurrentDistribution(distribution)
                        onDistributionChange?.(distribution)
                        return
                    }
                }
                
                // إذا لم توجد في قاعدة البيانات، استخدم التوزيع الافتراضي
                const defaultDistribution = getFlexibleGradeDistribution(selectedEducationLevel, selectedStudySystem)
                setCurrentDistribution(defaultDistribution)
                onDistributionChange?.(defaultDistribution)
            } catch (error) {
                console.error('خطأ في تحميل التوزيع:', error)
                // في حالة الخطأ، استخدم التوزيع الافتراضي
                const defaultDistribution = getFlexibleGradeDistribution(selectedEducationLevel, selectedStudySystem)
                setCurrentDistribution(defaultDistribution)
                onDistributionChange?.(defaultDistribution)
            }
        }

        if (selectedEducationLevel && selectedStudySystem) {
            loadDistribution()
        }
    }, [selectedEducationLevel, selectedStudySystem])

    const handleEditDistribution = () => {
        if (currentDistribution) {
            setEditingDistribution({ ...currentDistribution })
            setIsEditing(true)
        }
    }

    const handleSaveDistribution = async () => {
        if (!editingDistribution) return

        const errors: string[] = []

        // التحقق من صحة البيانات
        Object.entries(editingDistribution.periods).forEach(([periodKey, period]) => {
            if (period.monthsCount > 0) {
                if (period.monthlyGrade <= 0) {
                    errors.push(`درجة الشهر في ${periodKey} يجب أن تكون أكبر من صفر`)
                }
                if (period.periodExam <= 0) {
                    errors.push(`درجة الامتحان في ${periodKey} يجب أن تكون أكبر من صفر`)
                }
            }
        })

        if (errors.length > 0) {
            setValidationErrors(errors)
            return
        }

        try {
            // تحويل البيانات إلى تنسيق قاعدة البيانات
            const dbData = convertFlexibleToDbFormat(editingDistribution)
            
            // محاولة التحديث أولاً
            let response = await fetch(
                `/api/flexible-grade-distributions?educationLevel=${encodeURIComponent(editingDistribution.educationLevel)}&studySystem=${encodeURIComponent(editingDistribution.studySystem)}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dbData)
                }
            )

            // إذا فشل التحديث، جرب الإنشاء
            if (!response.ok) {
                response = await fetch('/api/flexible-grade-distributions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dbData)
                })
            }

            if (response.ok) {
                const savedData = await response.json()
                const savedDistribution = convertDbToFlexibleDistribution(savedData)
                
                // تحديث الحالة المحلية
                setDistributions(prev => 
                    prev.map(dist => 
                        dist.id === editingDistribution.id ? savedDistribution : dist
                    )
                )
                setCurrentDistribution(savedDistribution)
                setIsEditing(false)
                setEditingDistribution(null)
                setValidationErrors([])
                
                // إشعار المكون الأب بالتغيير
                onDistributionSaved?.(savedDistribution)
            } else {
                const errorData = await response.json()
                setValidationErrors([errorData.error || 'فشل في حفظ التوزيع'])
            }
        } catch (error) {
            console.error('خطأ في حفظ التوزيع:', error)
            setValidationErrors(['حدث خطأ أثناء حفظ التوزيع'])
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditingDistribution(null)
        setValidationErrors([])
    }

    const handleDistributionChange = (field: string, value: any) => {
        if (!editingDistribution) return

        const newDistribution = { ...editingDistribution }
        const keys = field.split('.')
        
        if (keys.length === 2) {
            (newDistribution as any)[keys[0]][keys[1]] = value
        } else if (keys.length === 3) {
            (newDistribution as any)[keys[0]][keys[1]][keys[2]] = value
            
            // إذا تم تغيير درجة امتحان الفترة الثالثة، حدث الدرجة الكلية تلقائياً
            if (keys[0] === 'periods' && keys[1] === 'thirdPeriod' && keys[2] === 'periodExam') {
                (newDistribution as any)[keys[0]][keys[1]]['totalGrade'] = value
            }
        }

        setEditingDistribution(newDistribution)
    }

    const renderPeriodConfig = (
        periodKey: 'firstPeriod' | 'secondPeriod' | 'thirdPeriod',
        periodName: string
    ) => {
        const period = editingDistribution?.periods[periodKey]
        if (!period) return null

        // إخفاء الفترة الثالثة للسنة الثالثة
        if (periodKey === 'thirdPeriod' && selectedEducationLevel === "السنة الثالثة") {
            return null
        }

        return (
                         <Card key={periodKey} className="border-2 border-lama-sky-light">
                 <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow">
                     <CardTitle className="text-lg text-white">{periodName}</CardTitle>
                 </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {periodKey !== 'thirdPeriod' && (
                            <div>
                                <Label className="text-sm font-semibold text-lama-yellow">عدد الأشهر</Label>
                                <Select
                                    value={period.monthsCount.toString()}
                                    onValueChange={(value) => handleDistributionChange(`periods.${periodKey}.monthsCount`, parseInt(value))}
                                >
                                    <SelectTrigger className="modern-input">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">لا توجد</SelectItem>
                                        <SelectItem value="2">شهران</SelectItem>
                                        <SelectItem value="3">ثلاثة أشهر</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        


                        {period.monthsCount > 0 && (
                            <div>
                                <Label className="text-sm font-semibold text-lama-yellow">درجة كل شهر</Label>
                                <Input
                                    type="number"
                                    value={period.monthlyGrade}
                                    onChange={(e) => handleDistributionChange(`periods.${periodKey}.monthlyGrade`, parseFloat(e.target.value) || 0)}
                                    className="modern-input"
                                    min="0"
                                    step="0.5"
                                />
                            </div>
                        )}

                        <div>
                            <Label className="text-sm font-semibold text-lama-yellow">درجة الامتحان</Label>
                            <Input
                                type="number"
                                value={period.periodExam}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0
                                    handleDistributionChange(`periods.${periodKey}.periodExam`, value)
                                    // للفترة الثالثة، حدث الدرجة الكلية تلقائياً
                                    if (periodKey === 'thirdPeriod') {
                                        handleDistributionChange(`periods.${periodKey}.totalGrade`, value)
                                    }
                                }}
                                className="modern-input"
                                min="0"
                                step="0.5"
                            />
                        </div>

                        {periodKey === 'thirdPeriod' && period.monthsCount > 0 && (
                            <div>
                                <Label className="text-sm font-semibold text-lama-yellow">الدرجة الكلية</Label>
                                <Input
                                    type="number"
                                    value={(period as any).totalGrade || 0}
                                    onChange={(e) => handleDistributionChange(`periods.${periodKey}.totalGrade`, parseFloat(e.target.value) || 0)}
                                    className="modern-input"
                                    min="0"
                                    step="0.5"
                                />
                            </div>
                        )}
                    </div>

                                         {period.monthsCount > 0 && (
                         <div className="bg-gradient-to-r from-lama-sky-light to-lama-yellow-light p-3 rounded-lg">
                             <div className="text-sm text-lama-sky font-semibold">
                                 المجموع المتوقع: {period.monthlyGrade * period.monthsCount + period.periodExam}
                             </div>
                         </div>
                     )}
                </CardContent>
            </Card>
        )
    }

    const renderFinalCalculation = () => {
        if (!editingDistribution) return null

        return (
                         <Card className="border-2 border-lama-sky-light">
                 <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow">
                     <CardTitle className="text-lg text-white">الحساب النهائي</CardTitle>
                 </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                                                         <Label className="text-sm font-semibold text-lama-yellow">وزن الفترتين الأولى والثانية</Label>
                            <Input
                                type="number"
                                value={editingDistribution.finalCalculation.firstAndSecondWeight}
                                onChange={(e) => handleDistributionChange('finalCalculation.firstAndSecondWeight', parseFloat(e.target.value) || 0)}
                                className="modern-input"
                                min="0"
                                max="1"
                                step="0.1"
                            />
                        </div>

                        <div>
                                                         <Label className="text-sm font-semibold text-lama-yellow">وزن الفترة الثالثة</Label>
                            <Input
                                type="number"
                                value={editingDistribution.finalCalculation.thirdPeriodWeight}
                                onChange={(e) => handleDistributionChange('finalCalculation.thirdPeriodWeight', parseFloat(e.target.value) || 0)}
                                className="modern-input"
                                min="0"
                                max="1"
                                step="0.1"
                            />
                        </div>

                        <div>
                                                         <Label className="text-sm font-semibold text-lama-yellow">المجموع الكلي</Label>
                            <Input
                                type="number"
                                value={editingDistribution.finalCalculation.totalGrade}
                                onChange={(e) => handleDistributionChange('finalCalculation.totalGrade', parseFloat(e.target.value) || 0)}
                                className="modern-input"
                                min="0"
                                step="0.5"
                            />
                        </div>
                    </div>

                                         <Alert className="border-lama-sky bg-gradient-to-r from-lama-sky-light to-lama-yellow-light">
                         <Info className="h-4 w-4 text-lama-sky" />
                         <AlertDescription className="text-lama-sky">
                             مجموع الأوزان يجب أن يساوي 1.0 (100%)
                         </AlertDescription>
                     </Alert>
                </CardContent>
            </Card>
        )
    }

    if (!currentDistribution) {
        return (
            <Card className="modern-card">
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">لا يوجد توزيع متاح</h3>
                    <p className="text-gray-500">اختر المرحلة التعليمية ونظام الدراسة لعرض توزيع الدرجات</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* عرض التوزيع الحالي */}
            {!isEditing && (
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <Calculator className="w-6 h-6" />
                                    توزيع الدرجات - {currentDistribution.name}
                                </CardTitle>
                                <CardDescription className="text-lama-purple-light mt-2">
                                    التوزيع الحالي للمرحلة: {selectedEducationLevel} - {selectedStudySystem}
                                </CardDescription>
                            </div>
                            <Button
                                onClick={handleEditDistribution}
                                className="bg-white text-lama-yellow hover:bg-lama-purple-light"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                تعديل التوزيع
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(currentDistribution.periods).map(([periodKey, period]) => {
                                const periodNames = {
                                    firstPeriod: "الفترة الأولى",
                                    secondPeriod: "الفترة الثانية", 
                                    thirdPeriod: "الفترة الثالثة"
                                }
                                
                                // إخفاء الفترة الثالثة للسنة الثالثة
                                if (periodKey === 'thirdPeriod' && selectedEducationLevel === "السنة الثالثة") {
                                    return null
                                }
                                
                                return (
                                    <div key={periodKey} className="bg-gradient-to-br from-lama-sky-light to-lama-yellow-light p-4 rounded-xl">
                                        <h4 className="font-bold text-lama-sky mb-3">{periodNames[periodKey as keyof typeof periodNames]}</h4>
                                        
                                        {period.monthsCount > 0 || periodKey === 'thirdPeriod' ? (
                                            <div className="space-y-2">
                                                {period.monthsCount > 0 && (
                                                    <>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-600">عدد الأشهر:</span>
                                                            <Badge variant="secondary">{period.monthsCount}</Badge>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-600">درجة الشهر:</span>
                                                            <Badge variant="outline">{period.monthlyGrade}</Badge>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">درجة الامتحان:</span>
                                                    <Badge variant="outline">{period.periodExam}</Badge>
                                                </div>
                                                {periodKey === 'thirdPeriod' && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">الدرجة الكلية:</span>
                                                        <Badge variant="outline">{(period as any).totalGrade || 0}</Badge>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <p className="text-sm">لا توجد فترات متاحة</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <Separator className="my-6" />

                                                 <div className="bg-gradient-to-r from-lama-sky-light to-lama-yellow-light p-4 rounded-xl">
                             <h4 className="font-bold text-lama-sky mb-3">الحساب النهائي</h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div className="text-center">
                                     <div className="text-2xl font-bold text-lama-sky">
                                         {currentDistribution.finalCalculation.firstAndSecondWeight * 100}%
                                     </div>
                                     <div className="text-sm text-lama-yellow">وزن الفترتين الأولى والثانية</div>
                                 </div>
                                 <div className="text-center">
                                     <div className="text-2xl font-bold text-lama-sky">
                                         {currentDistribution.finalCalculation.thirdPeriodWeight * 100}%
                                     </div>
                                     <div className="text-sm text-lama-yellow">وزن الفترة الثالثة</div>
                                 </div>
                                 <div className="text-center">
                                     <div className="text-2xl font-bold text-lama-sky">
                                         {currentDistribution.finalCalculation.totalGrade}
                                     </div>
                                     <div className="text-sm text-lama-yellow">المجموع الكلي</div>
                                 </div>
                             </div>
                         </div>
                    </CardContent>
                </Card>
            )}

            {/* تعديل التوزيع */}
            {isEditing && editingDistribution && (
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <Settings className="w-6 h-6" />
                                    تعديل توزيع الدرجات
                                </CardTitle>
                                <CardDescription className="text-orange-100 mt-2">
                                    قم بتعديل توزيع الدرجات حسب احتياجاتك
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSaveDistribution}
                                    className="bg-white text-orange-600 hover:bg-orange-100"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    حفظ التعديلات
                                </Button>
                                <Button
                                    onClick={handleCancelEdit}
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-orange-600"
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {/* عرض الأخطاء */}
                        {validationErrors.length > 0 && (
                            <Alert className="border-red-300 bg-red-50">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <div className="font-semibold mb-2">يرجى تصحيح الأخطاء التالية:</div>
                                    <ul className="list-disc list-inside space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="text-sm">{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* إعدادات الفترات */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-lama-sky">إعدادات الفترات</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {renderPeriodConfig('firstPeriod', 'الفترة الأولى')}
                                {renderPeriodConfig('secondPeriod', 'الفترة الثانية')}
                                {renderPeriodConfig('thirdPeriod', 'الفترة الثالثة')}
                            </div>
                        </div>

                        <Separator />

                        {/* الحساب النهائي */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-green-700">الحساب النهائي</h3>
                            {renderFinalCalculation()}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
