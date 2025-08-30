"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, FileText, ClipboardCheck, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardCards() {
  const studentManagementItems = [
    {
      id: "add-student",
      title: "إضافة طالب",
      icon: UserPlus,
      href: "/admin/students/add",
      description: "إضافة طالب جديد للنظام",
    },
    {
      id: "students-list",
      title: "عرض الطلاب",
      icon: Users,
      href: "/admin/students/list",
      description: "عرض وإدارة قائمة الطلاب",
    },
    {
      id: "add-grades",
      title: "إضافة الدرجات",
      icon: FileText,
      href: "/admin/students/grades",
      description: "إدخال درجات الطلاب",
    },
    {
      id: "review-requests",
      title: "طلبات المراجعة",
      icon: ClipboardCheck,
      href: "/admin/students/reviews",
      description: "مراجعة طلبات تعديل الدرجات",
    },
    {
      id: "view-results",
      title: "استعراض النتائج",
      icon: BarChart3,
      href: "/admin/students/results",
      description: "عرض نتائج الطلاب والإحصائيات",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {studentManagementItems.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.id} className="hover:shadow-lg transition-shadow border-r-4 border-r-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Icon className="w-6 h-6 text-amber-600" />
                {item.title}
              </CardTitle>
              <p className="text-sm text-gray-600">{item.description}</p>
            </CardHeader>
            <CardContent>
              <Link href={item.href}>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">الدخول</Button>
              </Link>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
