"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GraduationCap, ChevronRight, ChevronLeft, CheckCircle, Users, Phone, MapPin, Calendar, Building, Clock, Save, X, UserPlus, Award, Briefcase, Home, PhoneCall, IdCard, Cake, Heart } from "lucide-react"
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
    <div className="relative mb-12">
      {/* خلفية متدرجة للخطوات */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 rounded-2xl h-20 -z-10"></div>
      
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-8 rtl:space-x-reverse">
          {/* الخطوة الأولى */}
          <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 1 ? 'scale-110' : 'scale-100'}`}>
            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
              currentStep >= 1 
                ? 'border-orange-500 bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200' 
                : 'border-orange-200 bg-white'
            }`}>
              {currentStep > 1 ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <span className={`text-xl font-bold ${currentStep >= 1 ? 'text-white' : 'text-orange-300'}`}>1</span>
              )}
            </div>
            <span className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
              currentStep >= 1 ? 'text-orange-600' : 'text-orange-400'
            }`}>المعلومات الأساسية</span>
          </div>

          {/* خط الاتصال الأول */}
          <div className={`w-20 h-1 rounded-full transition-all duration-500 ${
            currentStep >= 2 
              ? 'bg-gradient-to-r from-orange-400 to-orange-500' 
              : 'bg-orange-200'
          }`} />

          {/* الخطوة الثانية */}
          <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 2 ? 'scale-110' : 'scale-100'}`}>
            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
              currentStep >= 2 
                ? 'border-orange-500 bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200' 
                : 'border-orange-200 bg-white'
            }`}>
              {currentStep > 2 ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <span className={`text-xl font-bold ${currentStep >= 2 ? 'text-white' : 'text-orange-300'}`}>2</span>
              )}
            </div>
            <span className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
              currentStep >= 2 ? 'text-orange-600' : 'text-orange-400'
            }`}>المؤهلات والتوظيف</span>
          </div>

          {/* خط الاتصال الثاني */}
          <div className={`w-20 h-1 rounded-full transition-all duration-500 ${
            currentStep >= 3 
              ? 'bg-gradient-to-r from-orange-400 to-orange-500' 
              : 'bg-orange-200'
          }`} />

          {/* الخطوة الثالثة */}
          <div className={`flex flex-col items-center transition-all duration-500 ${currentStep >= 3 ? 'scale-110' : 'scale-100'}`}>
            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
              currentStep >= 3 
                ? 'border-orange-500 bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200' 
                : 'border-orange-200 bg-white'
            }`}>
              <span className={`text-xl font-bold ${currentStep >= 3 ? 'text-white' : 'text-orange-300'}`}>3</span>
            </div>
            <span className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
              currentStep >= 3 ? 'text-orange-600' : 'text-orange-400'
            }`}>مراجعة وإرسال</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBasicDataStep = () => (
    <div className="space-y-6">
      {/* بطاقة العنوان */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-4 shadow-lg shadow-orange-200">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
          المعلومات الأساسية
        </h2>
        <p className="text-gray-600 text-lg">أدخل البيانات الأساسية للموظف الإداري</p>
      </div>

      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-orange-50/30 to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* الاسم الكامل */}
            <div className="space-y-3 group">
              <Label htmlFor="fullName" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-500" />
                الاسم الكامل *
              </Label>
              <Input
                id="fullName"
                value={basicData.fullName}
                onChange={(e) => updateBasicData("fullName", e.target.value)}
                placeholder="أدخل الاسم الكامل"
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* الرقم الوطني */}
            <div className="space-y-3 group">
              <Label htmlFor="nationalId" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <IdCard className="w-5 h-5 text-orange-500" />
                الرقم الوطني / الجواز *
              </Label>
              <Input
                id="nationalId"
                value={basicData.nationalId}
                onChange={(e) => updateBasicData("nationalId", e.target.value)}
                placeholder="أدخل الرقم الوطني"
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* تاريخ الميلاد */}
            <div className="space-y-3 group">
              <Label htmlFor="birthday" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Cake className="w-5 h-5 text-orange-500" />
                تاريخ الميلاد *
              </Label>
              <Input
                id="birthday"
                type="date"
                value={basicData.birthday}
                onChange={(e) => updateBasicData("birthday", e.target.value)}
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* الحالة الاجتماعية */}
            <div className="space-y-3 group">
              <Label htmlFor="maritalStatus" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-500" />
                الحالة الاجتماعية
              </Label>
              <Select value={basicData.maritalStatus} onValueChange={(value) => updateBasicData("maritalStatus", value)}>
                <SelectTrigger className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300">
                  <SelectValue placeholder="اختر الحالة الاجتماعية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">أعزب</SelectItem>
                  <SelectItem value="MARRIED">متزوج</SelectItem>
                  <SelectItem value="DIVORCED">مطلق</SelectItem>
                  <SelectItem value="WIDOWED">أرمل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* الهاتف */}
            <div className="space-y-3 group">
              <Label htmlFor="phone1" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-orange-500" />
                الهاتف الأول *
              </Label>
              <Input
                id="phone1"
                value={basicData.phone1}
                onChange={(e) => updateBasicData("phone1", e.target.value)}
                placeholder="+966501234567"
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* العنوان */}
            <div className="space-y-3 group md:col-span-2">
              <Label htmlFor="address" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Home className="w-5 h-5 text-orange-500" />
                العنوان
              </Label>
              <Textarea
                id="address"
                value={basicData.address}
                onChange={(e) => updateBasicData("address", e.target.value)}
                placeholder="أدخل العنوان الكامل"
                rows={4}
                className="border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300 resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEmploymentDataStep = () => (
    <div className="space-y-6">
      {/* بطاقة العنوان */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-4 shadow-lg shadow-orange-200">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
          المؤهلات والتوظيف
        </h2>
        <p className="text-gray-600 text-lg">أدخل البيانات الوظيفية والمؤهلات العلمية</p>
      </div>

      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-orange-50/30 to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* تاريخ التعيين */}
            <div className="space-y-3 group">
              <Label htmlFor="appointmentDate" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                تاريخ التعيين
              </Label>
              <Input
                id="appointmentDate"
                type="date"
                value={employmentData.appointmentDate}
                onChange={(e) => updateEmploymentData("appointmentDate", e.target.value)}
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* تاريخ بدء الخدمة */}
            <div className="space-y-3 group">
              <Label htmlFor="serviceStartDate" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                تاريخ بدء الخدمة
              </Label>
              <Input
                id="serviceStartDate"
                type="date"
                value={employmentData.serviceStartDate}
                onChange={(e) => updateEmploymentData("serviceStartDate", e.target.value)}
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* المؤهل العلمي */}
            <div className="space-y-3 group">
              <Label htmlFor="academicQualification" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                المؤهل العلمي
              </Label>
              <Input
                id="academicQualification"
                value={employmentData.academicQualification}
                onChange={(e) => updateEmploymentData("academicQualification", e.target.value)}
                placeholder="مثال: بكالوريوس، ماجستير، دكتوراه"
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* سنة التخرج */}
            <div className="space-y-3 group">
              <Label htmlFor="graduationYear" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                سنة التخرج
              </Label>
              <Input
                id="graduationYear"
                type="number"
                value={employmentData.graduationYear}
                onChange={(e) => updateEmploymentData("graduationYear", e.target.value)}
                placeholder="2020"
                min="1950"
                max="2030"
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* المؤسسة التعليمية */}
            <div className="space-y-3 group">
              <Label htmlFor="educationalInstitution" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-500" />
                المؤسسة التعليمية
              </Label>
              <Input
                id="educationalInstitution"
                value={employmentData.educationalInstitution}
                onChange={(e) => updateEmploymentData("educationalInstitution", e.target.value)}
                placeholder="اسم الجامعة أو الكلية"
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>

            {/* التخصص الرئيسي */}
            <div className="space-y-3 group">
              <Label htmlFor="majorSpecialization" className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-500" />
                التخصص الرئيسي
              </Label>
              <Input
                id="majorSpecialization"
                value={employmentData.majorSpecialization}
                onChange={(e) => updateEmploymentData("majorSpecialization", e.target.value)}
                placeholder="مثال: إدارة أعمال، تربية، علوم حاسب"
                className="h-12 border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 rounded-xl text-lg transition-all duration-300 hover:border-orange-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      {/* بطاقة العنوان */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-4 shadow-lg shadow-orange-200">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
          مراجعة البيانات
        </h2>
        <p className="text-gray-600 text-lg">راجع جميع البيانات قبل الإرسال</p>
      </div>

      <div className="space-y-6">
        {/* البيانات الأساسية */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-orange-50/30 to-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/50">
            <CardTitle className="text-xl font-bold text-orange-700 flex items-center gap-3">
              <Users className="w-6 h-6" />
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <UserPlus className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">الاسم الكامل:</span>
                  <span className="mr-2 text-gray-600 font-medium">{basicData.fullName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <IdCard className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">الرقم الوطني:</span>
                  <span className="mr-2 text-gray-600 font-medium">{basicData.nationalId}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Cake className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">تاريخ الميلاد:</span>
                  <span className="mr-2 text-gray-600 font-medium">{basicData.birthday}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Heart className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">الحالة الاجتماعية:</span>
                  <span className="mr-2 text-gray-600 font-medium">
                    {basicData.maritalStatus === 'SINGLE' ? 'أعزب' :
                     basicData.maritalStatus === 'MARRIED' ? 'متزوج' :
                     basicData.maritalStatus === 'DIVORCED' ? 'مطلق' :
                     basicData.maritalStatus === 'WIDOWED' ? 'أرمل' : 'غير محدد'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <PhoneCall className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">الهاتف:</span>
                  <span className="mr-2 text-gray-600 font-medium">{basicData.phone1}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg md:col-span-2">
                <Home className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">العنوان:</span>
                  <span className="mr-2 text-gray-600 font-medium">{basicData.address || 'غير محدد'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* البيانات الوظيفية */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-orange-50/30 to-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/50">
            <CardTitle className="text-xl font-bold text-orange-700 flex items-center gap-3">
              <GraduationCap className="w-6 h-6" />
              المؤهلات والتوظيف
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">تاريخ التعيين:</span>
                  <span className="mr-2 text-gray-600 font-medium">{employmentData.appointmentDate || 'غير محدد'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">تاريخ بدء الخدمة:</span>
                  <span className="mr-2 text-gray-600 font-medium">{employmentData.serviceStartDate || 'غير محدد'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Award className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">المؤهل العلمي:</span>
                  <span className="mr-2 text-gray-600 font-medium">{employmentData.academicQualification || 'غير محدد'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">سنة التخرج:</span>
                  <span className="mr-2 text-gray-600 font-medium">{employmentData.graduationYear || 'غير محدد'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Building className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">المؤسسة التعليمية:</span>
                  <span className="mr-2 text-gray-600 font-medium">{employmentData.educationalInstitution || 'غير محدد'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="font-semibold text-gray-700">التخصص الرئيسي:</span>
                  <span className="mr-2 text-gray-600 font-medium">{employmentData.majorSpecialization || 'غير محدد'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100/50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="mr-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  إضافة موظف إداري جديد
                </h1>
                <p className="text-gray-600 text-lg mt-1">تسجيل موظف إداري جديد في النظام</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/list/staff')}
                className="text-gray-600 hover:text-orange-600 p-3 rounded-xl hover:bg-orange-50 transition-all duration-300 group"
                title="العودة للقائمة"
              >
                <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderStepIndicator()}

        {/* رسائل الخطأ والنجاح */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </div>
              <p className="text-red-700 text-lg font-semibold text-center">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-green-700 text-lg font-semibold text-center">{success}</p>
            </div>
          </div>
        )}

        {/* عرض الخطوة الحالية */}
        {currentStep === 1 && renderBasicDataStep()}
        {currentStep === 2 && renderEmploymentDataStep()}
        {currentStep === 3 && renderReviewStep()}

        {/* أزرار التنقل */}
        <div className="flex items-center justify-between mt-12">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`h-14 px-8 text-lg font-semibold border-2 transition-all duration-300 ${
              currentStep === 1
                ? 'border-orange-200 text-orange-300 cursor-not-allowed'
                : 'border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500'
            } rounded-xl`}
          >
            <ChevronLeft className="w-5 h-5 ml-3" />
            السابق
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              التالي
              <ChevronRight className="w-5 h-5 mr-3" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-3"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 ml-3" />
                  إضافة الموظف الإداري
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
