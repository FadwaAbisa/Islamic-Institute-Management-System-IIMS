import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { HomeAds } from "@/components/HomeAds";


const ParentPage = async () => {
  const { userId } = auth();
  const currentUserId = userId;

  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="">
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.fullName})
              </h1>
              {student.classId ? (
                <BigCalendarContainer type="classId" id={student.classId} />
              ) : (
                <p className="text-gray-500 mt-4">No class assigned to this student.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* إضافة كشف الحضور للأطفال */}
        {students.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4">
              حضور {student.fullName}
            </h2>
            <StudentAttendanceCard id={student.id} />
          </div>
        ))}
        <HomeAds />
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
