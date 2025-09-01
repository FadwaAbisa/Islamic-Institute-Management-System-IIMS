import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  // جلب بيانات الحضور مع معلومات الطلاب
  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)), // آخر 30 يوم
      },
    },
    select: {
      present: true,
      Student: {
        select: {
          studyLevel: true,
        },
      },
    },
  });

  // إحصائيات حسب الفصول الدراسية
  const classStats: { [key: string]: { present: number; absent: number } } = {};

  resData.forEach((item) => {
    const studyLevel = item.Student.studyLevel || "غير محدد";
    
    if (!classStats[studyLevel]) {
      classStats[studyLevel] = { present: 0, absent: 0 };
    }

    if (item.present) {
      classStats[studyLevel].present += 1;
    } else {
      classStats[studyLevel].absent += 1;
    }
  });

  // تحويل أسماء الفصول إلى العربية
  const classNames: { [key: string]: string } = {
    "FIRST_YEAR": "السنة الأولى",
    "SECOND_YEAR": "السنة الثانية", 
    "THIRD_YEAR": "السنة الثالثة",
    "GRADUATION": "التخرج",
    "غير محدد": "غير محدد"
  };

  const data = Object.entries(classStats).map(([studyLevel, stats]) => ({
    name: classNames[studyLevel] || studyLevel,
    present: stats.present,
    absent: stats.absent,
  }));


  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">الحضور حسب الفصول</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
