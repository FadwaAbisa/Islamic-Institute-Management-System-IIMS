import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { useState } from "react";

const Navbar = async () => {
  const user = await currentUser();

  // تحسين عرض الأدوار باللغة العربية
  const getRoleInArabic = (role: string | undefined) => {
    const roleMap: Record<string, string> = {
      admin: "مدير النظام",
      teacher: "معلم",
      student: "طالب",
      parent: "ولي أمر",
    };
    return role ? roleMap[role] || "مستخدم" : "مستخدم";
  };

  // الحصول على اسم المستخدم
  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.username || "مستخدم";
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-100">
      {/* شريط البحث المحسن */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
        <Image 
          src="/search.png" 
          alt="بحث" 
          width={16} 
          height={16} 
          className="opacity-60"
        />
        <input
          type="text"
          placeholder="ابحث عن المعلمين، الطلاب، أو المواد..."
          className="w-[250px] p-1 bg-transparent outline-none placeholder:text-gray-500 text-sm"
          dir="rtl"
        />
      </div>

      {/* الأيقونات والمستخدم */}
      <div className="flex items-center gap-4 justify-end w-full md:w-auto">
        {/* أيقونة الرسائل */}
        <div
          title="الرسائل"
          className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200"
        >
          <Image 
            src="/message.png" 
            alt="رسائل" 
            width={18} 
            height={18} 
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* أيقونة الإعلانات مع عداد محسن */}
        <div
          title="الإعلانات"
          className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200 relative"
        >
          <Image 
            src="/announcement.png" 
            alt="إعلانات" 
            width={18} 
            height={18} 
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs font-medium shadow-sm animate-pulse">
            1
          </div>
        </div>
       {/* زر المستخدم مع تحسينات */}
          <div className="relative">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-gray-200 hover:ring-gray-300 transition-all duration-200",
                  userButtonPopoverCard: "shadow-lg border border-gray-200",
                }
              }}
            />
          </div>
        {/* معلومات المستخدم المحسنة */}
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm leading-4 font-semibold text-gray-800">
              {getUserName()}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {getRoleInArabic(user?.publicMetadata?.role as string)}
            </span>
          </div>
          
         
        </div>
      </div>

      {/* شريط بحث للموبايل */}
      <div className="md:hidden fixed top-16 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 hidden" id="mobile-search">
        <div className="flex items-center gap-2">
          <Image src="/search.png" alt="بحث" width={16} height={16} />
          <input
            type="text"
            placeholder="ابحث هنا..."
            className="flex-1 p-2 bg-transparent outline-none text-sm"
            dir="rtl"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;