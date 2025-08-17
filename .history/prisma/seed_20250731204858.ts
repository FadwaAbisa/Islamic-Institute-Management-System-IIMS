

// prisma/seed.ts

// قم باستيراد كل ما تحتاجه من Prisma Client
import {
  PrismaClient,
  UserSex,
  Day,
  StudyMode,
  StudentStatus,
  EnrollmentStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("بدء عملية تعبئة البيانات...");

  // 1. المشرفون
  await prisma.admin.createMany({
    data: [
      { id: "admin1", username: "admin1" },
      { id: "admin2", username: "admin2" },
    ],
    skipDuplicates: true,
  });
  console.log("تم إنشاء المشرفين.");

  // 2. الصفوف الدراسية
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.upsert({
      where: { level: i },
      update: {},
      create: { level: i },
    });
  }
  console.log("تم إنشاء الصفوف الدراسية.");

  // 3. الفصول
  for (let i = 1; i <= 6; i++) {
    await prisma.class.upsert({
      where: { name: `${i}أ` },
      update: {},
      create: {
        name: `${i}أ`,
        gradeId: i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }
  console.log("تم إنشاء الفصول.");

  // 4. المواد الدراسية
  const subjectData = [
    { name: "الرياضيات" }, { name: "العلوم" }, { name: "الإنجليزية" },
    { name: "التاريخ" }, { name: "الجغرافيا" }, { name: "الفيزياء" },
    { name: "الكيمياء" }, { name: "الأحياء" }, { name: "علوم الحاسوب" },
    { name: "الفن" },
  ];
  await prisma.subject.createMany({
    data: subjectData,
    skipDuplicates: true,
  });
  console.log("تم إنشاء المواد الدراسية.");

  // 5. المعلمون
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.upsert({
      where: { id: `teacher${i}` },
      update: {},
      create: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `محمد${i}`,
        surname: `الجبالي${i}`,
        email: `teacher${i}@example.com`,
        phone: `0123456789${i}`,
        address: `شارع النصر ${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
        subjects: { connect: { id: (i % 10) + 1 } },
        classes: { connect: { id: (i % 6) + 1 } },
      },
    });
  }
  console.log("تم إنشاء المعلمين.");

  // 6. أولياء الأمور
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.upsert({
      where: { id: `parentId${i}` },
      update: {},
      create: {
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
  console.log("تم إنشاء أولياء الأمور.");

  // 7. الطلاب (الجزء المصحح)
  for (let i = 1; i <= 50; i++) { // *** تم وضع الكود داخل حلقة تكرار ***
    await prisma.student.create({
      data: {
        id: `student${i}`,
        fullName: `أحمد ${i} السميري`,
        nationalId: `12121${i}`,
        nationality: "ليبي",
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        address: `شارع السلام ${i}`,
        placeOfBirth: "طرابلس",
        parentName: `خالد${i}`,
        relationship: "أب",
        
        // --- الحقول التي تم تصحيحها ---
        branch: "عام", // *** تم إضافة الحقل الناقص ***
        studyLevel: `${(i % 4) + 1}`,
        academicYear: `202${(i % 5)}`,
        specialization: "علوم",
        studyMode: StudyMode.REGULAR, // *** تم استخدام الـ enum الصحيح ***
        studentStatus: StudentStatus.ACTIVE, // *** تم استخدام الـ enum الصحيح ***
        enrollmentStatus: EnrollmentStatus.NEW, // *** تم استخدام الـ enum الصحيح ***
        
        // --- العلاقات ---
        parentId: `parentId${(i % 25) + 1}`, // تأكد من أن هذا يولد ID موجود
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
      },
    });
  }
  console.log("تم إنشاء الطلاب.");

  // 8. الدروس
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.upsert({
        where: { id: i },
        update: {},
        create: {
            name: `درس${i}`,
            day: Object.values(Day)[i % 5], // طريقة أبسط لاختيار يوم
            startTime: new Date(new Date().setHours(8, 0, 0, 0)),
            endTime: new Date(new Date().setHours(9, 0, 0, 0)),
            subjectId: (i % 10) + 1,
            classId: (i % 6) + 1,
            teacherId: `teacher${(i % 15) + 1}`,
        }
    });
  }
  console.log("تم إنشاء الدروس.");

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
  .catch((e) => {
    console.error("حدث خطأ أثناء عملية التعبئة:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });