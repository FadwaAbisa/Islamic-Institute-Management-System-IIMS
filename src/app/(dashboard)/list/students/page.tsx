"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import TableSearch from "@/components/TableSearch"
import StudentsFilters from "@/components/StudentsFilters"
import Pagination from "@/components/Pagination"

interface Student {
  id: string;
  fullName: string;
  nationalId: string;
  studyLevel: string | null;
  specialization: string | null;
  studentStatus: string | null;
  studentPhone: string | null;
}

export default function StudentsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    academicYear: "الكل",
    stage: "الكل",
    gender: "الكل",
    status: "الكل"
  });

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
      return;
    }
  }, [isLoaded, user, router]);

  // جلب الطلاب
  const fetchStudents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/students');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في جلب الطلاب');
      }

      const data = await response.json();
      setStudents(data);
      setTotal(data.length); // مؤقتاً
    } catch (err) {
      console.error('خطأ في جلب الطلاب:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user, page, search, filters]);

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
            {/* Search & Filters */}
            <div className="mb-6 flex flex-col gap-4">
              <TableSearch />
              <StudentsFilters years={[]} stages={[]} />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lamaSky mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري تحميل الطلاب...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <div className="text-red-600 text-lg mb-4">❌ {error}</div>
                <Button onClick={fetchStudents} className="bg-lamaSky hover:bg-lamaSky/90">
                  إعادة المحاولة
                </Button>
              </div>
            )}

            {/* Students Table */}
            {!loading && !error && (
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
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>{student.nationalId}</TableCell>
                        <TableCell>{student.studyLevel || "غير محدد"}</TableCell>
                        <TableCell>{student.specialization || "غير محدد"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(student.studentStatus || "مستمر")}>
                            {student.studentStatus || "مستمر"}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.studentPhone || ""}</TableCell>
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
            )}
          </CardContent>
        </Card>
        <Pagination page={page} count={total} />
      </div>
    </div>
  )
}
