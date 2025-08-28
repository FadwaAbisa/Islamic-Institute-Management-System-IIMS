"use client";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Home, Users, GraduationCap, UserCheck, BookOpen, Calendar, MessageSquare, Bell, User, Settings, LogOut, Plus, FileText, ClipboardCheck, BarChart3, Menu as MenuIcon, X } from "lucide-react";
import { hasPermission, UserRole } from "@/lib/permissions";

const menuItems = [
  {
    title: "القائمة الرئيسية",
    icon: Home,
    items: [
      {
        icon: "/home.png",
        label: "الرئيسية",
        href: "/",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "الصفحة الرئيسية للنظام",
        color: "bg-blue-50 text-blue-600"
      },
      {
        icon: "/teacher.png",
        label: "المعلمين",
        href: "/list/teachers",
        visible: ["admin"],
        description: "إدارة المعلمين",
        color: "bg-green-50 text-green-600",
        hasDropdown: true,
        subItems: [
          {
            icon: Plus,
            label: "إضافة معلم",
            href: "/list/teachers/add",
            description: "إضافة معلم جديد"
          },
          {
            icon: Users,
            label: "قائمة المعلمين",
            href: "/list/teachers/view_teachers",
            description: "عرض جميع المعلمين"
          },
          {
            icon: FileText,
            label: "تقارير المعلمين",
            href: "/list/teachers/reports",
            description: "تقارير أداء المعلمين"
          }
        ]
      },
      {
        icon: "/student.png",
        label: "الطلاب",
        href: "/list/students",
        visible: ["admin", "staff"],
        description: "إدارة الطلاب",
        color: "bg-purple-50 text-purple-600",
        hasDropdown: true,
        subItems: [
          {
            icon: Plus,
            label: "إضافة طالب",
            href: "/list/students/add",
            description: "تسجيل طالب جديد"
          },
          {
            icon: BarChart3,
            label: "إضافة درجات حسب المقرر",
            href: "/list/students/grades",
            description: "إدخال درجات الطلاب"
          },
          {
            icon: ClipboardCheck,
            label: "طلبات المراجعة",
            href: "/list/students/reviews",
            description: "مراجعة طلبات الطلاب"
          },
          {
            icon: Users,
            label: "قائمة الطلاب",
            href: "/list/students/view_student",
            description: "عرض جميع الطلاب"
          },
          {
            icon: Users,
            label: "استيراد الطلاب",
            href: "/list/students/import",
            description: "عمليات استيراد الطلاب من ملف",
          }
        ]
      },
      {
        icon: "/attendance.png",
        label: "الحضور والغياب",
        href: "/list/attendance",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "إدارة الحضور والغياب",
        color: "bg-yellow-50 text-yellow-600",
        hasDropdown: true,
        subItems: [
          {
            icon: ClipboardCheck,
            label: "كشف الحضور",
            href: "/list/attendance",
            description: "عرض سجلات الحضور والغياب"
          },
          {
            icon: BarChart3,
            label: "إحصائيات الحضور",
            href: "/list/attendance/stats",
            description: "تقارير وإحصائيات الحضور"
          },
          {
            icon: Plus,
            label: "تسجيل الحضور",
            href: "/list/attendance/mark",
            description: "تسجيل حضور وغياب الطلاب",
            visible: ["admin", "staff", "teacher"]
          }
        ]
      },
      {
        icon: "/result.png",
        label: "النتائج",
        href: "/grades/results",
        visible: ["admin", "staff", "teacher"],
        description: "إدارة النتائج والتقارير",
        color: "bg-emerald-50 text-emerald-600",
        hasDropdown: true,
        subItems: [
          {
            icon: FileText,
            label: "تقارير النتائج",
            href: "/grades/results",
            description: "عرض تقارير النتائج المختلفة"
          }
        ]
      },
      {
        icon: "/parent.png",
        label: "أولياء الأمور",
        href: "/list/parents",
        visible: ["admin", "staff"],
        description: "إدارة أولياء الأمور",
        color: "bg-orange-50 text-orange-600",
        hasDropdown: true,
        subItems: [
          {
            icon: Plus,
            label: "إضافة ولي أمر",
            href: "/list/parents/add",
            description: "تسجيل ولي أمر جديد"
          },
          {
            icon: Users,
            label: "قائمة أولياء الأمور",
            href: "/list/parents",
            description: "عرض جميع أولياء الأمور"
          },
          {
            icon: MessageSquare,
            label: "التواصل مع الأهالي",
            href: "/list/parents/messages",
            description: "رسائل أولياء الأمور"
          }
        ]
      },
      {
        icon: "/subject.png",
        label: "المواد الدراسية",
        href: "/list/subjects",
        visible: ["admin"],
        description: "إدارة المناهج والمواد",
        color: "bg-indigo-50 text-indigo-600",
        hasDropdown: true,
        subItems: [
          {
            icon: Plus,
            label: "إضافة مادة دراسية",
            href: "/list/subjects/add",
            description: "إضافة مادة دراسية جديدة"
          },
          {
            icon: BookOpen,
            label: "قائمة المواد",
            href: "/list/subjects",
            description: "عرض جميع المواد الدراسية"
          },
          {
            icon: FileText,
            label: "المناهج الدراسية",
            href: "/list/subjects/curriculum",
            description: "إدارة المناهج"
          }
        ]
      },
      {
        icon: "/class.png",
        label: "الفصول",
        href: "/list/classes",
        visible: ["admin", "staff"],
        description: "إدارة الفصول الدراسية",
        color: "bg-pink-50 text-pink-600",
        hasDropdown: true,
        subItems: [
          {
            icon: Plus,
            label: "إضافة فصل",
            href: "/list/classes/add",
            description: "إنشاء فصل دراسي جديد"
          },
          {
            icon: Users,
            label: "قائمة الفصول",
            href: "/list/classes",
            description: "عرض جميع الفصول"
          },
          {
            icon: Calendar,
            label: "جدولة الفصول",
            href: "/list/classes/schedule",
            description: "تنظيم جداول الفصول"
          }
        ]
      },
    ],
  },
  {
    title: "الأنشطة الأكاديمية",
    icon: BookOpen,
    items: [
      {
        icon: "/lesson.png",
        label: "الدروس",
        href: "/list/lessons",
        visible: ["admin", "staff"],
        description: "جدولة وإدارة الدروس",
        color: "bg-teal-50 text-teal-600"
      },
      {
        icon: "/exam.png",
        label: "الامتحانات",
        href: "/list/exams",
        visible: ["admin", "staff", "teacher"],
        description: "جدولة الامتحانات والنتائج",
        color: "bg-red-50 text-red-600"
      },
      {
        icon: "/assignment.png",
        label: "الواجبات",
        href: "/list/assignments",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "إدارة الواجبات المدرسية",
        color: "bg-yellow-50 text-yellow-600"
      },
      {
        icon: "/attendance.png",
        label: "الحضور",
        href: "/list/attendance",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "تتبع حضور الطلاب",
        color: "bg-cyan-50 text-cyan-600"
      },
    ],
  },
  {
    title: "التواصل والفعاليات",
    icon: MessageSquare,
    items: [
      {
        icon: "/calendar.png",
        label: "الفعاليات",
        href: "/list/events",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "التقويم والفعاليات المدرسية",
        color: "bg-violet-50 text-violet-600"
      },
      {
        icon: "/message.png",
        label: "الرسائل",
        href: "/list/messages",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "نظام الرسائل الداخلي",
        color: "bg-blue-50 text-blue-600"
      },
      {
        icon: "/announcement.png",
        label: "الإعلانات",
        href: "/list/announcements",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "الإعلانات والأخبار المهمة",
        color: "bg-amber-50 text-amber-600"
      },
    ],
  },
  {
    title: "الإعدادات الشخصية",
    icon: User,
    items: [
      {
        icon: "/profile.png",
        label: "الملف الشخصي",
        href: "/profile",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "إدارة البيانات الشخصية",
        color: "bg-slate-50 text-slate-600"
      },
      {
        icon: "/setting.png",
        label: "الإعدادات",
        href: "/settings",
        visible: ["admin"],
        description: "إعدادات النظام والتفضيلات",
        color: "bg-gray-50 text-gray-600"
      },
      {
        icon: "/logout.png",
        label: "تسجيل الخروج",
        href: "/logout",
        visible: ["admin", "staff", "teacher", "student", "parent"],
        description: "الخروج من النظام",
        color: "bg-red-50 text-red-600"
      },
    ],
  },
];

