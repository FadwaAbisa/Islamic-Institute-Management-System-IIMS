import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import { auth } from "@clerk/nextjs/server";
import { HomeAds } from "@/components/HomeAds";

const TeacherPage = () => {
  const { userId } = auth();
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <div className="h-[600px] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">الجدول الدراسي</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
        </div>
        <div className="h-[400px] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">إحصائيات الحضور</h1>
          <AttendanceChartContainer />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <HomeAds />
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
