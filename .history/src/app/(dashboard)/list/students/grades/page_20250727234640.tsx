import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GraduationCap, Save } from "lucide-react"

const mockStudents = [
  { id: 1, name: "أحمد محمد علي السعيد", nationalId: "1234567890" },
  { id: 2, name: "فاطمة عبدالله حسن النور", nationalId: "0987654321" },
  { id: 3, name: "محمد عبدالرحمن أحمد الزهراني", nationalId: "1122334455" },
]

const subjects = [
  "التفسير وعلوم القرآن",
  "الحديث وعلومه",
  "الفقه وأصوله",
  "العقيدة والمذاهب المعاصرة",
  "اللغة العربية",
  "التاريخ الإسلامي",
]

export default function AddGradesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky to-lamaYellow text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-2 rounded-full"></div>
            <p className="text-white/90 text-lg">إضافة الدرجات</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-lamaYellow font-bold">إضافة الدرجات</CardTitle>
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
                <Label htmlFor="subject">المادة</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject, index) => (
                      <SelectItem key={index} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grades Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الطالب</TableHead>
                    <TableHead className="text-right">رقم الهوية</TableHead>
                    <TableHead className="text-right">أعمال السنة (30)</TableHead>
                    <TableHead className="text-right">الامتحان النهائي (70)</TableHead>
                    <TableHead className="text-right">المجموع (100)</TableHead>
                    <TableHead className="text-right">التقدير</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.nationalId}</TableCell>
                      <TableCell>
                        <Input type="number" min="0" max="30" placeholder="0-30" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" max="70" placeholder="0-70" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min="0" max="100" placeholder="0-100" className="w-20" disabled />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">-</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between mt-6">
              <Link href="/">
                <Button className="bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight hover:from-lamaYellowLight hover:to-lamaSkyLight text-lamaYellow border border-lamaSky font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300">
                  العودة للرئيسية
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300">
                <Save className="w-4 h-4 ml-2" />
                حفظ الدرجات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
