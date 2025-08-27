"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, AlertCircle, User, GraduationCap, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

interface StudentData {
  fullName: string
  nationalId: string
  birthDate: string
  birthPlace: string
  nationality: string
  address: string
  studentPhone: string
  academicYear: string
  studyLevel: string
  specialization: string
  studyMode: string
  enrollmentStatus: string
  studentStatus: string
  guardianName: string
  relationship: string
  guardianPhone: string
  previousSchool: string
  previousLevel: string
  healthCondition: string
  chronicDiseases: string
  allergies: string
  specialNeeds: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactAddress: string
  notes: string
}

export default function AddStudentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [studentData, setStudentData] = useState<StudentData>({
    fullName: "",
    nationalId: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    address: "",
    studentPhone: "",
    academicYear: "",
    studyLevel: "",
    specialization: "",
    studyMode: "",
    enrollmentStatus: "",
    studentStatus: "",
    guardianName: "",
    relationship: "",
    guardianPhone: "",
    previousSchool: "",
    previousLevel: "",
    healthCondition: "",
    chronicDiseases: "",
    allergies: "",
    specialNeeds: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactAddress: "",
    notes: ""
  })

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setStudentData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return studentData.fullName && studentData.nationalId && studentData.birthDate && studentData.address
      case 2:
        return true // البيانات الأكاديمية اختيارية
      case 3:
        return true // البيانات الإضافية اختيارية
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        handleSubmit()
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setSubmitError("الرجاء تعبئة جميع الحقول المطلوبة")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setSubmitError("")
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      console.log("إرسال البيانات:", studentData)
      
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      })

      console.log("استجابة الخادم:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("خطأ من الخادم:", errorData)
        throw new Error(errorData.error || 'حدث خطأ أثناء إضافة الطالب')
      }

      const result = await response.json()
      console.log("نتيجة النجاح:", result)

      setShowSuccessDialog(true)
      setStudentData({
        fullName: "", nationalId: "", birthDate: "", birthPlace: "", nationality: "",
        address: "", studentPhone: "", academicYear: "", studyLevel: "", specialization: "",
        studyMode: "", enrollmentStatus: "", studentStatus: "", guardianName: "", relationship: "",
        guardianPhone: "", previousSchool: "", previousLevel: "", healthCondition: "",
        chronicDiseases: "", allergies: "", specialNeeds: "", emergencyContactName: "",
        emergencyContactPhone: "", emergencyContactAddress: "", notes: ""
      })
      setCurrentStep(1)

    } catch (error) {
      console.error("خطأ في الإرسال:", error)
      setSubmitError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center mb-12">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl transition-all duration-500 transform ${
              step <= currentStep ? "bg-gradient-to-br from-lamaSky to-lamaYellow scale-110" : "bg-gray-300 scale-100"
            }`}
          >
            {step <= currentStep && (
              <div className="absolute inset-0 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-2xl animate-pulse opacity-30"></div>
            )}
            <span className="relative z-10 text-lg">{step}</span>
          </div>
          {step < 3 && (
            <div
              className={`w-24 h-2 mx-2 rounded-full transition-all duration-500 ${
                step < currentStep ? "bg-gradient-to-r from-lamaSky to-lamaYellow" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderPersonalDataForm = () => (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight py-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <User className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-lamaYellow mb-2">البيانات الشخصية والاتصال</CardTitle>
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-lamaSky" />
          الرجاء تعبئة جميع الحقول المطلوبة
          <Sparkles className="w-4 h-4 text-lamaSky" />
        </p>
      </CardHeader>
      <CardContent className="p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-lamaYellow font-semibold flex items-center gap-2">
              الاسم الرباعي <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={studentData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="الاسم الكامل"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="nationalId" className="text-lamaYellow font-semibold flex items-center gap-2">
              رقم الهوية / الرقم الوطني <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nationalId"
              value={studentData.nationalId}
              onChange={(e) => handleInputChange('nationalId', e.target.value)}
              placeholder="رقم الهوية"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="birthDate" className="text-lamaYellow font-semibold flex items-center gap-2">
              تاريخ الميلاد <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={studentData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="birthPlace" className="text-lamaYellow font-semibold flex items-center gap-2">
              مكان الميلاد <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthPlace"
              value={studentData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              placeholder="مكان الميلاد"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="nationality" className="text-lamaYellow font-semibold flex items-center gap-2">
              الجنسية <span className="text-red-500">*</span>
            </Label>
            <Select value={studentData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر الجنسية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saudi">سعودي</SelectItem>
                <SelectItem value="egyptian">مصري</SelectItem>
                <SelectItem value="jordanian">أردني</SelectItem>
                <SelectItem value="syrian">سوري</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="studentPhone" className="text-lamaYellow font-semibold flex items-center gap-2">
              رقم هاتف الطالب <span className="text-red-500">*</span>
            </Label>
            <Input
              id="studentPhone"
              value={studentData.studentPhone}
              onChange={(e) => handleInputChange('studentPhone', e.target.value)}
              placeholder="رقم الهاتف"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="address" className="text-lamaYellow font-semibold flex items-center gap-2">
            العنوان <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            value={studentData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="العنوان الكامل"
            className="min-h-[100px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderAcademicDataForm = () => (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight py-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-lamaYellow mb-2">بيانات التسجيل الأكاديمي</CardTitle>
        <p className="text-gray-600">معلومات الدراسة والتخصص</p>
      </CardHeader>
      <CardContent className="p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="academicYear" className="text-lamaYellow font-semibold">
              العام الدراسي
            </Label>
            <Input
              id="academicYear"
              value={studentData.academicYear}
              onChange={(e) => handleInputChange('academicYear', e.target.value)}
              placeholder="2024-2025"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="studyLevel" className="text-lamaYellow font-semibold">
              المرحلة الدراسية
            </Label>
            <Select value={studentData.studyLevel} onValueChange={(value) => handleInputChange('studyLevel', value)}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر المرحلة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST_YEAR">السنة الأولى</SelectItem>
                <SelectItem value="SECOND_YEAR">السنة الثانية</SelectItem>
                <SelectItem value="THIRD_YEAR">السنة الثالثة</SelectItem>
                <SelectItem value="GRADUATION">سنة التخرج</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="specialization" className="text-lamaYellow font-semibold">
              الشعبة التخصصية
            </Label>
            <Input
              id="specialization"
              value={studentData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              placeholder="التخصص"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="studyMode" className="text-lamaYellow font-semibold">
              النظام الدراسي
            </Label>
            <Select value={studentData.studyMode} onValueChange={(value) => handleInputChange('studyMode', value)}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر النظام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULAR">نظامي</SelectItem>
                <SelectItem value="DISTANCE">انتساب</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="enrollmentStatus" className="text-lamaYellow font-semibold">
              صفة القيد
            </Label>
            <Select value={studentData.enrollmentStatus} onValueChange={(value) => handleInputChange('enrollmentStatus', value)}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر صفة القيد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">مستجد</SelectItem>
                <SelectItem value="REPEATER">معيد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="studentStatus" className="text-lamaYellow font-semibold">
              حالة الطالب
            </Label>
            <Select value={studentData.studentStatus} onValueChange={(value) => handleInputChange('studentStatus', value)}>
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">مستمر</SelectItem>
                <SelectItem value="DROPPED">منقطع</SelectItem>
                <SelectItem value="SUSPENDED">موقوف</SelectItem>
                <SelectItem value="EXPELLED">مطرود</SelectItem>
                <SelectItem value="PAUSED">إيقاف قيد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderAdditionalDataForm = () => (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight py-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-lamaYellow mb-2">بيانات إضافية</CardTitle>
        <p className="text-gray-600">معلومات تكميلية اختيارية</p>
      </CardHeader>
      <CardContent className="p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="guardianName" className="text-lamaYellow font-semibold">
              اسم ولي الأمر
            </Label>
            <Input
              id="guardianName"
              value={studentData.guardianName}
              onChange={(e) => handleInputChange('guardianName', e.target.value)}
              placeholder="اسم ولي الأمر"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="relationship" className="text-lamaYellow font-semibold">
              صلة القرابة
            </Label>
            <Input
              id="relationship"
              value={studentData.relationship}
              onChange={(e) => handleInputChange('relationship', e.target.value)}
              placeholder="الأب، الأم، الأخ..."
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="guardianPhone" className="text-lamaYellow font-semibold">
              هاتف ولي الأمر
            </Label>
            <Input
              id="guardianPhone"
              value={studentData.guardianPhone}
              onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
              placeholder="رقم هاتف ولي الأمر"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="previousSchool" className="text-lamaYellow font-semibold">
              المدرسة السابقة
            </Label>
            <Input
              id="previousSchool"
              value={studentData.previousSchool}
              onChange={(e) => handleInputChange('previousSchool', e.target.value)}
              placeholder="اسم المدرسة السابقة"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="previousLevel" className="text-lamaYellow font-semibold">
              المستوى الأكاديمي السابق
            </Label>
            <Input
              id="previousLevel"
              value={studentData.previousLevel}
              onChange={(e) => handleInputChange('previousLevel', e.target.value)}
              placeholder="المستوى السابق"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="healthCondition" className="text-lamaYellow font-semibold">
              الحالة الصحية
            </Label>
            <Textarea
              id="healthCondition"
              value={studentData.healthCondition}
              onChange={(e) => handleInputChange('healthCondition', e.target.value)}
              placeholder="وصف الحالة الصحية"
              className="min-h-[80px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="chronicDiseases" className="text-lamaYellow font-semibold">
              الأمراض المزمنة
            </Label>
            <Textarea
              id="chronicDiseases"
              value={studentData.chronicDiseases}
              onChange={(e) => handleInputChange('chronicDiseases', e.target.value)}
              placeholder="الأمراض المزمنة إن وجدت"
              className="min-h-[80px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="allergies" className="text-lamaYellow font-semibold">
              الحساسيات
            </Label>
            <Textarea
              id="allergies"
              value={studentData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="أنواع الحساسية"
              className="min-h-[80px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="specialNeeds" className="text-lamaYellow font-semibold">
            الاحتياجات الخاصة
          </Label>
          <Textarea
            id="specialNeeds"
            value={studentData.specialNeeds}
            onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
            placeholder="الاحتياجات الخاصة إن وجدت"
            className="min-h-[80px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="emergencyContactName" className="text-lamaYellow font-semibold">
              اسم جهة الاتصال للطوارئ
            </Label>
            <Input
              id="emergencyContactName"
              value={studentData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              placeholder="اسم جهة الاتصال"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="emergencyContactPhone" className="text-lamaYellow font-semibold">
              هاتف جهة الاتصال الطوارئ
            </Label>
            <Input
              id="emergencyContactPhone"
              value={studentData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              placeholder="رقم هاتف الطوارئ"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="emergencyContactAddress" className="text-lamaYellow font-semibold">
              عنوان جهة الاتصال الطوارئ
            </Label>
            <Input
              id="emergencyContactAddress"
              value={studentData.emergencyContactAddress}
              onChange={(e) => handleInputChange('emergencyContactAddress', e.target.value)}
              placeholder="عنوان جهة الاتصال"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="notes" className="text-lamaYellow font-semibold">
            ملاحظات
          </Label>
          <Textarea
            id="notes"
            value={studentData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="ملاحظات إضافية"
            className="min-h-[100px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight via-lamaPurple to-lamaSkyLight" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky via-lamaYellow to-lamaSky text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-20 h-1 bg-white/80 mx-auto mb-3 rounded-full"></div>
            <p className="text-white/90 text-lg font-medium">إضافة طالب جديد</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-8 max-w-5xl">
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-2xl flex items-center justify-center mr-3 shadow-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-lamaYellow">إضافة طالب جديد</h2>
          </div>
          {renderStepIndicator()}
        </div>

        {currentStep === 1 && renderPersonalDataForm()}
        {currentStep === 2 && renderAcademicDataForm()}
        {currentStep === 3 && renderAdditionalDataForm()}

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-center">
            {submitError}
          </div>
        )}

        <div className="flex justify-between mt-10">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-10 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              السابق
            </Button>
          )}
          {currentStep === 1 && <div></div>}
          <div className="flex flex-col items-end">
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-10 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {currentStep === 3 ? "جاري الإضافة..." : "التالي"}
                </div>
              ) : (
                currentStep === 3 ? "إضافة الطالب" : "التالي"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="text-center rounded-3xl border-0 shadow-2xl" dir="rtl">
          <DialogHeader>
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl text-green-600 font-bold">تم بنجاح</DialogTitle>
            <DialogDescription className="text-gray-600 text-lg mt-4">
              تم إضافة الطالب بنجاح إلى النظام
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-center mt-6">
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                setSubmitError("")
              }}
              className="bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight hover:from-lamaYellowLight hover:to-lamaSkyLight text-lamaYellow border-2 border-lamaSky font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
            >
              إضافة طالب آخر
            </Button>
            <Link href="/list/students">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
                عرض الطلاب
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

