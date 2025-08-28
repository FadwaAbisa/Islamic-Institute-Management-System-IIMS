"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GraduationCap, ChevronRight, ChevronLeft, CheckCircle, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddStaffPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // البيانات الأساسية والبيانات الشخصية
  const [basicData, setBasicData] = useState({
    fullName: "",
    nationalId: "",
    birthday: "",
    maritalStatus: "",
    address: "",
    phone1: "",
  })

  // البيانات الوظيفية والمؤهلات العلمية
  const [employmentData, setEmploymentData] = useState({
    appointmentDate: "",
    serviceStartDate: "",
    academicQualification: "",
    educationalInstitution: "",
    majorSpecialization: "",
    graduationYear: "",
  })

  const updateBasicData = (key: keyof typeof basicData, value: string) => {
    setBasicData((prev) => ({ ...prev, [key]: value }))
  }

  const updateEmploymentData = (key: keyof typeof employmentData, value: string) => {
    setEmploymentData((prev) => ({ ...prev, [key]: value }))
  }

  const validateBasicData = () => {
    return basicData.fullName && basicData.nationalId && basicData.birthday && basicData.phone1
  }

  const validateEmploymentData = () => {
    return true // البيانات الوظيفية اختيارية
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateBasicData()) {
      setError("يرجى ملء جميع الحقول المطلوبة")
      return
    }
    if (currentStep === 2 && !validateEmploymentData()) {
      setError("يرجى ملء جميع الحقول المطلوبة")
      return
    }
    setError("")
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateBasicData()) {
      setError("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    // التحقق من صحة التاريخ
    if (basicData.birthday && isNaN(new Date(basicData.birthday).getTime())) {
      setError("تاريخ الميلاد غير صحيح")
      return
    }

    if (employmentData.appointmentDate && isNaN(new Date(employmentData.appointmentDate).getTime())) {
      setError("تاريخ التعيين غير صحيح")
      return
    }

    if (employmentData.serviceStartDate && isNaN(new Date(employmentData.serviceStartDate).getTime())) {
      setError("تاريخ بدء الخدمة غير صحيح")
      return
    }

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      // تنظيف وتنسيق البيانات
      const staffData = {
        fullName: basicData.fullName.trim(),
        nationalId: basicData.nationalId.trim(),
        birthday: basicData.birthday,
        maritalStatus: basicData.maritalStatus || null,
        address: basicData.address?.trim() || null,
        phone1: basicData.phone1.trim(),
        appointmentDate: employmentData.appointmentDate || null,
        serviceStartDate: employmentData.serviceStartDate || null,
        academicQualification: employmentData.academicQualification?.trim() || null,
        educationalInstitution: employmentData.educationalInstitution?.trim() || null,
        majorSpecialization: employmentData.majorSpecialization?.trim() || null,
        graduationYear: employmentData.graduationYear?.trim() || null,
      }

      console.log("بيانات الموظف المرسلة:", staffData)

      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffData),
      })

      console.log("استجابة الخادم - Status:", res.status)
      console.log("استجابة الخادم - Headers:", res.headers)

      const data = await res.json()
      console.log("استجابة الخادم - Data:", data)

      if (!res.ok) {
        throw new Error(data.error || "فشل إضافة الموظف الإداري")
      }

      setSuccess("تم إضافة الموظف الإداري بنجاح")

      // إعادة تعيين النموذج
      setBasicData({
        fullName: "",
        nationalId: "",
        birthday: "",
        maritalStatus: "",
        address: "",
        phone1: "",
      })
      setEmploymentData({
        appointmentDate: "",
        serviceStartDate: "",
        academicQualification: "",
        educationalInstitution: "",
        majorSpecialization: "",
        graduationYear: "",
      })
      setCurrentStep(1)

      // إعادة التوجيه بعد ثانيتين
      setTimeout(() => {
        router.push('/list/staff')
      }, 2000)
    } catch (e: any) {
      console.error("خطأ في إضافة الموظف:", e)
      setError(e?.message || "خطأ غير متوقع")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= step
              ? "bg-lamaYellow text-white"
              : "bg-gray-200 text-gray-500"
              }`}
          >
            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${currentStep > step ? "bg-lamaYellow" : "bg-gray-200"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderBasicDataStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-lamaYellow mb-6 text-center">
        البيانات الأساسية والبيانات الشخصية
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">الاسم الكامل *</Label>
          <Input
            value={basicData.fullName}
            onChange={(e) => updateBasicData("fullName", e.target.value)}
            placeholder="الاسم الكامل"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">رقم الهوية / الرقم الوطني *</Label>
          <Input
            value={basicData.nationalId}
            onChange={(e) => updateBasicData("nationalId", e.target.value)}
            placeholder="رقم الهوية"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">تاريخ الميلاد *</Label>
          <Input
            type="date"
            value={basicData.birthday}
            onChange={(e) => updateBasicData("birthday", e.target.value)}
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">الحالة الاجتماعية</Label>
          <Select value={basicData.maritalStatus} onValueChange={(value) => updateBasicData("maritalStatus", value)}>
            <SelectTrigger className="border-lamaYellow/20 focus:border-lamaYellow">
              <SelectValue placeholder="اختر الحالة الاجتماعية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE">أعزب/عزباء</SelectItem>
              <SelectItem value="MARRIED">متزوج/ة</SelectItem>
              <SelectItem value="DIVORCED">مطلق/ة</SelectItem>
              <SelectItem value="WIDOWED">أرمل/ة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">هاتف أول *</Label>
          <Input
            value={basicData.phone1}
            onChange={(e) => updateBasicData("phone1", e.target.value)}
            placeholder="رقم الهاتف الأول"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">عنوان السكن</Label>
          <Input
            value={basicData.address}
            onChange={(e) => updateBasicData("address", e.target.value)}
            placeholder="عنوان السكن"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>
    </div>
  )

  const renderEmploymentDataStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-lamaYellow mb-6 text-center">
        البيانات الوظيفية والمؤهلات العلمية
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">تاريخ التعيين</Label>
          <Input
            type="date"
            value={employmentData.appointmentDate}
            onChange={(e) => updateEmploymentData("appointmentDate", e.target.value)}
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">تاريخ مباشرة العمل</Label>
          <Input
            type="date"
            value={employmentData.serviceStartDate}
            onChange={(e) => updateEmploymentData("serviceStartDate", e.target.value)}
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">المؤهل العلمي</Label>
          <Input
            value={employmentData.academicQualification}
            onChange={(e) => updateEmploymentData("academicQualification", e.target.value)}
            placeholder="المؤهل العلمي"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">المؤسسة التعليمية</Label>
          <Input
            value={employmentData.educationalInstitution}
            onChange={(e) => updateEmploymentData("educationalInstitution", e.target.value)}
            placeholder="المؤسسة التعليمية"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">التخصص الرئيسي</Label>
          <Input
            value={employmentData.majorSpecialization}
            onChange={(e) => updateEmploymentData("majorSpecialization", e.target.value)}
            placeholder="التخصص الرئيسي"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">سنة التخرج</Label>
          <Input
            value={employmentData.graduationYear}
            onChange={(e) => updateEmploymentData("graduationYear", e.target.value)}
            placeholder="سنة التخرج"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-lamaYellow mb-6 text-center">
        مراجعة البيانات
      </h3>

      <div className="space-y-6">
        {/* البيانات الأساسية */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-lamaYellow/5 to-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lamaYellow/10 to-lamaYellow/5 border-b border-lamaYellow/20">
            <CardTitle className="text-xl font-bold text-lamaYellow flex items-center gap-3">
              <Users className="w-6 h-6" />
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">الاسم الكامل:</span>
                <span className="mr-2 text-gray-600 font-medium">{basicData.fullName}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">الرقم الوطني:</span>
                <span className="mr-2 text-gray-600 font-medium">{basicData.nationalId}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">تاريخ الميلاد:</span>
                <span className="mr-2 text-gray-600 font-medium">{basicData.birthday}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">الحالة الاجتماعية:</span>
                <span className="mr-2 text-gray-600 font-medium">
                  {basicData.maritalStatus === 'SINGLE' ? 'أعزب' :
                   basicData.maritalStatus === 'MARRIED' ? 'متزوج' :
                   basicData.maritalStatus === 'DIVORCED' ? 'مطلق' :
                   basicData.maritalStatus === 'WIDOWED' ? 'أرمل' : 'غير محدد'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">الهاتف:</span>
                <span className="mr-2 text-gray-600 font-medium">{basicData.phone1}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg md:col-span-2">
                <span className="font-semibold text-gray-700">العنوان:</span>
                <span className="mr-2 text-gray-600 font-medium">{basicData.address || 'غير محدد'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* البيانات الوظيفية */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-lamaYellow/5 to-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lamaYellow/10 to-lamaYellow/5 border-b border-lamaYellow/20">
            <CardTitle className="text-xl font-bold text-lamaYellow flex items-center gap-3">
              <GraduationCap className="w-6 h-6" />
              المؤهلات والتوظيف
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">تاريخ التعيين:</span>
                <span className="mr-2 text-gray-600 font-medium">{employmentData.appointmentDate || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">تاريخ بدء الخدمة:</span>
                <span className="mr-2 text-gray-600 font-medium">{employmentData.serviceStartDate || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">المؤهل العلمي:</span>
                <span className="mr-2 text-gray-600 font-medium">{employmentData.academicQualification || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">سنة التخرج:</span>
                <span className="mr-2 text-gray-600 font-medium">{employmentData.graduationYear || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">المؤسسة التعليمية:</span>
                <span className="mr-2 text-gray-600 font-medium">{employmentData.educationalInstitution || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-lamaYellow/10 rounded-lg">
                <span className="font-semibold text-gray-700">التخصص الرئيسي:</span>
                <span className="mr-2 text-gray-600 font-medium">{employmentData.majorSpecialization || 'غير محدد'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight via-lamaPurple to-lamaSkyLight">
      <div className="container mx-auto p-8 max-w-6xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight py-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-lamaYellow mb-2">إضافة موظف إداري جديد</CardTitle>
            <p className="text-gray-600">نظام متعدد الخطوات لإضافة موظف إداري جديد</p>
          </CardHeader>

          <CardContent className="p-10">
            {renderStepIndicator()}

            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200 mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-700 text-sm p-3 bg-green-50 rounded-lg border border-green-200 mb-6">
                {success}
              </div>
            )}

            <div className="min-h-[500px]">
              {currentStep === 1 && renderBasicDataStep()}
              {currentStep === 2 && renderEmploymentDataStep()}
              {currentStep === 3 && renderReviewStep()}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 ml-2" />
                السابق
              </Button>

              <div className="text-sm text-gray-500">
                الخطوة {currentStep} من 3
              </div>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-lamaYellow hover:bg-lamaYellow/90 text-white"
                >
                  التالي
                  <ChevronRight className="w-4 h-4 mr-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-lamaYellow hover:bg-lamaYellow/90 text-white"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إضافة الموظف الإداري"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
