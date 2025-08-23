// صفحة الكشوفات المعتمدة

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Filter, Download, Printer, Eye, CheckCircle, Calendar, User, Loader2 } from "lucide-react"

interface ApprovedTranscript {
  id: number
  studentName: string
  studentId: string
  class: string
  academicYear: string
  semester: string
  approvalDate: string
  approvalStatus: string
  totalGrade: number
  average: number
  subjects: Array<{
    name: string
    grade: number
    maxGrade: number
  }>
  remarks: string
}

export default function ApprovedTranscriptsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [approvedTranscripts, setApprovedTranscripts] = useState<ApprovedTranscript[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // جلب البيانات من API
  useEffect(() => {
    fetchApprovedTranscripts()
  }, [])

  const fetchApprovedTranscripts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (classFilter !== 'all') params.append('classId', classFilter)
      if (yearFilter !== 'all') params.append('year', yearFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/results/approved-transcripts?${params}`)
      if (!response.ok) throw new Error('فشل في جلب البيانات')
      
      const data = await response.json()
      setApprovedTranscripts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    fetchApprovedTranscripts()
  }, [classFilter, yearFilter, searchTerm, fetchApprovedTranscripts])

  const filteredTranscripts = approvedTranscripts.filter(transcript => {
    const matchesSearch = transcript.studentName.includes(searchTerm) || 
                         transcript.studentId.includes(searchTerm)
    const matchesClass = classFilter === "all" || transcript.class === classFilter
    const matchesYear = yearFilter === "all" || transcript.academicYear === yearFilter
    
    return matchesSearch && matchesClass && matchesYear
  })

  const getGradeColor = (grade: number) => {
    if (grade >= 95) return "text-green-600"
    if (grade >= 85) return "text-blue-600"
    if (grade >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBadge = (grade: number) => {
    if (grade >= 95) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">متفوق</Badge>
    if (grade >= 85) return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">ممتاز</Badge>
    if (grade >= 75) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">جيد</Badge>
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">مقبول</Badge>
  }

  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-cairo">الكشوفات المعتمدة</h1>
          <p className="text-gray-600 font-tajawal">عرض وطباعة الكشوفات المعتمدة</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-800 mb-1">إجمالي الكشوفات</h3>
              <p className="text-green-600 font-tajawal">المعتمدة</p>
              <p className="text-sm text-green-500">{approvedTranscripts.length} كشف</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-800 mb-1">الطلاب المتفوقون</h3>
              <p className="text-blue-600 font-tajawal">95% فأعلى</p>
              <p className="text-sm text-blue-500">{approvedTranscripts.filter((t: ApprovedTranscript) => t.average >= 95).length} طالب</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-yellow-800 mb-1">آخر اعتماد</h3>
              <p className="text-yellow-600 font-tajawal">تاريخ</p>
              <p className="text-sm text-yellow-500">2024-01-23</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-purple-800 mb-1">متوسط الدرجات</h3>
              <p className="text-purple-600 font-tajawal">جميع الطلاب</p>
              <p className="text-sm text-purple-500">97.2%</p>
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

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="السنة الدراسية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع السنوات</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                  <SelectItem value="2021-2022">2021-2022</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-lamaYellow hover:bg-lamaYellow/90">
                <Download className="w-4 h-4 ml-2" />
                تصدير جميع الكشوفات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transcripts Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الكشوفات المعتمدة</CardTitle>
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
                <Button onClick={fetchApprovedTranscripts} variant="outline">
                  إعادة المحاولة
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredTranscripts.length === 0 ? (
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
                        <TableHead>السنة الدراسية</TableHead>
                        <TableHead>الفصل الدراسي</TableHead>
                        <TableHead>المعدل العام</TableHead>
                        <TableHead>التقدير</TableHead>
                        <TableHead>تاريخ الاعتماد</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTranscripts.map((transcript) => (
                        <TableRow key={transcript.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{transcript.studentName}</TableCell>
                          <TableCell>{transcript.studentId}</TableCell>
                          <TableCell>{transcript.class}</TableCell>
                          <TableCell>{transcript.academicYear}</TableCell>
                          <TableCell>{transcript.semester}</TableCell>
                          <TableCell className={`font-bold text-lg ${getGradeColor(transcript.average)}`}>
                            {transcript.average}%
                          </TableCell>
                          <TableCell>{getGradeBadge(transcript.average)}</TableCell>
                          <TableCell>{transcript.approvalDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 ml-1" />
                                عرض
                              </Button>
                              <Button size="sm" variant="outline">
                                <Printer className="w-4 h-4 ml-1" />
                                طباعة
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 ml-1" />
                                تحميل
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

        {/* Detailed View Modal Placeholder */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-tajawal">
            اضغط على &quot;عرض&quot; لرؤية تفاصيل الكشف الكاملة مع جميع المواد والدرجات
          </p>
        </div>
      </div>
    </div>
  )
}
