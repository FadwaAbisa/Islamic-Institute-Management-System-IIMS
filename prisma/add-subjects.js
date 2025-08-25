const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addSubjects() {
    try {
        console.log("📚 إضافة المواد الأساسية إلى قاعدة البيانات...");

        // المواد الأساسية
        const subjects = [
            "القرآن الكريم و احكام التجويد",
            "علم الحديث ",
            "الفقه ",
            "التفسير ",
            "العقيدة ",
            "الدراسات الادبية  ",
            "الدراسات اللغوية  ",
            "السيرة ",
            "اللغة الانجليزية ",
            "الحاسوب   ",
            "منهج الدعوة ",
            "أصول الفقة "
        ];

        let addedCount = 0;
        let updatedCount = 0;

        for (const subjectName of subjects) {
            try {
                // التحقق من وجود المادة
                const existingSubject = await prisma.subject.findUnique({
                    where: { name: subjectName }
                });

                if (existingSubject) {
                    console.log(`🔄 المادة موجودة: ${subjectName}`);
                    updatedCount++;
                } else {
                    // إضافة مادة جديدة
                    const newSubject = await prisma.subject.create({
                        data: { name: subjectName }
                    });
                    console.log(`✅ تم إضافة المادة: ${subjectName} (ID: ${newSubject.id})`);
                    addedCount++;
                }

            } catch (error) {
                console.error(`❌ خطأ في إضافة المادة ${subjectName}:`, error);
                continue;
            }
        }

        console.log(`\n🎉 تم إكمال العملية:`);
        console.log(`   • مواد جديدة: ${addedCount}`);
        console.log(`   • مواد موجودة: ${updatedCount}`);
        console.log(`   • إجمالي: ${addedCount + updatedCount}`);

    } catch (error) {
        console.error("❌ خطأ عام:", error);
    }
}

// تشغيل السكريبت
addSubjects()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
