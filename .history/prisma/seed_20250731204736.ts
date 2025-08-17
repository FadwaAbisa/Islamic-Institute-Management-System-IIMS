

import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // المشرفون
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "admin2",
      username: "admin2",
    },
  });

  // الصفوف الدراسية
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // الأقسام / الصفوف
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}أ`, // بدل A بالعربي
        gradeId: i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // المواد الدراسية (معربّة)
  const subjectData = [
    { name: "الرياضيات" },
    { name: "العلوم" },
    { name: "الإنجليزية" },
    { name: "التاريخ" },
    { name: "الجغرافيا" },
    { name: "الفيزياء" },
    { name: "الكيمياء" },
    { name: "الأحياء" },
    { name: "علوم الحاسوب" },
    { name: "الفن" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // المعلمون (أسماء عربية)
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `محمد${i}`,
        surname: `الجبالي${i}`,
        email: `teacher${i}@example.com`,
        phone: `0123456789${i}`,
        address: `شارع النصر ${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }


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
