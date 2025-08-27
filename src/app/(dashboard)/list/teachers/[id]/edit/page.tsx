"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, GraduationCap, Save, Loader2 } from "lucide-react"

interface Subject {
  id: number
  name: string
  academicYear: string | null
}

interface StudyLevel {
  id: string
  name: string
}

interface Teacher {
  id: string
  fullName: string
  nationalId: string
  birthday: string
  nationality: string | null
  maritalStatus: string | null
  address: string | null
  phone1: string
  phone2: string | null
  emergencyContactName: string | null
  emergencyContactRelation: string | null
  employmentStatus: string | null
  appointmentDate: string | null
  serviceStartDate: string | null
  contractEndDate: string | null
  academicQualification: string | null
  educationalInstitution: string | null
  majorSpecialization: string | null
  minorSpecialization: string | null
  graduationYear: string | null
  teacherSubjects: { id: number; subject: Subject }[]
  teacherStudyLevels: { id: number; studyLevel: string }[]
}

export default function EditTeacherPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form data
  const [formData, setFormData] = useState({
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
    employmentStatus: "",
    appointmentDate: "",
    serviceStartDate: "",
    contractEndDate: "",
    academicQualification: "",
    educationalInstitution: "",
    majorSpecialization: "",
    minorSpecialization: "",
    graduationYear: "",
    selectedSubjects: [] as number[],
    selectedStudyLevels: [] as string[],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, subjectsRes, studyLevelsRes] = await Promise.all([
          fetch(`/api/teachers/${params.id}`),
          fetch("/api/subjects"),
          fetch("/api/study-levels"),
        ])

        const teacherData = await teacherRes.json()
        const subjectsData = await subjectsRes.json()
        const studyLevelsData = await studyLevelsRes.json()

        setTeacher(teacherData.teacher)
        setSubjects(subjectsData.subjects || [])
        setStudyLevels(studyLevelsData.studyLevels || [])

        // Set form data
        if (teacherData.teacher) {
          const teacher = teacherData.teacher
          setFormData({
            fullName: teacher.fullName || "",
            nationalId: teacher.nationalId || "",
            birthday: teacher.birthday ? new Date(teacher.birthday).toISOString().split("T")[0] : "",
            nationality: teacher.nationality || "",
            maritalStatus: teacher.maritalStatus || "",
            address: teacher.address || "",
            phone1: teacher.phone1 || "",
            phone2: teacher.phone2 || "",
            emergencyContactName: teacher.emergencyContactName || "",
            emergencyContactRelation: teacher.emergencyContactRelation || "",
            employmentStatus: teacher.employmentStatus || "",
            appointmentDate: teacher.appointmentDate ? new Date(teacher.appointmentDate).toISOString().split("T")[0] : "",
            serviceStartDate: teacher.serviceStartDate ? new Date(teacher.serviceStartDate).toISOString().split("T")[0] : "",
            contractEndDate: teacher.contractEndDate ? new Date(teacher.contractEndDate).toISOString().split("T")[0] : "",
            academicQualification: teacher.academicQualification || "",
            educationalInstitution: teacher.educationalInstitution || "",
            majorSpecialization: teacher.majorSpecialization || "",
            minorSpecialization: teacher.minorSpecialization || "",
            graduationYear: teacher.graduationYear || "",
            selectedSubjects: teacher.teacherSubjects.map((ts: any) => ts.subject.id),
            selectedStudyLevels: teacher.teacherStudyLevels.map((tsl: any) => tsl.studyLevel),
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("فشل في تحميل بيانات المعلم")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubjectToggle = (subjectId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter((id) => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }))
  }

  const handleStudyLevelToggle = (studyLevel: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStudyLevels: prev.selectedStudyLevels.includes(studyLevel)
        ? prev.selectedStudyLevels.filter((level) => level !== studyLevel)
        : [...prev.selectedStudyLevels, studyLevel],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`/api/teachers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "فشل في تحديث بيانات المعلم")
      }

      setSuccess("تم تحديث بيانات المعلم بنجاح")
      setTimeout(() => {
        router.push(`/list/teachers/${params.id}`)
      }, 2000)
    } catch (error: any) {
      setError(error.message || "خطأ غير متوقع")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple flex items-center justify-center">
        <div className="text-center text-white">
          <p>لم يتم العثور على المعلم</p>
          <Link href="/list/teachers" className="text-lamaYellow hover:underline">
            العودة لقائمة المعلمين
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky to-lamaYellow text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-2 rounded-full"></div>
            <p className="text-white/90 text-lg">تعديل بيانات المعلم</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/list/teachers/${params.id}`}>
            <Button variant="outline" className="text-lamaYellow border-lamaYellow hover:bg-lamaYellow hover:text-white">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة لتفاصيل المعلم
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-lamaYellow font-bold">تعديل بيانات المعلم</CardTitle>
                  <p className="text-gray-600">{teacher.fullName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-700 text-sm p-3 bg-green-50 rounded-lg border border-green-200">
                  {success}
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المعلومات الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">الاسم الكامل *</Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">رقم الهوية *</Label>
                    <Input
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange("nationalId", e.target.value)}
                      required
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">تاريخ الميلاد *</Label>
                    <Input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange("birthday", e.target.value)}
                      required
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">الجنسية</Label>
                    <Input
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">الحالة الاجتماعية</Label>
                    <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange("maritalStatus", value)}>
                      <SelectTrigger className="border-lamaYellow/20 focus:border-lamaYellow">
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
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">عنوان السكن</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">معلومات الاتصال</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">هاتف أول *</Label>
                    <Input
                      value={formData.phone1}
                      onChange={(e) => handleInputChange("phone1", e.target.value)}
                      required
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">هاتف ثاني</Label>
                    <Input
                      value={formData.phone2}
                      onChange={(e) => handleInputChange("phone2", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">اسم جهة اتصال الطوارئ</Label>
                    <Input
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">صلة قرابة جهة الاتصال</Label>
                    <Input
                      value={formData.emergencyContactRelation}
                      onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المعلومات الوظيفية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">الحالة الوظيفية</Label>
                    <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange("employmentStatus", value)}>
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
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">تاريخ التعيين</Label>
                    <Input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">تاريخ مباشرة العمل</Label>
                    <Input
                      type="date"
                      value={formData.serviceStartDate}
                      onChange={(e) => handleInputChange("serviceStartDate", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">تاريخ نهاية العقد</Label>
                    <Input
                      type="date"
                      value={formData.contractEndDate}
                      onChange={(e) => handleInputChange("contractEndDate", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Qualifications */}
              <div>
                <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المؤهلات العلمية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">المؤهل العلمي</Label>
                    <Input
                      value={formData.academicQualification}
                      onChange={(e) => handleInputChange("academicQualification", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">المؤسسة التعليمية</Label>
                    <Input
                      value={formData.educationalInstitution}
                      onChange={(e) => handleInputChange("educationalInstitution", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">التخصص الرئيسي</Label>
                    <Input
                      value={formData.majorSpecialization}
                      onChange={(e) => handleInputChange("majorSpecialization", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">التخصص الفرعي</Label>
                    <Input
                      value={formData.minorSpecialization}
                      onChange={(e) => handleInputChange("minorSpecialization", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lamaYellow font-semibold">سنة التخرج</Label>
                    <Input
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      className="border-lamaYellow/20 focus:border-lamaYellow"
                    />
                  </div>
                </div>
              </div>

              {/* Teaching Subjects */}
              <div>
                <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المواد الدراسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-3 space-x-reverse">
                      <Checkbox
                        id={`subject-${subject.id}`}
                        checked={formData.selectedSubjects.includes(subject.id)}
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

              {/* Teaching Levels */}
              <div>
                <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المراحل الدراسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyLevels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-3 space-x-reverse">
                      <Checkbox
                        id={`level-${level.id}`}
                        checked={formData.selectedStudyLevels.includes(level.id)}
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

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-300"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
