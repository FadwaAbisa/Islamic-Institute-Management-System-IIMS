"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Search, Download, Filter } from "lucide-react"

interface ViewResultsPageProps {
  onBack: () => void
}

export default function ViewResultsPage({ onBack }: ViewResultsPageProps) {
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const results = [
    {
      id: "001",
      name: "أحمد محمد علي",
      class: "الأولى",
      specialization: "الدراسات الإسلامية",
      subjects: {
        "القرآن الكريم": { coursework: 25, final: 60, total: 85, grade: "امتياز" },
        "الحديث الشريف": { coursework: 22, final: 55, total: 77, grade: "جيد جداً" },
        "الفقه الإسلامي": { coursework: 28, final: 65, total: 93, grade: "امتياز" },
      },
      gpa: 85.0,
      status: "ناجح",
    },
    {
      id: "002",
      name: "فاطمة أحمد حسن",
      class: "الأولى",
      specialization: "الدراسات الإسلامية",
      subjects: {
        "القرآن الكريم": { coursework: 27, final: 58, total: 85, grade: "امتياز" },
        "الحديث الشريف": { coursework: 24, final: 52, total: 76, grade: "جيد جداً" },
        "الفقه الإسلامي": { coursework: 26, final: 62, total: 88, grade: "امتياز" },
      },
      gpa: 83.0,
      status: "ناجح",
    },
    {
      id: "003",
      name: "محمد عبدالله سالم",
      class: "الثانية",
      specialization: "اللغة العربية",
      subjects: {
        "اللغة العربية": { coursework: 20, final: 45, total: 65, grade: "جيد" },
        "النحو والصرف": { coursework: 18, final: 42, total: 60, grade: "مقبول" },
        البلاغة: { coursework: 23, final: 48, total: 71, grade: "جيد" },
      },
      gpa: 65.3,
      status: "ناجح",
    },
  ]

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "امتياز":
        return "bg-green-100 text-green-800"
      case "جيد جداً":
        return "bg-blue-100 text-blue-800"
      case "جيد":
        return "bg-yellow-100 text-yellow-800"
      case "مقبول":
        return "bg-orange-100 text-orange-800"
      case "راسب":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "ناجح" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const filteredResults = results.filter(
    (result) => result.name.includes(searchTerm) && (selectedClass === "all" || result.class === selectedClass),
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-amber-600 text-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-amber-700">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          <div className="text-sm">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-amber-600 mb-2 flex items-center justify-center gap-2">
            <BarChart3 className="w-6 h-6" />
            استعراض النتائج
          </h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              تصفية النتائج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="class">المرحلة الدراسية</Label>
                <Select onValueChange={setSelectedClass} value={selectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المراحل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المراحل</SelectItem>
                    <SelectItem value="الأولى">الأولى</SelectItem>
                    <SelectItem value="الثانية">الثانية</SelectItem>
                    <SelectItem value="الثالثة">الثالثة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="search">البحث بالاسم</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="ابحث عن طالب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">تطبيق التصفية</Button>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  تصدير النتائج
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter((r) => r.status === "ناجح").length}
              </div>
              <div className="text-sm text-green-800">طلاب ناجحون</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{results.filter((r) => r.status === "راسب").length}</div>
              <div className="text-sm text-red-800">طلاب راسبون</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(results.reduce((sum, r) => sum + r.gpa, 0) / results.length).toFixed(1)}
              </div>
              <div className="text-sm text-blue-800">متوسط الدرجات العام</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{results.length}</div>
              <div className="text-sm text-purple-800">إجمالي الطلاب</div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل النتائج</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطالب</TableHead>
                  <TableHead className="text-right">اسم الطالب</TableHead>
                  <TableHead className="text-right">المرحلة</TableHead>
                  <TableHead className="text-right">التخصص</TableHead>
                  <TableHead className="text-right">المعدل العام</TableHead>
                  <TableHead className="text-right">التقدير العام</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => {
                  const overallGrade =
                    result.gpa >= 90
                      ? "امتياز"
                      : result.gpa >= 80
                        ? "جيد جداً"
                        : result.gpa >= 70
                          ? "جيد"
                          : result.gpa >= 60
                            ? "مقبول"
                            : "راسب"

                  return (
                    <TableRow key={result.id}>
                      <TableCell>{result.id}</TableCell>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.class}</TableCell>
                      <TableCell>{result.specialization}</TableCell>
                      <TableCell>
                        <span className="font-bold">{result.gpa.toFixed(1)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(overallGrade)}>{overallGrade}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            عرض التفاصيل
                          </Button>
                          <Button size="sm" variant="outline">
                            طباعة الشهادة
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
