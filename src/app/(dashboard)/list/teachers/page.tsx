import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Plus, Users, Eye, Edit } from "lucide-react"

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky to-lamaYellow text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-2 rounded-full"></div>
            <p className="text-white/90 text-lg">إدارة المعلمين</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Teacher Card */}
          <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-lamaYellow font-bold">إضافة معلم جديد</CardTitle>
              <p className="text-gray-600">إضافة معلم جديد للنظام مع جميع البيانات المطلوبة</p>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/list/teachers/add">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300">
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة معلم جديد
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* View Teachers Card */}
          <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-lamaYellow font-bold">عرض المعلمين</CardTitle>
              <p className="text-gray-600">عرض قائمة جميع المعلمين مع إمكانية البحث والتصفية</p>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/list/teachers/view_teachers">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300">
                  <Eye className="w-5 h-5 ml-2" />
                  عرض المعلمين
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-lamaYellow font-bold">إجراءات سريعة</CardTitle>
              <p className="text-gray-600">إجراءات سريعة لإدارة المعلمين</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/list/teachers/view_teachers" className="block">
                <Button variant="outline" className="w-full border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض قائمة المعلمين
                </Button>
              </Link>
              <Link href="/list/teachers/add" className="block">
                <Button variant="outline" className="w-full border-lamaSky text-lamaSky hover:bg-lamaSky hover:text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة معلم جديد
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-8">
          <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-lamaYellow font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                معلومات عن نظام إدارة المعلمين
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-lamaYellow mb-3">الميزات المتاحة:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaYellow rounded-full"></div>
                      إضافة معلمين جدد مع نموذج متعدد الخطوات
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaYellow rounded-full"></div>
                      عرض قائمة المعلمين مع البحث والتصفية
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaYellow rounded-full"></div>
                      عرض تفاصيل كاملة لكل معلم
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaYellow rounded-full"></div>
                      تعديل بيانات المعلمين
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaYellow rounded-full"></div>
                      حذف المعلمين مع تأكيد
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-lamaYellow mb-3">البيانات المدعومة:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
                      المعلومات الشخصية والهوية
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
                      معلومات الاتصال والطوارئ
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
                      البيانات الوظيفية والتواريخ
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
                      المؤهلات العلمية والتخصصات
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
                      المواد الدراسية والمراحل
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
