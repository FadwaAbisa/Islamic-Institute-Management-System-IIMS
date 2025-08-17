"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, AlertCircle, User, GraduationCap, FileText, Upload, Sparkles } from "lucide-react"
import Link from "next/link"

interface PersonalData {
  fullName: string
  nationalId: string
  gender: string
  birthDate: string
  birthPlace: string
  nationality: string
  address: string
  phoneNumber: string
}

interface AcademicData {
  academicYear: string
  academicLevel: string
  branch: string
  studySystem: string
  enrollmentStatus: string
  studentStatus: string
}

interface AdditionalData {
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

interface DocumentData {
  studentPhoto: File | null
  nationalIdCopy: File | null
  birthCertificate: File | null
  educationForm: File | null
  equivalencyDocument: File | null
  otherDocuments: File[]
}

export default function AddStudentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showValidationDialog, setShowValidationDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const [personalData, setPersonalData] = useState<PersonalData>({
    fullName: "",
    nationalId: "",
    gender: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    address: "",
    phoneNumber: "",
  })

  const [academicData, setAcademicData] = useState<AcademicData>({
    academicYear: "",
    academicLevel: "",
    branch: "",
    studySystem: "",
    enrollmentStatus: "",
    studentStatus: "",
  })

  const [additionalData, setAdditionalData] = useState<AdditionalData>({
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
    notes: "",
  })

  const [documentData, setDocumentData] = useState<DocumentData>({
    studentPhoto: null,
    nationalIdCopy: null,
    birthCertificate: null,
    educationForm: null,
    equivalencyDocument: null,
    otherDocuments: [],
  })

  const validatePersonalData = () => {
    return Object.values(personalData).every((value) => value.trim() !== "")
  }

  const validateAcademicData = () => {
    // جعل البيانات الأكاديمية غير إجبارية
    return true
  }

  const validateAdditionalData = () => {
    // جعل البيانات الإضافية غير إجبارية
    return true
  }

  const validateDocuments = () => {
    // جعل المستندات غير إجبارية
    return true
  }

