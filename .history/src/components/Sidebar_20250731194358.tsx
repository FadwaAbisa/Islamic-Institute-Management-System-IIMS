"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronLeft } from "lucide-react"
import Image from "next/image"

const Sidebar = () => {
  const [isStudentsOpen, setIsStudentsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      title: "الرئيسية",
      href: "/admin",
      icon: "/home.png",
    },
    {
      title: "المعلمين",
      href: "/list/teachers",
      icon: "/teacher.png",
    },
    {
      title: "الطلاب",
      icon: "/student.png",
      hasDropdown: true,
      subItems: [
        {
          title: "إضافة طالب",
          href: "/list/students/add",
        },
        {
          title: "إضافة الدرجات",
          href: "/list/students/grades",
        },
        {
          title: "طلبات المراجعة",
          href: "/list/students/reviews",
        },
        {
          title: "استعراض النتائج",
          href: "/list/students/results",
        },
        {
          title: "عرض الطلاب",
          href: "/list/students",
        },
        {
          title: "عرض الطلاب",
          href: "/list/students",
        },
      ],
    },
    {
      title: "أولياء الأمور",
      href: "/list/parents",
      icon: "/parent.png",
    },
    {
      title: "المواد الدراسية",
      href: "/list/subjects",
      icon: "/subject.png",
    },
    {
      title: "الفصول",
      href: "/list/classes",
      icon: "/class.png",
    },
    {
      title: "الدروس",
      href: "/list/lessons",
      icon: "/lesson.png",
    },
    {
      title: "الامتحانات",
      href: "/list/exams",
      icon: "/exam.png",
    },
    {
      title: "الواجبات",
      href: "/list/assignments",
      icon: "/assignment.png",
    },
    {
      title: "النتائج",
      href: "/list/results",
      icon: "/result.png",
    },
    {
      title: "الحضور",
      href: "/list/attendance",
      icon: "/attendance.png",
    },
    {
      title: "الفعاليات",
      href: "/list/events",
      icon: "/calendar.png",
    },
  ]

  const isStudentPath = pathname.startsWith("/list/students")

  return (
    <div
      className="bg-white h-screen w-64 fixed left-0 top-0 overflow-y-auto border-l border-gray-200 font-cairo"
      dir="rtl"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <span className="text-amber-600 font-bold text-lg">🏛️</span>
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-800 font-cairo">المعهد المتوسط</h2>
            <p className="text-xs text-gray-500 font-tajawal">للدراسات الإسلامية</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index} className="px-4">
              {item.hasDropdown ? (
                <div>
                  {/* Students Main Item */}
                  <button
                    onClick={() => setIsStudentsOpen(!isStudentsOpen)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group font-cairo ${
                      isStudentPath
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <Image
                          src={item.icon || "/placeholder.svg"}
                          alt=""
                          width={20}
                          height={20}
                          className="opacity-70 group-hover:opacity-100"
                        />
                      </div>
                      <span className="font-medium text-sm arabic-text">{item.title}</span>
                    </div>
                    <div className="transition-transform duration-200">
                      {isStudentsOpen || isStudentPath ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronLeft className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {(isStudentsOpen || isStudentPath) && (
                    <div className="mt-2 mr-8 space-y-1 border-r-2 border-gray-100 pr-4">
                      {item.subItems?.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={`block p-2 rounded-md text-sm transition-all duration-200 font-tajawal ${
                            pathname === subItem.href
                              ? "bg-amber-50 text-amber-700 font-medium border-r-2 border-amber-500"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-current rounded-full opacity-50"></div>
                            <span className="arabic-text">{subItem.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group font-cairo ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      alt=""
                      width={20}
                      height={20}
                      className="opacity-70 group-hover:opacity-100"
                    />
                  </div>
                  <span className="font-medium text-sm arabic-text">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
