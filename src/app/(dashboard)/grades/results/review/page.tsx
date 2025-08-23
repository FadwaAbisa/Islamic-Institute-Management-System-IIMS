"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Eye, Edit, Loader2 } from "lucide-react"

interface ReviewData {
  id: number
  studentName: string
  studentId: string
  class: string
  subject: string
  currentGrade: number
  previousGrade: number
  difference: number
  status: string
  reviewDate: string
}

export default function ReviewPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [reviewData, setReviewData] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // جلب البيانات من API
  useEffect(() => {
    fetchReviewData()
  }, [])

  const fetchReviewData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (classFilter !== 'all') params.append('classId', classFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/results/review?${params}`)
      if (!response.ok) throw new Error('فشل في جلب البيانات')
      
      const data = await response.json()
      setReviewData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    fetchReviewData()
  }, [statusFilter, classFilter, searchTerm, fetchReviewData])

  const filteredData = reviewData.filter(item => {
    const matchesSearch = item.studentName.includes(searchTerm) || 
                         item.studentId.includes(searchTerm) ||
                         item.subject.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesClass = classFilter === "all" || item.class === classFilter
    
    return matchesSearch && matchesStatus && matchesClass
  })

  const getStatusBadge = (status: string) => {
    if (status === "مقبول") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">مقبول</Badge>
    } else if (status === "مرفوض") {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">مرفوض</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد المراجعة</Badge>
    }
  }

  const getDifferenceColor = (difference: number) => {
    if (difference > 0) return "text-green-600"
    if (difference < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-cairo">كشف المراجعة</h1>
          <p className="text-gray-600 font-tajawal">مراجعة وتدقيق درجات الطلاب</p>
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
                  placeholder="البحث عن طالب أو مادة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="حالة المراجعة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مقبول">مقبول</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
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

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>نتائج المراجعة</CardTitle>
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
                <Button onClick={fetchReviewData} variant="outline">
                  إعادة المحاولة
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredData.length === 0 ? (
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
                        <TableHead>المادة</TableHead>
                        <TableHead>الدرجة الحالية</TableHead>
                        <TableHead>الدرجة السابقة</TableHead>
                        <TableHead>الفرق</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ المراجعة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.studentName}</TableCell>
                          <TableCell>{item.studentId}</TableCell>
                          <TableCell>{item.class}</TableCell>
                          <TableCell>{item.subject}</TableCell>
                          <TableCell className="font-bold">{item.currentGrade}</TableCell>
                          <TableCell>{item.previousGrade}</TableCell>
                          <TableCell className={`font-bold ${getDifferenceColor(item.difference)}`}>
                            {item.difference > 0 ? `+${item.difference}` : item.difference}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.reviewDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
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
