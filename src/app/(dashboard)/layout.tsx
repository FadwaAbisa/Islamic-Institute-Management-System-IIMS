import Menu from "@/components/Menu";
import MenuWrapper from "@/components/MenuWrapper";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex overflow-x-hidden">
      {/* LEFT - المينو */}
      <div className="w-[280px] lg:w-[280px] xl:w-[280px] bg-white border-l border-gray-200 shadow-lg">
        <MenuWrapper />
      </div>
      {/* RIGHT - المحتوى الرئيسي */}
      <div className="flex-1 bg-[#F7F8FA] overflow-auto flex flex-col">
        {/* رأس الداشبورد */}
        <DashboardHeader />
        {/* المحتوى */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
