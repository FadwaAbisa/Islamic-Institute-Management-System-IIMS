const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkStudents() {
    try {
        console.log("🔍 فحص الطلاب في قاعدة البيانات...");

        // جلب عدد الطلاب
        const studentCount = await prisma.student.count();
        console.log(`📊 إجمالي عدد الطلاب: ${studentCount}`);

        // جلب عينة من الطلاب
        const sampleStudents = await prisma.student.findMany({
            select: {
                id: true,
                fullName: true,
                nationalId: true,
                academicYear: true,
                studyLevel: true,
                specialization: true
            },
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (sampleStudents.length > 0) {
            console.log("\n📋 عينة من الطلاب المستوردين:");
            sampleStudents.forEach((student, index) => {
                console.log(`${index + 1}. ${student.fullName}`);
                console.log(`   رقم الهوية: ${student.nationalId}`);
                console.log(`   العام الدراسي: ${student.academicYear}`);
                console.log(`   المستوى: ${student.studyLevel}`);
                console.log(`   التخصص: ${student.specialization}`);
                console.log("");
            });
        }

        // إحصائيات إضافية
        const activeStudents = await prisma.student.count({
            where: { studentStatus: 'ACTIVE' }
        });

        console.log(`✅ الطلاب النشطون: ${activeStudents}`);
        console.log(`📚 تم إكمال عملية الاستيراد بنجاح!`);

    } catch (error) {
        console.error("❌ خطأ في فحص الطلاب:", error);
    }
}

// تشغيل السكريبت
checkStudents()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
