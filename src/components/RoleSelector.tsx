"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, GraduationCap, ClipboardCheck, Settings } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: string) => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const router = useRouter();

  const roles = [
    {
      id: "student",
      name: "طالب",
      description: "الوصول لصفحات الطلاب والدرجات والحضور",
      icon: GraduationCap,
      color: "bg-blue-500 hover:bg-blue-600",
      redirect: "/student"
    },
    {
      id: "teacher", 
      name: "معلم",
      description: "إدارة الطلاب والدرجات والحضور والجدول",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600",
      redirect: "/teacher"
    },
    {
      id: "staff",
      name: "موظف إداري",
      description: "إدارة شؤون الطلاب والأحداث والتقارير",
      icon: ClipboardCheck,
      color: "bg-yellow-500 hover:bg-yellow-600",
      redirect: "/staff"
    },
    {
      id: "admin",
      name: "مدير النظام",
      description: "صلاحيات كاملة لإدارة جميع أجزاء النظام",
      icon: Settings,
      color: "bg-red-500 hover:bg-red-600",
      redirect: "/admin"
    }
  ];

  const handleRoleSelection = (role: any) => {
    setSelectedRole(role.id);
    localStorage.setItem('userRole', role.id);
    onRoleSelect(role.id);
    
    // إعادة توجيه للصفحة المناسبة
    setTimeout(() => {
      router.push(role.redirect);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurple via-lamaPurpleLight to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">مرحباً بك في النظام</h1>
          <p className="text-gray-600 text-lg">اختر دورك في النظام للمتابعة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedRole === role.id 
                  ? 'border-lamaSky bg-lamaPurpleLight shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-lamaSkyLight hover:shadow-md'
              }`}
              onClick={() => handleRoleSelection(role)}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center text-white transition-colors duration-300`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{role.name}</h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                </div>
              </div>
              
              {selectedRole === role.id && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-lamaSky">
                    <div className="w-4 h-4 border-2 border-lamaSky rounded-full mr-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">تم الاختيار</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            يمكنك تغيير دورك لاحقاً من الإعدادات
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
