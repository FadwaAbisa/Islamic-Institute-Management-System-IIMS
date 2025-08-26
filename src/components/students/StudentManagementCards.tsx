"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, FileText, ClipboardCheck, BarChart3, Users } from "lucide-react"
import Link from "next/link"

export default function StudentManagementCards() {
  const studentCards = [
    {
      id: "add-student",
      title: "إضافة طالب",
      icon: UserPlus,
      href: "/list/students/add",
      description: "إضافة طالب جديد للنظام",
    },
    {
      id: "add-grades",
      title: "إضافة الدرجات",
      icon: FileText,
      href: "/list/students/grades",
      description: "إدخال درجات الطلاب",
    },
    {
      id: "review-requests",
      title: "طلبات المراجعة",
      icon: ClipboardCheck,
      href: "/list/students/reviews",
      description: "مراجعة طلبات تعديل الدرجات",
    },
    {
      id: "view-students",
      title: "عرض الطلاب",
      icon: Users,
      href: "/list/students",
      description: "عرض وإدارة قائمة الطلاب",
    },
    {
      id: "view-results",
      title: "استعراض النتائج",
      icon: BarChart3,
      href: "/list/students/results",
      description: "عرض نتائج الطلاب والإحصائيات",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6" dir="rtl">
      {studentCards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.id}
            className="bg-white border-2 border-orange-200 hover:border-orange-400 transition-all duration-200 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon */}
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-orange-600" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Icon className="w-5 h-5 text-orange-600" />
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>

                {/* Button */}
                <Link href={card.href} className="w-full">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors">
                    الدخول
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