  const handleNext = () => {
    let isValid = false

    switch (currentStep) {
      case 1:
        isValid = validatePersonalData()
        break
      case 2:
        isValid = validateAcademicData()
        break
      case 3:
        isValid = validateAdditionalData()
        break
      case 4:
        isValid = validateDocuments()
        break
    }

    if (isValid) {
      if (currentStep === 4) {
        setShowSuccessDialog(true)
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setShowValidationDialog(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileChange = (field: keyof DocumentData, file: File | null) => {
    setDocumentData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center mb-12">
      {[1, 2, 3, 4].map((step) => (
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
          {step < 4 && (
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
              value={personalData.fullName}
              onChange={(e) => setPersonalData((prev) => ({ ...prev, fullName: e.target.value }))}
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
              value={personalData.nationalId}
              onChange={(e) => setPersonalData((prev) => ({ ...prev, nationalId: e.target.value }))}
              placeholder="رقم الهوية"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="gender" className="text-lamaYellow font-semibold flex items-center gap-2">
              الجنس <span className="text-red-500">*</span>
            </Label>
            <Select
              value={personalData.gender}
              onValueChange={(value) => setPersonalData((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ذكر</SelectItem>
                <SelectItem value="female">أنثى</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="birthDate" className="text-lamaYellow font-semibold flex items-center gap-2">
              تاريخ الميلاد <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={personalData.birthDate}
              onChange={(e) => setPersonalData((prev) => ({ ...prev, birthDate: e.target.value }))}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="birthPlace" className="text-lamaYellow font-semibold flex items-center gap-2">
              مكان الميلاد <span className="text-red-500">*</span>
            </Label>
            <Select
              value={personalData.birthPlace}
              onValueChange={(value) => setPersonalData((prev) => ({ ...prev, birthPlace: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر مكان الميلاد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="riyadh">الرياض</SelectItem>
                <SelectItem value="jeddah">جدة</SelectItem>
                <SelectItem value="mecca">مكة المكرمة</SelectItem>
                <SelectItem value="medina">المدينة المنورة</SelectItem>
                <SelectItem value="dammam">الدمام</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="nationality" className="text-lamaYellow font-semibold flex items-center gap-2">
              الجنسية <span className="text-red-500">*</span>
            </Label>
            <Select
              value={personalData.nationality}
              onValueChange={(value) => setPersonalData((prev) => ({ ...prev, nationality: value }))}
            >
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
        </div>

        <div className="space-y-3">
          <Label htmlFor="address" className="text-lamaYellow font-semibold flex items-center gap-2">
            العنوان <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            value={personalData.address}
            onChange={(e) => setPersonalData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="العنوان الكامل"
            className="min-h-[100px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="phoneNumber" className="text-lamaYellow font-semibold flex items-center gap-2">
            رقم هاتف الطالب <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            value={personalData.phoneNumber}
            onChange={(e) => setPersonalData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="رقم الهاتف"
            className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
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
              value={academicData.academicYear}
              onChange={(e) => setAcademicData((prev) => ({ ...prev, academicYear: e.target.value }))}
              placeholder="2024-2025"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="academicLevel" className="text-lamaYellow font-semibold">
              المرحلة الدراسية
            </Label>
            <Select
              value={academicData.academicLevel}
              onValueChange={(value) => setAcademicData((prev) => ({ ...prev, academicLevel: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر المرحلة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">السنة الأولى</SelectItem>
                <SelectItem value="second">السنة الثانية</SelectItem>
                <SelectItem value="third">السنة الثالثة</SelectItem>
                <SelectItem value="fourth">السنة الرابعة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="branch" className="text-lamaYellow font-semibold">
              الشعبة التخصصية
            </Label>
            <Select
              value={academicData.branch}
              onValueChange={(value) => setAcademicData((prev) => ({ ...prev, branch: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر الشعبة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="islamic-studies">الدراسات الإسلامية</SelectItem>
                <SelectItem value="readings">القراءات</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="studySystem" className="text-lamaYellow font-semibold">
              النظام الدراسي
            </Label>
            <Select
              value={academicData.studySystem}
              onValueChange={(value) => setAcademicData((prev) => ({ ...prev, studySystem: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر النظام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">نظامي</SelectItem>
                <SelectItem value="correspondence">انتساب</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="enrollmentStatus" className="text-lamaYellow font-semibold">
              صفة القيد
            </Label>
            <Select
              value={academicData.enrollmentStatus}
              onValueChange={(value) => setAcademicData((prev) => ({ ...prev, enrollmentStatus: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر صفة القيد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">مستجد</SelectItem>
                <SelectItem value="repeat">معيد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="studentStatus" className="text-lamaYellow font-semibold">
              حالة الطالب
            </Label>
            <Select
              value={academicData.studentStatus}
              onValueChange={(value) => setAcademicData((prev) => ({ ...prev, studentStatus: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="continuing">مستمر</SelectItem>
                <SelectItem value="dropped">منقطع</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
                <SelectItem value="expelled">مطرود</SelectItem>
                <SelectItem value="enrollment-suspended">إيقاف قيد</SelectItem>
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
              value={additionalData.guardianName}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, guardianName: e.target.value }))}
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
              value={additionalData.relationship}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, relationship: e.target.value }))}
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
              value={additionalData.guardianPhone}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, guardianPhone: e.target.value }))}
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
              value={additionalData.previousSchool}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, previousSchool: e.target.value }))}
              placeholder="اسم المدرسة السابقة"
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="previousLevel" className="text-lamaYellow font-semibold">
              المستوى الأكاديمي السابق
            </Label>
            <Select
              value={additionalData.previousLevel}
              onValueChange={(value) => setAdditionalData((prev) => ({ ...prev, previousLevel: value }))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80">
                <SelectValue placeholder="اختر المستوى السابق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">الثانوية العامة</SelectItem>
                <SelectItem value="diploma">دبلوم</SelectItem>
                <SelectItem value="bachelor">بكالوريوس</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="healthCondition" className="text-lamaYellow font-semibold">
              الحالة الصحية
            </Label>
            <Textarea
              id="healthCondition"
              value={additionalData.healthCondition}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, healthCondition: e.target.value }))}
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
              value={additionalData.chronicDiseases}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, chronicDiseases: e.target.value }))}
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
              value={additionalData.allergies}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, allergies: e.target.value }))}
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
            value={additionalData.specialNeeds}
            onChange={(e) => setAdditionalData((prev) => ({ ...prev, specialNeeds: e.target.value }))}
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
              value={additionalData.emergencyContactName}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, emergencyContactName: e.target.value }))}
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
              value={additionalData.emergencyContactPhone}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))}
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
              value={additionalData.emergencyContactAddress}
              onChange={(e) => setAdditionalData((prev) => ({ ...prev, emergencyContactAddress: e.target.value }))}
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
            value={additionalData.notes}
            onChange={(e) => setAdditionalData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="ملاحظات إضافية"
            className="min-h-[100px] rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderDocumentUploadForm = () => (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight py-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <Upload className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-lamaYellow mb-2">رفع المستندات</CardTitle>
        <p className="text-gray-600">المستندات المطلوبة (اختيارية)</p>
      </CardHeader>
      <CardContent className="p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="studentPhoto" className="text-lamaYellow font-semibold">
              صورة الطالب الشخصية (JPG/PNG)
            </Label>
            <Input
              id="studentPhoto"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleFileChange("studentPhoto", e.target.files?.[0] || null)}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lamaSkyLight file:text-lamaYellow hover:file:bg-lamaSky hover:file:text-white"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="nationalIdCopy" className="text-lamaYellow font-semibold">
              صورة الهوية / الرقم الوطني (JPG/PNG)
            </Label>
            <Input
              id="nationalIdCopy"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleFileChange("nationalIdCopy", e.target.files?.[0] || null)}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lamaSkyLight file:text-lamaYellow hover:file:bg-lamaSky hover:file:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="birthCertificate" className="text-lamaYellow font-semibold">
              شهادة الميلاد
            </Label>
            <Input
              id="birthCertificate"
              type="file"
              accept=".pdf,image/jpeg,image/png"
              onChange={(e) => handleFileChange("birthCertificate", e.target.files?.[0] || null)}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lamaSkyLight file:text-lamaYellow hover:file:bg-lamaSky hover:file:text-white"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="educationForm" className="text-lamaYellow font-semibold">
              استمارة التعليم
            </Label>
            <Input
              id="educationForm"
              type="file"
              accept=".pdf,image/jpeg,image/png"
              onChange={(e) => handleFileChange("educationForm", e.target.files?.[0] || null)}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lamaSkyLight file:text-lamaYellow hover:file:bg-lamaSky hover:file:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="equivalencyDocument" className="text-lamaYellow font-semibold">
              وثيقة المعادلة (JPG/PNG)
            </Label>
            <Input
              id="equivalencyDocument"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleFileChange("equivalencyDocument", e.target.files?.[0] || null)}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lamaSkyLight file:text-lamaYellow hover:file:bg-lamaSky hover:file:text-white"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="otherDocuments" className="text-lamaYellow font-semibold">
              مستندات أخرى (متعدد)
            </Label>
            <Input
              id="otherDocuments"
              type="file"
              multiple
              accept=".pdf,image/jpeg,image/png"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setDocumentData((prev) => ({ ...prev, otherDocuments: files }))
              }}
              className="h-12 rounded-xl border-2 border-lamaSkyLight focus:border-lamaSky transition-all duration-300 bg-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lamaSkyLight file:text-lamaYellow hover:file:bg-lamaSky hover:file:text-white"
            />
          </div>
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
        {currentStep === 4 && renderDocumentUploadForm()}

        <div className="flex justify-between mt-10">
          {currentStep > 1 && (
            <Button
              onClick={handlePrevious}
              className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-10 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              السابق
            </Button>
          )}
          {currentStep === 1 && <div></div>}
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-10 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {currentStep === 4 ? "إضافة الطالب" : "التالي"}
          </Button>
        </div>
      </div>

      {/* Validation Dialog */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent className="text-center rounded-3xl border-0 shadow-2xl" dir="rtl">
          <DialogHeader>
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <DialogTitle className="text-2xl text-red-600 font-bold">حقول مطلوبة</DialogTitle>
            <DialogDescription className="text-gray-600 text-lg mt-4">
              الرجاء تعبئة جميع الحقول المطلوبة في البيانات الشخصية قبل المتابعة
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowValidationDialog(false)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg mt-6 transition-all duration-300"
          >
            حسناً
          </Button>
        </DialogContent>
      </Dialog>

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
            <Link href="/add-student">
              <Button className="bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight hover:from-lamaYellowLight hover:to-lamaSkyLight text-lamaYellow border-2 border-lamaSky font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
                إضافة طالب آخر
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
