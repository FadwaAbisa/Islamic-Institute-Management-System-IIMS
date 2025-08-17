"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Search, Filter, Edit, Eye, Trash2, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ViewStudentsPageProps {
  onBack: () => void
}

export default function ViewStudentsPage({ onBack }: ViewStudentsPageProps) {
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const students = [
    {
      id: "001",
      name: "أحمد محمد علي",
      nationalId: "1234567890",
      phone: "0501234567",
      class: "الأولى",
      specialization: "الدراسات الإسلامية",
      status: "نشط",
      enrollmentDate: "2024-09-01",
      gpa: 85.5,
      address: "الرياض، المملكة العربية السعودية",
    },
    {
      id: "002",
      name: "فاطمة أحمد حسن",
      nationalId: "0987654321",
      phone: "0507654321",
      class: "الأولى",
      specialization: "الدراسات الإسلامية",
      status: "نشط",
      enrollmentDate: "2024-09-01",
      gpa: 88.2,
      address: "جدة، المملكة العربية السعودية",
    },
    {
      id: "003",
      name: "محمد عبدالله سالم",
      nationalId: "1122334455",
      phone: "0551122334",
      class: "الثانية",
      specialization: "اللغة العربية",
      status: "نشط",
      enrollmentDate: "2023-09-01",
      gpa: 75.8,
      address: "الدمام، المملكة العربية السعودية",
    },
    {
      id: "004",
      name: "عائشة محمود طه",
      nationalId: "5566778899",
      phone: "0555566778",
      class: "الثانية",
      specialization: "الدراسات الإسلامية",
      status: "متوقف مؤقتاً",
      enrollmentDate: "2023-09-01",
      gpa: 82.1,
      address: "مكة المكرمة، المملكة العربية السعودية",
    },
    {
      id: "005",
      name: "يوسف إبراهيم أحمد",
      nationalId: "9988776655",
      phone: "0509988776",
      class: "الثالثة",
      specialization: "اللغة العربية",
      status: "نشط",
      enrollmentDate: "2022-09-01",
      gpa: 91.3,
      address: "المدينة المنورة، المملكة العربية السعودية",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800"
      case "متوقف مؤقتاً":
        return "bg-yellow-100 text-yellow-800"
      case "منقطع":
        return "bg-red-100 text-red-800"
      case "متخرج":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.includes(searchTerm) &&
      (selectedClass === "all" || student.class === selectedClass) &&
      (selectedSpecialization === "all" || student.specialization === selectedSpecialization) &&
      (selectedStatus === "all" || student.status === selectedStatus),
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
            <Users className="w-6 h-6" />
            عرض الطلاب
          </h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              تصفية الطلاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

              <div>
                <Label htmlFor="class">المرحلة الدراسية</Label>
                <Select onValueChange={setSelectedClass}>
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
                <Label htmlFor="specialization">التخصص</Label>
                <Select onValueChange={setSelectedSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع التخصصات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التخصصات</SelectItem>
                    <SelectItem value="الدراسات الإسلامية">الدراسات الإسلامية</SelectItem>
                    <SelectItem value="اللغة العربية">اللغة العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">الحالة</Label>
                <Select onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="متوقف مؤقتاً">متوقف مؤقتاً</SelectItem>
                    <SelectItem value="منقطع">منقطع</SelectItem>
                    <SelectItem value="متخرج">متخرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">تطبيق التصفية</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <div className="text-sm text-blue-800">إجمالي الطلاب</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.status === "نشط").length}
              </div>
              <div className="text-sm text-green-800">طلاب نشطون</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {students.filter((s) => s.status === "متوقف مؤقتاً").length}
              </div>
              <div className="text-sm text-yellow-800">متوقفون مؤقتاً</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(1)}
              </div>
              <div className="text-sm text-purple-800">متوسط الدرجات</div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>قائمة الطلاب</CardTitle>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                إضافة طالب جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطالب</TableHead>
                  <TableHead className="text-right">اسم الطالب</TableHead>
                  <TableHead className="text-right">رقم الهوية</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">المرحلة</TableHead>
                  <TableHead className="text-right">التخصص</TableHead>
                  <TableHead className="text-right">المعدل</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.nationalId}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.specialization}</TableCell>
                    <TableCell>
                      <span className="font-bold">{student.gpa.toFixed(1)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md" dir="rtl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل الطالب</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <strong>الاسم:</strong> {student.name}
                              </div>
                              <div>
                                <strong>رقم الطالب:</strong> {student.id}
                              </div>
                              <div>
                                <strong>رقم الهوية:</strong> {student.nationalId}
                              </div>
                              <div>
                                <strong>رقم الهاتف:</strong> {student.phone}
                              </div>
                              <div>
                                <strong>المرحلة الدراسية:</strong> {student.class}
                              </div>
                              <div>
                                <strong>التخصص:</strong> {student.specialization}
                              </div>
                              <div>
                                <strong>تاريخ التسجيل:</strong> {student.enrollmentDate}
                              </div>
                              <div>
                                <strong>المعدل التراكمي:</strong> {student.gpa.toFixed(1)}
                              </div>
                              <div>
                                <strong>العنوان:</strong> {student.address}
                              </div>
                              <div>
                                <strong>الحالة:</strong>
                                <Badge className={`mr-2 ${getStatusColor(student.status)}`}>{student.status}</Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
