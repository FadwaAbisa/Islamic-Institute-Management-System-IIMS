import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Eye, Edit, Trash2 } from "lucide-react"

const mockStudents = [
  {
    id: 1,
    name: "أحمد محمد علي السعيد",
    nationalId: "1234567890",
    level: "السنة الثانية",
    branch: "الدراسات الإسلامية",
    status: "مستمر",
    phone: "0501234567",
  },
  {
    id: 2,
    name: "فاطمة عبدالله حسن النور",
    nationalId: "0987654321",
    level: "السنة الأولى",
    branch: "القراءات",
    status: "مستمر",
    phone: "0507654321",
  },
  {
    id: 3,
    name: "محمد عبدالرحمن أحمد الزهراني",
    nationalId: "1122334455",
    level: "السنة الثالثة",
    branch: "الدراسات الإسلامية",
    status: "منقطع",
    phone: "0501122334",
  },
]

export default function StudentsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "مستمر":
        return "bg-green-100 text-green-800"
      case "منقطع":
        return "bg-red-100 text-red-800"
      case "موقوف":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky to-lamaYellow text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-2 rounded-full"></div>
            <p className="text-white/90 text-lg">قائمة الطلاب</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl text-lamaYellow font-bold">عرض الطلاب</CardTitle>
              </div>
              <Link href="/add-student">
                <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة طالب جديد
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="البحث بالاسم أو رقم الهوية..." className="pr-10" />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم الكامل</TableHead>
                    <TableHead className="text-right">رقم الهوية</TableHead>
                    <TableHead className="text-right">المستوى</TableHead>
                    <TableHead className="text-right">الشعبة</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">رقم الهاتف</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.nationalId}</TableCell>
                      <TableCell>{student.level}</TableCell>
                      <TableCell>{student.branch}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                      </TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
