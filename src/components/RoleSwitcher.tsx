"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@/lib/permissions";

const RoleSwitcher = () => {
  const [currentRole, setCurrentRole] = useState<string>("student");

  useEffect(() => {
    // قراءة الدور الحالي من localStorage
    const role = localStorage.getItem("userRole") || "student";
    setCurrentRole(role);
  }, []);

  const handleRoleChange = (newRole: string) => {
    localStorage.setItem("userRole", newRole);
    setCurrentRole(newRole);
    
    // إعادة تحميل الصفحة لتطبيق التغيير
    window.location.reload();
  };

  const roles = [
    { value: "student", label: "طالب", color: "bg-blue-100 text-blue-800" },
    { value: "teacher", label: "معلم", color: "bg-green-100 text-green-800" },
    { value: "staff", label: "موظف إداري", color: "bg-yellow-100 text-yellow-800" },
    { value: "admin", label: "مدير النظام", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <div className="text-sm font-medium text-gray-700 mb-3">
        🔄 تبديل الأدوار للاختبار
      </div>
      
      <div className="space-y-2">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentRole === role.value 
                ? `${role.color} ring-2 ring-offset-1` 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {currentRole === role.value && "✓ "}
            {role.label}
          </button>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          الدور الحالي: <span className="font-medium">{roles.find(r => r.value === currentRole)?.label}</span>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;
