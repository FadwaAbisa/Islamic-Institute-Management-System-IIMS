import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-6 shadow-sm border border-gray-100" dir="rtl">
      {/* العنوان المحسن */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">توزيع الطلاب</h1>
        <div className="cursor-pointer hover:bg-gray-50 rounded-full p-1 transition-colors duration-200">
          <Image 
            src="/moreDark.png" 
            alt="المزيد" 
            width={20} 
            height={20} 
            className="opacity-60 hover:opacity-80"
          />
        </div>
      </div>
      
      {/* الرسم البياني */}
      <CountChart boys={boys} girls={girls} />
      
      {/* الإحصائيات السفلى المحسنة */}
      <div className="flex justify-center gap-12 mt-4">
        {/* إحصائية الأولاد */}
        <div className="flex flex-col gap-2 items-center">
          <div className="w-6 h-6 bg-[#B8956A] rounded-full shadow-sm"></div>
          <h1 className="font-bold text-xl text-gray-800">
            {boys.toLocaleString('ar-EG')}
          </h1>
          <h2 className="text-sm text-gray-500 font-medium">
            أولاد ({boys + girls > 0 ? Math.round((boys / (boys + girls)) * 100) : 0}%)
          </h2>
        </div>
        
        {/* إحصائية البنات */}
        <div className="flex flex-col gap-2 items-center">
          <div className="w-6 h-6 bg-[#D2B48C] rounded-full shadow-sm"></div>
          <h1 className="font-bold text-xl text-gray-800">
            {girls.toLocaleString('ar-EG')}
          </h1>
          <h2 className="text-sm text-gray-500 font-medium">
            بنات ({boys + girls > 0 ? Math.round((girls / (boys + girls)) * 100) : 0}%)
          </h2>
        </div>
      </div>

      {/* إجمالي العدد */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          إجمالي عدد الطلاب: <span className="font-semibold text-[#B8956A]">{(boys + girls).toLocaleString('ar-EG')}</span>
        </p>
      </div>
    </div>
  );
};

export default CountChartContainer;