const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// المواد الأساسية (بدون تكرار)
const subjects = [
    "القرآن الكريم و أحكام التجويد",
    "علم الحديث",
    "الفقه",
    "التفسير",
    "العقيدة",
    "الدراسات الأدبية",
    "الدراسات اللغوية",
    "السيرة",
    "اللغة الإنجليزية",
    "الحاسوب",
    "منهج الدعوة",
    "أصول الفقه"
];

async function addSubjects() {
    try {
        console.log("📚 إضافة المواد الأساسية...");

        for (const subjectName of subjects) {
            // التحقق من وجود المادة
            const existingSubject = await prisma.subject.findUnique({
                where: { name: subjectName }
            });

            if (!existingSubject) {
                // إضافة مادة جديدة (بدون تحديد السنة الدراسية)
                await prisma.subject.create({
                    data: {
                        name: subjectName,
                        // لا نحتاج studyLevel هنا - سيتم تحديده عند ربط المادة بالطالب
                        academicYear: '2024-2025'
                    }
                });
                console.log(`✅ تم إضافة: ${subjectName}`);
            } else {
                console.log(`🔄 موجودة: ${subjectName}`);
            }
        }

        console.log("🎉 تم إكمال العملية!");
    } catch (error) {
        console.error("❌ خطأ:", error);
    } finally {
        await prisma.$disconnect();
    }
}

addSubjects();