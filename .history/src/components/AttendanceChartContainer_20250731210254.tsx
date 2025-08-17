import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  // console.log(data)

  const daysOfWeek = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

// استخدم نفس الأسماء العربية هنا
const attendanceMap: { [key: string]: { present: number; absent: number } } = {
  "الإثنين": { present: 0, absent: 0 },
  "الثلاثاء": { present: 0, absent: 0 },
  "الأربعاء": { present: 0, absent: 0 },
  "الخميس": { present: 0, absent: 0 },
  "الجمعة": { present: 0, absent: 0 },
};

resData.forEach((item) => {
  const itemDate = new Date(item.date);
  const dayOfWeek = itemDate.getDay(); // 1 for Monday, 2 for Tuesday...

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // dayName سيكون "الإثنين"، "الثلاثاء"، إلخ.
    const dayName = daysOfWeek[dayOfWeek - 1];

    // الآن سيجد المفتاح الصحيح
    if (item.present) {
      attendanceMap[dayName].present += 1;
    } else {
      attendanceMap[dayName].absent += 1;
    }
  }
});
const data = daysOfWeek.map((day) => ({
  name: day,
  present: attendanceMap[day]?.present ?? 0,
  absent: attendanceMap[day]?.absent ?? 0,
}));


  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">الحضور والغياب</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data}/>
    </div>
  );
};

export default AttendanceChartContainer;
