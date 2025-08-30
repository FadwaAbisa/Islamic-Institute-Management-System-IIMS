const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function saveGrades() {
    try {
        console.log("💾 بدء حفظ الدرجات في قاعدة البيانات...");

        // قراءة الدرجات من localStorage (يمكن تعديل هذا لقراءة من ملف أو API)
        const gradesData = [
            {
                studentId: "example-student-id",
                subjectName: "القرآن الكريم",
                academicYear: "2024-2025",
                period: "FIRST",
                month1: 85,
                month2: 90,
                month3: 88,
                finalExam: 92,
                workTotal: 87.67,
                periodTotal: 89.2
            }
            // يمكن إضافة المزيد من البيانات هنا
        ];

        console.log(`📊 تم العثور على ${gradesData.length} مجموعة درجات`);

        for (let i = 0; i < gradesData.length; i++) {
            const gradeData = gradesData[i];

            try {
                // البحث عن الطالب
                const student = await prisma.student.findUnique({
                    where: { id: gradeData.studentId }
                });

                if (!student) {
                    console.warn(`⚠️ الطالب غير موجود: ${gradeData.studentId}`);
                    continue;
                }

                // البحث عن المادة
                const subject = await prisma.subject.findUnique({
                    where: { name: gradeData.subjectName }
                });

                if (!subject) {
                    console.warn(`⚠️ المادة غير موجودة: ${gradeData.subjectName}`);
                    continue;
                }

                // حفظ أو تحديث الدرجات
                const savedGrade = await prisma.subjectGrade.upsert({
                    where: {
                        studentId_subjectId_academicYear_period: {
                            studentId: student.id,
                            subjectId: subject.id,
                            academicYear: gradeData.academicYear,
                            period: gradeData.period
                        }
                    },
                    update: {
                        month1: gradeData.month1,
                        month2: gradeData.month2,
                        month3: gradeData.month3,
                        finalExam: gradeData.finalExam,
                        workTotal: gradeData.workTotal,
                        periodTotal: gradeData.periodTotal
                    },
                    create: {
                        studentId: student.id,
                        subjectId: subject.id,
                        academicYear: gradeData.academicYear,
                        period: gradeData.period,
                        month1: gradeData.month1,
                        month2: gradeData.month2,
                        month3: gradeData.month3,
                        finalExam: gradeData.finalExam,
                        workTotal: gradeData.workTotal,
                        periodTotal: gradeData.periodTotal
                    }
                });

                console.log(`✅ تم حفظ درجات ${student.fullName} في ${subject.name}`);

            } catch (error) {
                console.error(`❌ خطأ في حفظ الدرجات ${i + 1}:`, error);
                continue;
            }
        }

        console.log("🎉 تم إكمال حفظ الدرجات");

    } catch (error) {
        console.error("❌ خطأ عام:", error);
    }
}

// تشغيل السكريبت
saveGrades()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
