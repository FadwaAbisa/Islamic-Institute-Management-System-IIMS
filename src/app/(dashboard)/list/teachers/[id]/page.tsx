import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, GraduationCap, Phone, MapPin, Calendar, User, BookOpen, Users } from "lucide-react"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function TeacherDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
    include: {
      teacherSubjects: {
        include: {
          subject: true,
        },
      },
      teacherStudyLevels: true,
    },
  })

  if (!teacher) {
    notFound()
  }

  const getEmploymentStatusColor = (status: string | null) => {
    switch (status) {
      case "APPOINTMENT":
        return "bg-green-100 text-green-800"
      case "CONTRACT":
        return "bg-blue-100 text-blue-800"
      case "SECONDMENT":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmploymentStatusText = (status: string | null) => {
    switch (status) {
      case "APPOINTMENT":
        return "تعيين"
      case "CONTRACT":
        return "عقد"
      case "SECONDMENT":
        return "ندب"
      default:
        return "غير محدد"
    }
  }

  const getMaritalStatusText = (status: string | null) => {
    switch (status) {
      case "SINGLE":
        return "أعزب"
      case "MARRIED":
        return "متزوج"
      case "DIVORCED":
        return "مطلق"
      case "WIDOWED":
        return "أرمل"
      default:
        return "غير محدد"
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "غير محدد"
    return new Date(date).toLocaleDateString("ar-SA")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky to-lamaYellow text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-2 rounded-full"></div>
            <p className="text-white/90 text-lg">تفاصيل المعلم</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/list/teachers">
            <Button variant="outline" className="text-lamaYellow border-lamaYellow hover:bg-lamaYellow hover:text-white">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة لقائمة المعلمين
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-lamaYellow font-bold">{teacher.fullName}</CardTitle>
                      <p className="text-gray-600">معلم في المعهد</p>
                    </div>
                  </div>
                  <Link href={`/list/teachers/${teacher.id}/edit`}>
                    <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white">
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المعلومات الأساسية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-lamaSky" />
                      <div>
                        <p className="text-sm text-gray-600">رقم الهوية</p>
                        <p className="font-medium">{teacher.nationalId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-lamaSky" />
                      <div>
                        <p className="text-sm text-gray-600">تاريخ الميلاد</p>
                        <p className="font-medium">{formatDate(teacher.birthday)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-lamaSky" />
                      <div>
                        <p className="text-sm text-gray-600">الجنسية</p>
                        <p className="font-medium">{teacher.nationality || "غير محدد"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-lamaSky" />
                      <div>
                        <p className="text-sm text-gray-600">الحالة الاجتماعية</p>
                        <p className="font-medium">{getMaritalStatusText(teacher.maritalStatus)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">معلومات الاتصال</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-lamaSky" />
                      <div>
                        <p className="text-sm text-gray-600">الهاتف الأول</p>
                        <p className="font-medium">{teacher.phone1}</p>
                      </div>
                    </div>
                    {teacher.phone2 && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-lamaSky" />
                        <div>
                          <p className="text-sm text-gray-600">الهاتف الثاني</p>
                          <p className="font-medium">{teacher.phone2}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-lamaSky" />
                      <div>
                        <p className="text-sm text-gray-600">العنوان</p>
                        <p className="font-medium">{teacher.address || "غير محدد"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {(teacher.emergencyContactName || teacher.emergencyContactRelation) && (
                  <div>
                    <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">جهة الاتصال للطوارئ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teacher.emergencyContactName && (
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-lamaSky" />
                          <div>
                            <p className="text-sm text-gray-600">الاسم</p>
                            <p className="font-medium">{teacher.emergencyContactName}</p>
                          </div>
                        </div>
                      )}
                      {teacher.emergencyContactRelation && (
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-lamaSky" />
                          <div>
                            <p className="text-sm text-gray-600">صلة القرابة</p>
                            <p className="font-medium">{teacher.emergencyContactRelation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Employment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المعلومات الوظيفية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Badge className={getEmploymentStatusColor(teacher.employmentStatus)}>
                        {getEmploymentStatusText(teacher.employmentStatus)}
                      </Badge>
                    </div>
                    {teacher.appointmentDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-lamaSky" />
                        <div>
                          <p className="text-sm text-gray-600">تاريخ التعيين</p>
                          <p className="font-medium">{formatDate(teacher.appointmentDate)}</p>
                        </div>
                      </div>
                    )}
                    {teacher.serviceStartDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-lamaSky" />
                        <div>
                          <p className="text-sm text-gray-600">تاريخ مباشرة العمل</p>
                          <p className="font-medium">{formatDate(teacher.serviceStartDate)}</p>
                        </div>
                      </div>
                    )}
                    {teacher.contractEndDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-lamaSky" />
                        <div>
                          <p className="text-sm text-gray-600">تاريخ نهاية العقد</p>
                          <p className="font-medium">{formatDate(teacher.contractEndDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Qualifications */}
                {(teacher.academicQualification || teacher.educationalInstitution || teacher.majorSpecialization) && (
                  <div>
                    <h3 className="text-lg font-semibold text-lamaYellow mb-4 border-b pb-2">المؤهلات العلمية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teacher.academicQualification && (
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-lamaSky" />
                          <div>
                            <p className="text-sm text-gray-600">المؤهل العلمي</p>
                            <p className="font-medium">{teacher.academicQualification}</p>
                          </div>
                        </div>
                      )}
                      {teacher.educationalInstitution && (
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-lamaSky" />
                          <div>
                            <p className="text-sm text-gray-600">المؤسسة التعليمية</p>
                            <p className="font-medium">{teacher.educationalInstitution}</p>
                          </div>
                        </div>
                      )}
                      {teacher.majorSpecialization && (
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-lamaSky" />
                          <div>
                            <p className="text-sm text-gray-600">التخصص الرئيسي</p>
                            <p className="font-medium">{teacher.majorSpecialization}</p>
                          </div>
                        </div>
                      )}
                      {teacher.minorSpecialization && (
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-lamaSky" />
                          <div>
                            <p className="text-sm text-gray-600">التخصص الفرعي</p>
                            <p className="font-medium">{teacher.minorSpecialization}</p>
                          </div>
                        </div>
                      )}
                      {teacher.graduationYear && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-lamaSky" />
                          <div>
                            <p className="text-sm text-gray-600">سنة التخرج</p>
                            <p className="font-medium">{teacher.graduationYear}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Teaching Subjects */}
            <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-lamaYellow flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  المواد الدراسية
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teacher.teacherSubjects.length > 0 ? (
                  <div className="space-y-2">
                    {teacher.teacherSubjects.map((ts) => (
                      <Badge key={ts.id} variant="outline" className="w-full justify-center">
                        {ts.subject.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">لا توجد مواد دراسية</p>
                )}
              </CardContent>
            </Card>

            {/* Teaching Levels */}
            <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-lamaYellow flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  المراحل الدراسية
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teacher.teacherStudyLevels.length > 0 ? (
                  <div className="space-y-2">
                    {teacher.teacherStudyLevels.map((tsl) => (
                      <Badge key={tsl.id} variant="outline" className="w-full justify-center bg-blue-50 text-blue-700">
                        {tsl.studyLevel}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">لا توجد مراحل دراسية</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-lamaYellow">إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">عدد المواد:</span>
                  <Badge variant="secondary">{teacher.teacherSubjects.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">عدد المراحل:</span>
                  <Badge variant="secondary">{teacher.teacherStudyLevels.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ الإضافة:</span>
                  <span className="text-sm">{formatDate(teacher.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
