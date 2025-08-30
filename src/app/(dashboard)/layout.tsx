import Menu from "@/components/Menu";
import MenuWrapper from "@/components/MenuWrapper";

import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        {/* <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.jpg" alt="logo" width={200} height={200} />
            <span className="hidden lg:block font-bold"></span>
          </Link> */}
        <MenuWrapper />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        {/* رأس الداشبورد */}
        <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>

          {/* مجموعة الأزرار */}
          <div className="flex items-center gap-3">
            {/* زر الملف الشخصي */}
            <button className="relative p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-300 hover:scale-105">
              <div className="w-5 h-5 flex items-center justify-center text-lg">👤</div>
            </button>

            {/* زر الإشعارات */}
            <button className="relative p-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all duration-300 hover:scale-105">
              <div className="w-5 h-5 flex items-center justify-center text-lg">🔔</div>
              {/* نقطة التنبيه */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* زر الرسائل */}
            <button className="relative p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-300 hover:scale-105">
              <div className="w-5 h-5 flex items-center justify-center text-lg">💬</div>
              {/* عداد الرسائل */}
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                3
              </span>
            </button>

            {/* خط فاصل */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* زر العودة للرئيسية */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-lama-sky to-lama-yellow text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
