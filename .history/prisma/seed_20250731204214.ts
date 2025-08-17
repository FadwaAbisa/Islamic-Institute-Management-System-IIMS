
import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();











  // الامتحانات (عناوين عربية)
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `اختبار ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // الواجبات (عناوين عربية)
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `واجب ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // النتائج (نفس الشيء)
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90,
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
      },
    });
  }

  // الحضور (تعريب فقط)
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: true,
        studentId: `student${i}`,
        lessonId: (i % 30) + 1,
      },
    });
  }

  // الأحداث (عناوين عربية ووصف عربي)
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `حدث ${i}`,
        description: `وصف الحدث رقم ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: (i % 5) + 1,
      },
    });
  }

  // الإعلانات (عناوين عربية ووصف عربي)
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `إعلان ${i}`,
        description: `وصف الإعلان رقم ${i}`,
        date: new Date(),
        classId: (i % 5) + 1,
      },
    });
  }

  console.log("تم إكمال تعبئة البيانات بنجاح.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
