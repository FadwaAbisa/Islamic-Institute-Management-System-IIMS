"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, FileText, Search, Plus } from "lucide-react"

interface AddGradesPageProps {
  onBack: () => void
}

export default function AddGradesPage({ onBack }: AddGradesPageProps) {
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const students = [
    { id: "001", name: "أحمد محمد علي", class: "الأولى", specialization: "الدراسات الإسلامية" },
    { id: "002", name: "فاطمة أحمد حسن", class: "الأولى", specialization: "الدراسات الإسلامية" },
    { id: "003", name: "محمد عبدالله سالم", class: "الثانية", specialization: "اللغة العربية" },
    { id: "004", name: "عائشة محمود طه", class: "الثانية", specialization: "الدراسات الإسلامية" },
    { id: "005", name: "يوسف إبراهيم أحمد", class: "الثالثة", specialization: "اللغة العربية" },
  ]

  const subjects = [
    "القرآن الكريم وعلومه",
    "الحديث الشريف",
    "الفقه الإسلامي",
    "العقيدة الإسلامية",
    "اللغة العربية",
    "التاريخ الإسلامي",
    "الأخلاق والآداب",
  ]

  const filteredStudents = students.filter(
    (student) => student.name.includes(searchTerm) && (selectedClass === "all" || student.class === selectedClass),
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
            <FileText className="w-6 h-6" />
            إضافة الدرجات
          </h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>تصفية الطلاب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Label htmlFor="subject">المادة</Label>
                <Select onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
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
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلاب والدرجات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطالب</TableHead>
                  <TableHead className="text-right">اسم الطالب</TableHead>
                  <TableHead className="text-right">المرحلة</TableHead>
                  <TableHead className="text-right">التخصص</TableHead>
                  <TableHead className="text-right">درجة الأعمال (30)</TableHead>
                  <TableHead className="text-right">درجة النهائي (70)</TableHead>
                  <TableHead className="text-right">المجموع (100)</TableHead>
                  <TableHead className="text-right">التقدير</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.specialization}</TableCell>
                    <TableCell>
                      <Input type="number" placeholder="0-30" className="w-20" max="30" min="0" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" placeholder="0-70" className="w-20" max="70" min="0" />
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">--</span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-sm bg-gray-100">--</span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        حفظ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            حفظ جميع الدرجات
          </Button>
        </div>
      </div>
    </div>
  )
}
