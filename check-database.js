const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('=== فحص قاعدة البيانات ===\n');

        // فحص عدد الطلاب
        const studentsCount = await prisma.student.count();
        console.log(`عدد الطلاب في قاعدة البيانات: ${studentsCount}`);

        // فحص عدد المواد
        const subjectsCount = await prisma.subject.count();
        console.log(`عدد المواد في قاعدة البيانات: ${subjectsCount}`);

        // عرض أول 5 طلاب
        if (studentsCount > 0) {
            console.log('\n=== أول 5 طلاب ===');
            const firstStudents = await prisma.student.findMany({
                take: 5,
                select: {
                    id: true,
                    fullName: true,
                    nationalId: true,
                    studyLevel: true,
                    StudyMode: true,
                    EnrollmentStatus: true,
                    studentStatus: true
                }
            });

            firstStudents.forEach((student, index) => {
                console.log(`\n${index + 1}. ${student.fullName}`);
                console.log(`   الرقم الوطني: ${student.nationalId}`);
                console.log(`   المستوى الدراسي: ${student.studyLevel}`);
                console.log(`   نوع الدراسة: ${student.StudyMode}`);
                console.log(`   حالة التسجيل: ${student.EnrollmentStatus}`);
                console.log(`   حالة الطالب: ${student.studentStatus}`);
            });
        }

        // عرض أول 5 مواد
        if (subjectsCount > 0) {
            console.log('\n=== أول 5 مواد ===');
            const firstSubjects = await prisma.subject.findMany({
                take: 5,
                select: {
                    id: true,
                    name: true
                }
            });

            firstSubjects.forEach((subject, index) => {
                console.log(`${index + 1}. ${subject.name} (ID: ${subject.id})`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في فحص قاعدة البيانات:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// تشغيل الدالة
checkDatabase();
