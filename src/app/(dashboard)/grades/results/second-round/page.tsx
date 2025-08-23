"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle, XCircle, Search, Filter, Download, Mail, Phone, Loader2 } from "lucide-react"

interface SecondRoundStudent {
  id: number
  studentName: string
  studentId: string
  class: string
  failedSubjects: string[]
  currentGrades: Record<string, number>
  requiredGrades: Record<string, number>
  status: string
  examDate: string
  contactInfo: {
    phone: string
    email: string
  }
}

export default function SecondRoundPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [secondRoundStudents, setSecondRoundStudents] = useState<SecondRoundStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // جلب البيانات من API
  useEffect(() => {
    fetchSecondRoundStudents()
  }, [])

  const fetchSecondRoundStudents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (classFilter !== 'all') params.append('classId', classFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/results/second-round?${params}`)
      if (!response.ok) throw new Error('فشل في جلب البيانات')
      
      const data = await response.json()
      setSecondRoundStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    fetchSecondRoundStudents()
  }, [statusFilter, classFilter, searchTerm, fetchSecondRoundStudents])

  const filteredStudents = secondRoundStudents.filter(student => {
    const matchesSearch = student.studentName.includes(searchTerm) || 
                         student.studentId.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    const matchesClass = classFilter === "all" || student.class === classFilter
    
    return matchesSearch && matchesStatus && matchesClass
  })

  const getStatusBadge = (status: string) => {
    if (status === "قيد الدراسة") {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">قيد الدراسة</Badge>
    } else if (status === "تم الاختبار") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">تم الاختبار</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد المراجعة</Badge>
    }
  }

  const getGradeColor = (grade: number, required: number) => {
    if (grade >= required) return "text-green-600"
    if (grade < required) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-cairo">طلاب الدور الثاني</h1>
          <p className="text-gray-600 font-tajawal">قائمة الطلاب المؤجلين للدور الثاني</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-red-800 mb-1">إجمالي الطلاب</h3>
              <p className="text-red-600 font-tajawal">طلاب الدور الثاني</p>
              <p className="text-sm text-red-500">{secondRoundStudents.length} طالب</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-800 mb-1">قيد الدراسة</h3>
              <p className="text-blue-600 font-tajawal">يستعدون للاختبار</p>
              <p className="text-sm text-blue-500">{secondRoundStudents.filter(s => s.status === "قيد الدراسة").length} طالب</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-800 mb-1">تم الاختبار</h3>
              <p className="text-green-600 font-tajawal">أكملوا الاختبار</p>
              <p className="text-sm text-green-500">0 طالب</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6 text-center">
              <XCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-yellow-800 mb-1">متوسط الدرجات</h3>
              <p className="text-yellow-600 font-tajawal">المواد المؤجلة</p>
              <p className="text-sm text-yellow-500">52.5%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              فلاتر البحث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث عن طالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="قيد الدراسة">قيد الدراسة</SelectItem>
                  <SelectItem value="تم الاختبار">تم الاختبار</SelectItem>
                  <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الصف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الصفوف</SelectItem>
                  <SelectItem value="الصف العاشر أ">الصف العاشر أ</SelectItem>
                  <SelectItem value="الصف العاشر ب">الصف العاشر ب</SelectItem>
                  <SelectItem value="الصف العاشر ج">الصف العاشر ج</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-lamaYellow hover:bg-lamaYellow/90">
                <Download className="w-4 h-4 ml-2" />
                تصدير النتائج
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة طلاب الدور الثاني</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-lamaYellow" />
                <span className="mr-2 text-gray-600">جاري التحميل...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchSecondRoundStudents} variant="outline">
                  إعادة المحاولة
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">لا توجد بيانات للعرض</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم الطالب</TableHead>
                        <TableHead>رقم الطالب</TableHead>
                        <TableHead>الصف</TableHead>
                        <TableHead>المواد المؤجلة</TableHead>
                        <TableHead>الدرجات الحالية</TableHead>
                        <TableHead>الدرجات المطلوبة</TableHead>
                        <TableHead>تاريخ الاختبار</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>معلومات الاتصال</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{student.studentName}</TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {student.failedSubjects.map(subject => (
                                <Badge key={subject} variant="destructive" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              {student.failedSubjects.map(subject => (
                                <div key={subject} className={getGradeColor(student.currentGrades[subject], student.requiredGrades[subject])}>
                                  {subject}: {student.currentGrades[subject]}%
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm text-gray-600">
                              {student.failedSubjects.map(subject => (
                                <div key={subject}>
                                  {subject}: {student.requiredGrades[subject]}%
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{student.examDate}</TableCell>
                          <TableCell>{getStatusBadge(student.status)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="w-3 h-3" />
                                {student.contactInfo.phone}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="w-3 h-3" />
                                {student.contactInfo.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                تعديل الدرجات
                              </Button>
                              <Button size="sm" variant="outline">
                                إرسال إشعار
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
