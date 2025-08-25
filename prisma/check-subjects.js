const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkSubjects() {
    try {
        console.log("🔍 فحص المواد الموجودة في قاعدة البيانات...");

        // جلب جميع المواد
        const subjects = await prisma.subject.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                id: 'asc'
            }
        });

        console.log(`📚 عدد المواد الموجودة: ${subjects.length}`);

        if (subjects.length > 0) {
            console.log("\n📋 المواد الموجودة:");
            subjects.forEach((subject, index) => {
                console.log(`${index + 1}. ${subject.name} (ID: ${subject.id})`);
            });
        } else {
            console.log("⚠️ لا توجد مواد في قاعدة البيانات!");
        }

        // اقتراح المواد الأساسية
        const suggestedSubjects = [
            "القرآن الكريم و احكام التجويد",
            "علم الحديث",
            "الفقه",
            "التفسير",
            "العقيدة",
            "الدراسات الادبية",
            "الدراسات اللغوية",
            "السيرة",
            "اللغة الانجليزية",
            "الحاسوب",
            "منهج الدعوة",
            "أصول الفقة"
        ];

        console.log("\n💡 المواد المقترحة للإضافة:");
        suggestedSubjects.forEach((subject, index) => {
            const exists = subjects.some(s => s.name === subject);
            const status = exists ? "✅ موجود" : "❌ غير موجود";
            console.log(`${index + 1}. ${subject} - ${status}`);
        });

    } catch (error) {
        console.error("❌ خطأ في فحص المواد:", error);
    }
}

// تشغيل السكريبت
checkSubjects()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
