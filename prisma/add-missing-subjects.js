const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addMissingSubjects() {
    try {
        console.log("🔍 فحص المواد الموجودة...");

        // جلب جميع المواد الموجودة
        const existingSubjects = await prisma.subject.findMany({
            select: { name: true }
        });

        const existingNames = existingSubjects.map(s => s.name);
        console.log(`📚 المواد الموجودة: ${existingNames.length}`);

        // المواد المطلوبة
        const requiredSubjects = [
            "منهج الدعوة",
            "أصول الفقة"
        ];

        console.log("\n➕ إضافة المواد المفقودة...");

        for (const subjectName of requiredSubjects) {
            if (!existingNames.includes(subjectName)) {
                try {
                    const newSubject = await prisma.subject.create({
                        data: { name: subjectName }
                    });
                    console.log(`✅ تم إضافة: ${subjectName} (ID: ${newSubject.id})`);
                } catch (error) {
                    console.error(`❌ خطأ في إضافة ${subjectName}:`, error);
                }
            } else {
                console.log(`ℹ️ ${subjectName} موجودة بالفعل`);
            }
        }

        console.log("\n🎯 تم إكمال إضافة المواد المفقودة!");

    } catch (error) {
        console.error("❌ خطأ في العملية:", error);
    }
}

// تشغيل السكريبت
addMissingSubjects()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
