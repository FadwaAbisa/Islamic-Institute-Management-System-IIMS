import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Search, Download } from "lucide-react"

const mockResults = [
  {
    id: 1,
    studentName: "أحمد محمد علي السعيد",
    nationalId: "1234567890",
    level: "السنة الثانية",
    gpa: 3.75,
    status: "ناجح",
    totalHours: 18,
    passedHours: 18,
  },
  {
    id: 2,
    studentName: "فاطمة عبدالله حسن النور",
    nationalId: "0987654321",
    level: "السنة الأولى",
    gpa: 4.0,
    status: "ناجح",
    totalHours: 16,
    passedHours: 16,
  },
  {
    id: 3,
    studentName: "محمد عبدالرحمن أحمد الزهراني",
    nationalId: "1122334455",
    level: "السنة الثالثة",
    gpa: 2.25,
    status: "راسب",
    totalHours: 20,
    passedHours: 14,
  },
]

export default function ResultsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ناجح":
        return "bg-green-100 text-green-800"
      case "راسب":
        return "bg-red-100 text-red-800"
      case "منسحب":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600 font-bold"
    if (gpa >= 2.5) return "text-yellow-600 font-bold"
    return "text-red-600 font-bold"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky to-lamaYellow text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-2 rounded-full"></div>
            <p className="text-white/90 text-lg">استعراض النتائج</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-lamaYellow font-bold">استعراض النتائج</CardTitle>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300">
                <Download className="w-4 h-4 ml-2" />
                تصدير النتائج
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="academicYear">العام الدراسي</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العام" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">الفصل الدراسي</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفصل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">الفصل الأول</SelectItem>
                    <SelectItem value="second">الفصل الثاني</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">المستوى</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">السنة الأولى</SelectItem>
                    <SelectItem value="second">السنة الثانية</SelectItem>
                    <SelectItem value="third">السنة الثالثة</SelectItem>
                    <SelectItem value="fourth">السنة الرابعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">البحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="البحث بالاسم أو رقم الهوية..." className="pr-10" />
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الطالب</TableHead>
                    <TableHead className="text-right">رقم الهوية</TableHead>
                    <TableHead className="text-right">المستوى</TableHead>
                    <TableHead className="text-right">المعدل التراكمي</TableHead>
                    <TableHead className="text-right">الساعات المجتازة</TableHead>
                    <TableHead className="text-right">إجمالي الساعات</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.studentName}</TableCell>
                      <TableCell>{result.nationalId}</TableCell>
                      <TableCell>{result.level}</TableCell>
                      <TableCell className={getGPAColor(result.gpa)}>{result.gpa.toFixed(2)}</TableCell>
                      <TableCell>{result.passedHours}</TableCell>
                      <TableCell>{result.totalHours}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card className="border-2 border-lamaSkyLight bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">2</div>
                  <div className="text-sm text-lamaYellow font-medium">طلاب ناجحون</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-lamaSkyLight bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">1</div>
                  <div className="text-sm text-lamaYellow font-medium">طلاب راسبون</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-lamaSkyLight bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3.33</div>
                  <div className="text-sm text-lamaYellow font-medium">متوسط المعدل</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-lamaSkyLight bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">66.7%</div>
                  <div className="text-sm text-lamaYellow font-medium">نسبة النجاح</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight hover:from-lamaYellowLight hover:to-lamaSkyLight text-lamaYellow border border-lamaSky font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