const Menu = ({ initialUser }: { initialUser: any }) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<UserRole>('student');

  useEffect(() => {
    if (initialUser?.publicMetadata?.role) {
      setRole(initialUser.publicMetadata.role as UserRole);
    }
  }, [initialUser]);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isItemVisible = (item: any): boolean => {
    if (!item.visible) return true;
    return item.visible.includes(role);
  };

  const isSubItemVisible = (subItem: any): boolean => {
    if (!subItem.visible) return true;
    return subItem.visible.includes(role);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <MenuIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMobileMenu} />
      )}

      {/* Sidebar Menu */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[35rem] lg:w-full h-full
        bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        {/* Header - Responsive */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="IIMS Logo"
              width={100}
              height={100}
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-gray-800">البيان</h1>
              <p className="text-sm text-gray-500">نظام إدارة المعهد الإسلامي</p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Menu Items - Responsive */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {menuItems.map((section, sectionIndex) => {
            const visibleItems = section.items.filter(isItemVisible);

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-8">
                {/* Section Header - Responsive */}
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-8 h-8 bg-lamaSkyLight rounded-lg flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-lamaSky" />
                  </div>
                  <h4 className="font-semibold text-gray-700 text-sm">
                    {section.title}
                  </h4>
                </div>

                {/* Menu Items - Responsive */}
                <div className="space-y-1">
                  {visibleItems.map((item, itemIndex) => (
                    <div key={item.label}>
                      {item.hasDropdown ? (
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className="group relative w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-lamaSkyLight hover:to-transparent hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {/* Icon Container */}
                          <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${item.color}`}>
                            <Image
                              src={item.icon}
                              alt={item.label}
                              width={20}
                              height={20}
                              className="transition-all duration-300 group-hover:scale-110"
                            />
                          </div>

                          {/* Label and Description - Responsive */}
                          <div className="flex flex-col flex-1 min-w-0 text-right">
                            <span className="font-medium text-gray-800 group-hover:text-lamaSky transition-colors duration-300">
                              {item.label}
                            </span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300 truncate">
                              {item.description}
                            </span>
                          </div>

                          {/* Dropdown Arrow - Always visible */}
                          <div>
                            <ChevronDown
                              className={`w-4 h-4 text-lamaSky transition-transform duration-300 ${openDropdowns[item.label] ? 'rotate-180' : ''}`}
                            />
                          </div>

                          {/* Active Indicator */}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-lamaSky rounded-r-full transition-all duration-300 group-hover:h-8"></div>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-lamaSkyLight hover:to-transparent hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {/* Icon Container */}
                          <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${item.color}`}>
                            <Image
                              src={item.icon}
                              alt={item.label}
                              width={20}
                              height={20}
                              className="transition-all duration-300 group-hover:scale-110"
                            />

                            {/* Notification Badge */}
                            {item.label === "الرسائل" && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">3</span>
                              </div>
                            )}
                          </div>

                          {/* Label and Description - Responsive */}
                          <div className="flex flex-col flex-1 min-w-0 text-right">
                            <span className="font-medium text-gray-800 group-hover:text-lamaSky transition-colors duration-300">
                              {item.label}
                            </span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300 truncate">
                              {item.description}
                            </span>
                          </div>

                          {/* Hover Arrow - Hidden on mobile */}
                          <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <ChevronDown className="w-4 h-4 text-lamaSky rotate-[-90deg]" />
                          </div>

                          {/* Active Indicator */}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-lamaSky rounded-r-full transition-all duration-300 group-hover:h-8"></div>
                        </Link>
                      )}

                      {/* Dropdown Sub Items - Responsive */}
                      {item.hasDropdown && item.subItems && (
                        <div className={`overflow-hidden transition-all duration-300 ${openDropdowns[item.label] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="mr-6 mt-2 space-y-1 border-r-2 border-lamaSkyLight">
                            {item.subItems
                              .filter(isSubItemVisible)
                              .map((subItem, subIndex) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  onClick={closeMobileMenu}
                                  className="group flex items-center gap-3 p-2 mr-4 rounded-lg transition-all duration-200 hover:bg-lamaSkyLight/50 hover:translate-x-1"
                                >
                                  <div className="w-8 h-8 bg-white border-2 border-lamaSkyLight rounded-lg flex items-center justify-center group-hover:border-lamaSky group-hover:bg-lamaSky transition-all duration-200">
                                    <subItem.icon className="w-4 h-4 text-lamaSky group-hover:text-white transition-colors duration-200" />
                                  </div>

                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-lamaSky transition-colors duration-200">
                                      {subItem.label}
                                    </span>
                                    <span className="text-xs text-gray-500 truncate">
                                      {subItem.description}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer - Responsive */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-lamaSkyLight to-transparent rounded-xl">
            <div className="w-8 h-8 bg-lamaSky rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">
                {initialUser?.firstName} {initialUser?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {role === 'admin' ? 'مدير النظام' :
                  role === 'staff' ? 'موظف إداري' :
                    role === 'teacher' ? 'معلم' :
                      role === 'student' ? 'طالب' : 'ولي أمر'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;