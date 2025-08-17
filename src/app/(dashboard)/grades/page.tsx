import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  UserPlus, 
  ClipboardList, 
  Users, 
  FileSearch,
  BookOpen
} from "lucide-react";

export default function GradesPage() {
  const menuItems = [
    {
      title: "إضافة الدرجات",
      description: "إضافة وتحديث درجات الطلاب",
      href: "/grades/add-grades",
      icon: GraduationCap,
      color: "bg-blue-500"
    },
    {
      title: "إضافة طالب",
      description: "تسجيل طالب جديد في النظام",
      href: "/grades/add-student", 
      icon: UserPlus,
      color: "bg-green-500"
    },
    {
      title: "عرض النتائج",
      description: "مراجعة وعرض نتائج الطلاب",
      href: "/grades/results",
      icon: ClipboardList,
      color: "bg-purple-500"
    },
    {
      title: "إدارة الطلاب", 
      description: "عرض وإدارة بيانات الطلاب",
      href: "/grades/students",
      icon: Users,
      color: "bg-orange-500"
    },
    {
      title: "مراجعة الطلبات",
      description: "مراجعة طلبات التعديل والاستعلامات",
      href: "/grades/review-requests",
      icon: FileSearch,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">نظام إدارة الدرجات</h1>
        </div>
        <p className="text-gray-600 text-lg">إدارة شاملة لدرجات ونتائج الطلاب</p>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
              <CardHeader className="pb-4">
                <div className="flex items-center mb-3">
                  <div className={`${item.color} p-3 rounded-lg mr-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={item.href}>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    size="lg"
                  >
                    الدخول للقسم
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">5</CardTitle>
            <CardDescription>الأقسام المتاحة</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600">∞</CardTitle>
            <CardDescription>الطلاب المسجلين</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="text-center">  
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-600">24/7</CardTitle>
            <CardDescription>متاح دائماً</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 py-8 border-t border-gray-200">
        <p className="text-gray-500">
          نظام إدارة الدرجات - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}