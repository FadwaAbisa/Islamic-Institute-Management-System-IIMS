"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GraduationCap, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface Subject {
  id: number
  name: string
  academicYear: string | null
}

interface StudyLevel {
  id: string
  name: string
}

export default function AddTeacherPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([])

  // البيانات الأساسية والبيانات الشخصية وجهة اتصال الطوارئ
  const [basicData, setBasicData] = useState({
    fullName: "",
    nationalId: "",
    birthday: "",
    nationality: "",
    maritalStatus: "",
    address: "",
    phone1: "",
    phone2: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
  })

  // البيانات الوظيفية والمؤهلات العلمية
  const [employmentData, setEmploymentData] = useState({
    employmentStatus: "",
    appointmentDate: "",
    serviceStartDate: "",
    contractEndDate: "",
    academicQualification: "",
    educationalInstitution: "",
    majorSpecialization: "",
    minorSpecialization: "",
    graduationYear: "",
  })

  // المواد والمراحل الدراسية
  const [teachingData, setTeachingData] = useState({
    selectedSubjects: [] as number[],
    selectedStudyLevels: [] as string[],
  })

  useEffect(() => {
    // جلب المواد الدراسية
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data.subjects || []))
      .catch((err) => console.error("خطأ في جلب المواد:", err))

    // جلب المراحل الدراسية
    fetch("/api/study-levels")
      .then((res) => res.json())
      .then((data) => setStudyLevels(data.studyLevels || []))
      .catch((err) => console.error("خطأ في جلب المراحل:", err))
  }, [])

  const updateBasicData = (key: keyof typeof basicData, value: string) => {
    setBasicData((prev) => ({ ...prev, [key]: value }))
  }

  const updateEmploymentData = (key: keyof typeof employmentData, value: string) => {
    setEmploymentData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubjectToggle = (subjectId: number) => {
    setTeachingData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter((id) => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }))
  }

  const handleStudyLevelToggle = (studyLevel: string) => {
    setTeachingData((prev) => ({
      ...prev,
      selectedStudyLevels: prev.selectedStudyLevels.includes(studyLevel)
        ? prev.selectedStudyLevels.filter((level) => level !== studyLevel)
        : [...prev.selectedStudyLevels, studyLevel],
    }))
  }

  const validateBasicData = () => {
    return (
      basicData.fullName.trim() !== "" &&
      basicData.nationalId.trim() !== "" &&
      basicData.birthday !== "" &&
      basicData.phone1.trim() !== ""
    )
  }

  const validateEmploymentData = () => {
    return true // البيانات الوظيفية اختيارية
  }

  const validateTeachingData = () => {
    return (
      teachingData.selectedSubjects.length > 0 &&
      teachingData.selectedStudyLevels.length > 0
    )
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
    if (!validateTeachingData()) {
      setError("يرجى اختيار المواد والمراحل الدراسية")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const teacherData = {
        ...basicData,
        ...employmentData,
        subjects: teachingData.selectedSubjects,
        studyLevels: teachingData.selectedStudyLevels,
      }

      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "فشل إضافة المعلم")
      }

      setSuccess("تم إضافة المعلم بنجاح")
      
      // إعادة تعيين النموذج
      setBasicData({
        fullName: "",
        nationalId: "",
        birthday: "",
        nationality: "",
        maritalStatus: "",
        address: "",
        phone1: "",
        phone2: "",
        emergencyContactName: "",
        emergencyContactRelation: "",
      })
      setEmploymentData({
        employmentStatus: "",
        appointmentDate: "",
        serviceStartDate: "",
        contractEndDate: "",
        academicQualification: "",
        educationalInstitution: "",
        majorSpecialization: "",
        minorSpecialization: "",
        graduationYear: "",
      })
      setTeachingData({
        selectedSubjects: [],
        selectedStudyLevels: [],
      })
      setCurrentStep(1)
    } catch (e: any) {
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
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= step
                ? "bg-lamaYellow text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-lamaYellow" : "bg-gray-200"
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
          <Label className="text-lamaYellow font-semibold">الجنسية</Label>
          <Input
            value={basicData.nationality}
            onChange={(e) => updateBasicData("nationality", e.target.value)}
            placeholder="الجنسية"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Label className="text-lamaYellow font-semibold">هاتف ثاني</Label>
          <Input
            value={basicData.phone2}
            onChange={(e) => updateBasicData("phone2", e.target.value)}
            placeholder="رقم الهاتف الثاني"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">اسم جهة اتصال الطوارئ</Label>
          <Input
            value={basicData.emergencyContactName}
            onChange={(e) => updateBasicData("emergencyContactName", e.target.value)}
            placeholder="اسم جهة الاتصال"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">صلة قرابة جهة الاتصال</Label>
          <Input
            value={basicData.emergencyContactRelation}
            onChange={(e) => updateBasicData("emergencyContactRelation", e.target.value)}
            placeholder="صلة القرابة"
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
          <Label className="text-lamaYellow font-semibold">الحالة الوظيفية</Label>
          <Select value={employmentData.employmentStatus} onValueChange={(value) => updateEmploymentData("employmentStatus", value)}>
            <SelectTrigger className="border-lamaYellow/20 focus:border-lamaYellow">
              <SelectValue placeholder="اختر الحالة الوظيفية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="APPOINTMENT">تعيين</SelectItem>
              <SelectItem value="CONTRACT">عقد</SelectItem>
              <SelectItem value="SECONDMENT">ندب</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">تاريخ التعيين</Label>
          <Input
            type="date"
            value={employmentData.appointmentDate}
            onChange={(e) => updateEmploymentData("appointmentDate", e.target.value)}
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">تاريخ مباشرة العمل</Label>
          <Input
            type="date"
            value={employmentData.serviceStartDate}
            onChange={(e) => updateEmploymentData("serviceStartDate", e.target.value)}
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-lamaYellow font-semibold">تاريخ نهاية العقد</Label>
          <Input
            type="date"
            value={employmentData.contractEndDate}
            onChange={(e) => updateEmploymentData("contractEndDate", e.target.value)}
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
          <Label className="text-lamaYellow font-semibold">التخصص الفرعي</Label>
          <Input
            value={employmentData.minorSpecialization}
            onChange={(e) => updateEmploymentData("minorSpecialization", e.target.value)}
            placeholder="التخصص الفرعي"
            className="border-lamaYellow/20 focus:border-lamaYellow"
          />
        </div>
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
  )

  const renderTeachingDataStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-lamaYellow mb-6 text-center">
        اختيار المواد والمراحل الدراسية
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-lamaYellow mb-4">المواد الدراسية</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-3 space-x-reverse">
                <Checkbox
                  id={`subject-${subject.id}`}
                  checked={teachingData.selectedSubjects.includes(subject.id)}
                  onCheckedChange={() => handleSubjectToggle(subject.id)}
                  className="border-lamaYellow text-lamaYellow"
                />
                <Label htmlFor={`subject-${subject.id}`} className="text-sm font-medium cursor-pointer">
                  {subject.name}
                  {subject.academicYear && (
                    <span className="text-xs text-gray-500 block">({subject.academicYear})</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-lamaYellow mb-4">المراحل الدراسية</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyLevels.map((level) => (
              <div key={level.id} className="flex items-center space-x-3 space-x-reverse">
                <Checkbox
                  id={`level-${level.id}`}
                  checked={teachingData.selectedStudyLevels.includes(level.id)}
                  onCheckedChange={() => handleStudyLevelToggle(level.id)}
                  className="border-lamaYellow text-lamaYellow"
                />
                <Label htmlFor={`level-${level.id}`} className="text-sm font-medium cursor-pointer">
                  {level.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight via-lamaPurple to-lamaSkyLight">
      <div className="container mx-auto p-8 max-w-6xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight py-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-lamaYellow mb-2">إضافة معلم جديد</CardTitle>
            <p className="text-gray-600">نظام متعدد الخطوات لإضافة معلم جديد</p>
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
              {currentStep === 3 && renderTeachingDataStep()}
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
                  {isSubmitting ? "جاري الإرسال..." : "إضافة المعلم"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


