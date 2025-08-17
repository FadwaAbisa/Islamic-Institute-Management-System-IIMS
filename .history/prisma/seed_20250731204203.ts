
import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();








  // أولياء الأمور (أسماء عربية)
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `خالد${i}`,
        surname: `العلي${i}`,
        email: `parent${i}@example.com`,
        phone: `0987654321${i}`,
        address: `حي الورد ${i}`,
      },
    });
  }

  // الطلاب (أسماء عربية)
await prisma.student.create({
  data: {
    id: `student${i}`,
    fullName: `أحمد ${i} السميري`,
    nationalId: `12121${i}`,
    nationality: "ليبي",
    birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
    sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
    address: `شارع السلام ${i}`,
    studyLevel: `${(i % 4) + 1}`,
    academicYear: `202${(i % 5)}`,
    specialization: "علوم",
    studyMode: "نظامي", // تأكد أن هذه القيمة موجودة في enum
    studentStatus: "مستمر", // أيضًا تأكد من وجودها في enum
    enrollmentStatus: "مستجد", // من enum EnrollmentStatus
    placeOfBirth: "طرابلس",
    parentName: `خالد${i}`,
    relationship: "أب",
    parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
    gradeId: (i % 6) + 1,
    classId: (i % 6) + 1,
  },
});



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
