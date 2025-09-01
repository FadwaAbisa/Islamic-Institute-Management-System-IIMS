import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["studyMode"],
    _count: true,
  });

  const Regular = data.find((d) => d.studyMode === "REGULAR")?._count || 0;
  const Distance = data.find((d) => d.studyMode === "DISTANCE")?._count || 0;
  const girls = data.find((d) => d.studyMode === "DISTANCE")?._count || 0;

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
      <CountChart regular={Regular} distance={Distance} />

      {/* الإحصائيات السفلى المحسنة */}
      <div className="flex justify-center gap-6 mt-4 px-2">
        {/* إحصائية النظامي */}
        <div className="flex flex-col gap-2 items-center min-w-[90px] max-w-[90px]">
          <div className="w-6 h-6 bg-[#B8956A] rounded-full shadow-sm"></div>
          <h1 className="font-bold text-xl text-gray-800 text-center">
            {Regular.toLocaleString('en-US')}
          </h1>
          <h2 className="text-xs text-gray-500 font-medium text-center leading-tight break-words">
            نظامي ({Regular + Distance > 0 ? Math.round((Regular / (Regular + Distance)) * 100) : 0}%)
          </h2>
        </div>

        {/* إحصائية الانتساب */}
        <div className="flex flex-col gap-2 items-center min-w-[90px] max-w-[90px]">
          <div className="w-6 h-6 bg-[#D2B48C] rounded-full shadow-sm"></div>
          <h1 className="font-bold text-xl text-gray-800 text-center">
            {Distance.toLocaleString('en-US')}
          </h1>
          <h2 className="text-xs text-gray-500 font-medium text-center leading-tight break-words">
            انتساب ({Regular + Distance > 0 ? Math.round((Distance / (Regular + Distance)) * 100) : 0}%)
          </h2>
        </div>
      </div>

      {/* إجمالي العدد */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          إجمالي عدد الطلاب: <span className="font-semibold text-[#B8956A]">{(Regular + Distance).toLocaleString('en-US')}</span>
        </p>
      </div>
    </div>
  );
};

export default CountChartContainer;