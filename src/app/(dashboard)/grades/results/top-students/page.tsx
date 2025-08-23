"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, TrendingUp, Download, BarChart3, Loader2 } from "lucide-react"

interface TopStudent {
  id: number
  rank: number
  studentName: string
  studentId: string
  class: string
  totalGrade: number
  average: number
  subjects: Record<string, number>
  improvement: string
}

export default function TopStudentsPage() {
  const [classFilter, setClassFilter] = useState("all")
  const [rankFilter, setRankFilter] = useState("all")
  const [topStudents, setTopStudents] = useState<TopStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // جلب البيانات من API
  useEffect(() => {
    fetchTopStudents()
  }, [])

  const fetchTopStudents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (classFilter !== 'all') params.append('classId', classFilter)
      if (rankFilter !== 'all') params.append('limit', rankFilter === 'top3' ? '3' : rankFilter === 'top5' ? '5' : '10')

      const response = await fetch(`/api/results/top-students?${params}`)
      if (!response.ok) throw new Error('فشل في جلب البيانات')
      
      const data = await response.json()
      setTopStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    fetchTopStudents()
  }, [classFilter, rankFilter, fetchTopStudents])

  const filteredStudents = topStudents.filter(student => {
    const matchesClass = classFilter === "all" || student.class === classFilter
    const matchesRank = rankFilter === "all" || 
                       (rankFilter === "top3" && student.rank <= 3) ||
                       (rankFilter === "top5" && student.rank <= 5) ||
                       (rankFilter === "top10" && student.rank <= 10)
    
    return matchesClass && matchesRank
  })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Star className="w-6 h-6 text-orange-500" />
    return <span className="text-lg font-bold text-gray-600">{rank}</span>
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">الأول</Badge>
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">الثاني</Badge>
    if (rank === 3) return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">الثالث</Badge>
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">المرتبة {rank}</Badge>
  }

  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-cairo">كشف الأوائل</h1>
          <p className="text-gray-600 font-tajawal">قائمة الطلاب المتفوقين والأوائل</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-yellow-800 mb-1">الأول</h3>
              <p className="text-yellow-600 font-tajawal">أحمد محمد علي</p>
              <p className="text-sm text-yellow-500">98.5%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6 text-center">
              <Medal className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">الثاني</h3>
              <p className="text-gray-600 font-tajawal">فاطمة أحمد حسن</p>
              <p className="text-sm text-gray-500">97.8%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-orange-800 mb-1">الثالث</h3>
              <p className="text-orange-600 font-tajawal">محمد سعيد عبدالله</p>
              <p className="text-sm text-orange-500">96.4%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-800 mb-1">المتوسط</h3>
              <p className="text-blue-600 font-tajawal">الطلاب الأوائل</p>
              <p className="text-sm text-blue-500">96.7%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              فلاتر البحث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="المرتبة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المراتب</SelectItem>
                  <SelectItem value="top3">أول 3</SelectItem>
                  <SelectItem value="top5">أول 5</SelectItem>
                  <SelectItem value="top10">أول 10</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-lamaYellow hover:bg-lamaYellow/90">
                <Download className="w-4 h-4 ml-2" />
                تصدير النتائج
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلاب الأوائل</CardTitle>
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
                <Button onClick={fetchTopStudents} variant="outline">
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
                        <TableHead>المرتبة</TableHead>
                        <TableHead>اسم الطالب</TableHead>
                        <TableHead>رقم الطالب</TableHead>
                        <TableHead>الصف</TableHead>
                        <TableHead>المعدل العام</TableHead>
                        <TableHead>التحسن</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getRankIcon(student.rank)}
                              {getRankBadge(student.rank)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{student.studentName}</TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell className="font-bold text-lg">{student.average}%</TableCell>
                          <TableCell className="text-green-600 font-medium">{student.improvement}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              عرض التفاصيل
                            </Button>
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
