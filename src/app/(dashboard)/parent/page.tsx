import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { HomeAds } from "@/components/HomeAds";

const ParentPage = async () => {
  const { userId } = auth();
  const currentUserId = userId;

  // بدلاً من البحث بـ parentId، سنعرض جميع الطلاب مؤقتاً
  // أو يمكن البحث باستخدام guardianPhone إذا كان متوفر
  const students = await prisma.student.findMany({
    take: 5, // نعرض أول 5 طلاب فقط للتجربة
    include: {
      attendances: true,
      subjectGrades: true,
    },
  });

  console.log("Students found:", students.length);

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold mb-4">
            جدول الطلاب
          </h1>
          {students.length > 0 ? (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="border p-4 rounded-md">
                  <h3 className="font-medium">{student.fullName}</h3>
                  <p className="text-sm text-gray-600">
                    {student.studyLevel || 'بدون مرحلة'} - {student.specialization || 'بدون تخصص'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.guardianName ? `ولي الأمر: ${student.guardianName}` : 'بدون ولي أمر'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">لا يوجد طلاب متاحين.</p>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* إضافة كشف الحضور للأطفال */}
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id} className="bg-white p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">
                حضور {student.fullName}
              </h2>
              <StudentAttendanceCard id={student.id} />
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-md">
            <p className="text-gray-500">لا يوجد طلاب لعرض الحضور.</p>
          </div>
        )}
        <HomeAds />
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
