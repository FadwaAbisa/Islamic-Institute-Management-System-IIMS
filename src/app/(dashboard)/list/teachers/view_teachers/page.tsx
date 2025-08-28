import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Eye, Edit, Trash2, GraduationCap, Filter, Download, RefreshCw } from "lucide-react"
import prisma from "@/lib/prisma"
import TableSearch from "@/components/TableSearch"
import Pagination from "@/components/Pagination"
import { ITEM_PER_PAGE } from "@/lib/settings"
import DeleteTeacherButton from "./DeleteTeacherButton"
import EditTeacherButton from "./EditTeacherButton"
import ViewTeacherButton from "./ViewTeacherButton"
import { Suspense } from "react"

export default async function ViewTeachersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { page, ...queryParams } = searchParams
  const p = page ? parseInt(page) : 1

  const where: any = {}
  if (queryParams.search) {
    where.OR = [
      { fullName: { contains: queryParams.search, mode: "insensitive" } },
      { nationalId: { contains: queryParams.search, mode: "insensitive" } },
    ]
  }
  if (queryParams.employmentStatus && queryParams.employmentStatus !== "الكل") {
    where.employmentStatus = queryParams.employmentStatus
  }
  if (queryParams.maritalStatus && queryParams.maritalStatus !== "الكل") {
    where.maritalStatus = queryParams.maritalStatus
  }

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { fullName: "asc" },
      include: {
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
        teacherStudyLevels: true,
      },
    }),
    prisma.teacher.count({ where }),
  ])

  const getEmploymentStatusColor = (status: string | null) => {
    switch (status) {
      case "APPOINTMENT":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "CONTRACT":
        return "bg-lamaSky text-lamaYellow border-lamaYellowLight"
      case "SECONDMENT":
        return "bg-lamaYellowLight text-lamaYellow border-lamaYellow"
      default:
        return "bg-lamaPurpleLight text-slate-700 border-lamaPurple"
    }
  }

  const getEmploymentStatusText = (status: string | null) => {
    switch (status) {
      case "APPOINTMENT":
        return "تعيين دائم"
      case "CONTRACT":
        return "عقد مؤقت"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight via-lamaPurple to-lamaSkyLight" dir="rtl">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-lamaSky via-lamaYellow to-lamaYellowLight">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative container mx-auto px-6 py-12">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 font-tajawal">قائمة المعلمين</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              إدارة شاملة لجميع المعلمين في المعهد مع إمكانية البحث والتصفية والتعديل
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-lamaPurpleLight mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 relative z-10">
        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight border-b border-lamaPurple/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-lamaYellow font-tajawal">إدارة المعلمين</CardTitle>
                  <p className="text-slate-600 text-sm mt-1">عرض وإدارة جميع المعلمين المسجلين</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير البيانات
                </Button>
                <Link href="/list/teachers/add">
                  <Button className="bg-gradient-to-r from-lamaYellow to-lamaYellowLight hover:from-lamaYellowLight hover:to-lamaYellow text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة معلم جديد
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search & Filters Section */}
            <div className="mb-8 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-lamaYellow" />
                </div>
                <Input
                  placeholder="البحث عن معلم بالاسم أو رقم الهوية..."
                  className="w-full pl-10 pr-12 py-4 text-lg border-2 border-lamaPurple rounded-xl focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Filters */}
              <div className="bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight p-6 rounded-2xl border border-lamaPurple/50">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-lamaYellow" />
                  <h3 className="text-lg font-semibold text-slate-800">تصفية النتائج</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الحالة الوظيفية</label>
                    <select 
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      defaultValue="الكل"
                    >
                      <option value="الكل">جميع الحالات</option>
                      <option value="APPOINTMENT">تعيين دائم</option>
                      <option value="CONTRACT">عقد مؤقت</option>
                      <option value="SECONDMENT">ندب</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الحالة الاجتماعية</label>
                    <select 
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      defaultValue="الكل"
                    >
                      <option value="الكل">جميع الحالات</option>
                      <option value="SINGLE">أعزب</option>
                      <option value="MARRIED">متزوج</option>
                      <option value="DIVORCED">مطلق</option>
                      <option value="WIDOWED">أرمل</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">عدد النتائج</label>
                    <select 
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      defaultValue="20"
                    >
                      <option value="10">10 نتائج</option>
                      <option value="20">20 نتيجة</option>
                      <option value="50">50 نتيجة</option>
                      <option value="100">100 نتيجة</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ترتيب النتائج</label>
                    <select 
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      defaultValue="name"
                    >
                      <option value="name">حسب الاسم</option>
                      <option value="date">حسب تاريخ التعيين</option>
                      <option value="status">حسب الحالة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-lamaSky to-lamaYellow p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm">إجمالي المعلمين</p>
                    <p className="text-3xl font-bold">{total}</p>
                  </div>
                  <Users className="w-12 h-12 text-white/80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm">معلمين دائمين</p>
                    <p className="text-3xl font-bold">{teachers.filter(t => t.employmentStatus === "APPOINTMENT").length}</p>
                  </div>
                  <GraduationCap className="w-12 h-12 text-emerald-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-lamaYellow to-lamaYellowLight p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm">معلمين بعقود</p>
                    <p className="text-3xl font-bold">{teachers.filter(t => t.employmentStatus === "CONTRACT").length}</p>
                  </div>
                  <Users className="w-12 h-12 text-white/80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-lamaSkyLight to-lamaPurple p-6 rounded-2xl text-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">معلمين منتدبين</p>
                    <p className="text-3xl font-bold">{teachers.filter(t => t.employmentStatus === "SECONDMENT").length}</p>
                  </div>
                  <Users className="w-12 h-12 text-lamaYellow" />
                </div>
              </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-white rounded-2xl border border-lamaPurple/50 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight border-0">
                      <TableHead className="text-right py-4 px-6 font-bold text-slate-800">الاسم الكامل</TableHead>
                      <TableHead className="text-right py-4 px-6 font-bold text-slate-800">رقم الهوية</TableHead>
                      <TableHead className="text-right py-4 px-6 font-bold text-slate-800">الحالة الوظيفية</TableHead>
                      <TableHead className="text-right py-4 px-6 font-bold text-slate-800">المواد الدراسية</TableHead>
                      <TableHead className="text-right py-4 px-6 font-bold text-slate-800">المراحل الدراسية</TableHead>
                      <TableHead className="text-right py-4 px-6 font-bold text-slate-800">رقم الهاتف</TableHead>
                      <TableHead className="text-right py-4 px-6 font-bold text-slate-800">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher, index) => (
                      <TableRow 
                        key={teacher.id} 
                        className={`hover:bg-gradient-to-r hover:from-lamaPurpleLight hover:to-lamaSkyLight transition-all duration-300 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-lamaPurpleLight/30'
                        }`}
                      >
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {teacher.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{teacher.fullName}</p>
                              <p className="text-xs text-slate-500">معلم</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <code className="bg-lamaPurpleLight text-slate-700 px-3 py-1 rounded-lg text-sm font-mono">
                            {teacher.nationalId}
                          </code>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className={`${getEmploymentStatusColor(teacher.employmentStatus)} px-3 py-1 rounded-full text-sm font-medium border-2`}>
                            {getEmploymentStatusText(teacher.employmentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            {teacher.teacherSubjects.map((ts) => (
                              <Badge 
                                key={ts.id} 
                                variant="outline" 
                                className="text-xs bg-lamaSkyLight text-lamaYellow border-lamaSky px-2 py-1 rounded-lg"
                              >
                                {ts.subject.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            {teacher.teacherStudyLevels.map((tsl) => (
                              <Badge 
                                key={tsl.id} 
                                variant="outline" 
                                className="text-xs bg-lamaPurpleLight text-lamaYellow border-lamaPurple px-2 py-1 rounded-lg"
                              >
                                {tsl.studyLevel}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">{teacher.phone1}</span>
                            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                              متاح
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <ViewTeacherButton teacherId={teacher.id} teacherName={teacher.fullName} />
                            <EditTeacherButton teacherId={teacher.id} teacherName={teacher.fullName} />
                            <DeleteTeacherButton teacherId={teacher.id} teacherName={teacher.fullName} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {teachers.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <div className="w-24 h-24 bg-lamaPurpleLight rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-12 h-12 text-lamaYellow" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">لا يوجد معلمين حالياً</h3>
                  <p className="text-slate-500 mb-6">ابدأ بإضافة معلم جديد لبناء فريق تعليمي قوي</p>
                  <Link href="/list/teachers/add">
                    <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white px-6 py-3 rounded-xl">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة أول معلم
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination page={p} count={total} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
