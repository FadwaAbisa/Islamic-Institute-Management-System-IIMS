import Announcements from "@/components/Announcements";
import BigCalendarWrapper from "@/components/BigCalendarWrapper";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const { userId } = auth();

  // بدلاً من البحث عن الصف، سنبحث عن الطالب ونستخدم بياناته
  const student = await prisma.student.findUnique({
    where: { id: userId! },
    include: {
      Attendance: true,
      SubjectGrade: true,
    },
  });

  console.log("Student data:", student);

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">
            Schedule {student?.studyLevel ? `(${student.studyLevel})` : ''}
          </h1>
          {student ? (
            <div className="mt-4">
              <p className="text-gray-600 mb-4">
                مرحباً {student.fullName} - {student.specialization || 'بدون تخصص'}
              </p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  لا يوجد جدول دراسي متاح حالياً. سيتم إضافته قريباً.
                </p>
              </div>
            </div>
          ) : (
            <p>لا توجد بيانات للطالب.</p>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* إضافة كشف الحضور للطالب */}
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-4">
            نسبة الحضور
          </h2>
          <StudentAttendanceCard id={userId!} />
        </div>
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
