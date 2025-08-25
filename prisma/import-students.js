const XLSX = require("xlsx");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    try {
        // 1. افتح الملف
        const workbook = XLSX.readFile("data/students_db.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        console.log(`📊 أسماء الأعمدة في الملف:`, Object.keys(XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || []));

        // 2. حوّل البيانات إلى JSON
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`📊 تم العثور على ${data.length} طالب في الملف`);

        // عرض أول صف للتحقق من البيانات
        if (data.length > 0) {
            console.log("📋 نموذج من البيانات:", data[0]);
        }

        // 3. أدخل البيانات في قاعدة البيانات
        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            try {
                // تحويل البيانات وتنظيفها
                const studentData = {
                    // البيانات الأساسية (مطلوبة)
                    fullName: row.fullName?.toString().trim() || row.name?.toString().trim() || row.studentName?.toString().trim(),
                    nationalId: row.nationalId?.toString().trim() || row.studentId?.toString().trim() || row.id?.toString().trim(),
                    birthday: row.birthday ? new Date(row.birthday) : new Date('2000-01-01'),
                    placeOfBirth: row.placeOfBirth?.toString().trim() || "غير محدد",
                    nationality: row.nationality?.toString().trim() || "عراقي",
                    address: row.address?.toString().trim() || "غير محدد",

                    // البيانات الأكاديمية (اختيارية)
                    academicYear: row.academicYear?.toString().trim() || "2024-2025",
                    studyLevel: convertStudyLevel(row.studyLevel?.toString().trim()),
                    specialization: row.specialization?.toString().trim() || row.subject?.toString().trim() || "الدراسات الإسلامية",

                    // تحويل Enums
                    studyMode: row.studyMode ?
                        (row.studyMode.toString().toUpperCase() === "REGULAR" ? "REGULAR" : "DISTANCE")
                        : (row.StudyMode ?
                            (row.StudyMode.toString().toUpperCase() === "REGULAR" ? "REGULAR" : "DISTANCE")
                            : "REGULAR"),

                    enrollmentStatus: row.enrollmentStatus ?
                        (row.enrollmentStatus.toString().toUpperCase() === "NEW" ? "NEW" : "REPEATER")
                        : (row.EnrollmentStatus ?
                            (row.EnrollmentStatus.toString().toUpperCase() === "NEW" ? "NEW" : "REPEATER")
                            : "NEW"),

                    studentStatus: row.studentStatus ?
                        convertStudentStatus(row.studentStatus.toString())
                        : "ACTIVE",

                    // بيانات الاتصال
                    studentPhone: row.studentPhone?.toString().trim() || row.phone?.toString().trim() || null,
                    guardianName: row.guardianName?.toString().trim() || row.parentName?.toString().trim() || null,

                    // ربط مع الجداول الأخرى (اختياري)
                    parentId: row.parentId?.toString().trim() || null,
                    gradeId: row.gradeId ? Number(row.gradeId) : null,
                    classId: row.classId ? Number(row.classId) : null,
                };

                // التحقق من البيانات المطلوبة
                if (!studentData.fullName || !studentData.nationalId) {
                    console.warn(`⚠️ تخطي الصف ${i + 1}: بيانات مفقودة (الاسم أو رقم الهوية)`);
                    console.warn(`   البيانات:`, row);
                    continue;
                }

                // التحقق من وجود الطالب مسبقاً
                const existingStudent = await prisma.student.findUnique({
                    where: { nationalId: studentData.nationalId }
                });

                if (existingStudent) {
                    console.log(`🔄 تحديث الطالب الموجود: ${studentData.fullName} (ID: ${existingStudent.id})`);

                    await prisma.student.update({
                        where: { id: existingStudent.id },
                        data: studentData,
                    });
                } else {
                    // إنشاء طالب جديد
                    const student = await prisma.student.create({
                        data: studentData,
                    });

                    console.log(`✅ تم إنشاء الطالب: ${student.fullName} (ID: ${student.id})`);
                }

            } catch (error) {
                console.error(`❌ خطأ في الصف ${i + 1}:`, error);
                console.error(`   البيانات:`, row);
                // استمر في المعالجة حتى لو فشل صف واحد
                continue;
            }
        }

        console.log("🎉 تم إكمال عملية الاستيراد");

    } catch (error) {
        console.error("❌ خطأ في قراءة الملف:", error);
    }
}

// دالة مساعدة لتحويل المرحلة الدراسية
function convertStudyLevel(level) {
    if (!level) return "1";

    const levelStr = level.trim();

    if (levelStr.includes("الأولى") || levelStr.includes("اولى")) return "1";
    if (levelStr.includes("الثانية") || levelStr.includes("ثانية")) return "2";
    if (levelStr.includes("الثالثة") || levelStr.includes("ثالثة")) return "3";
    if (levelStr.includes("التخرج") || levelStr.includes("تخرج")) return "4";

    // إذا كان رقم
    if (/^\d+$/.test(levelStr)) return levelStr;

    // افتراضي
    return "1";
}

// دالة مساعدة لتحويل حالة الطالب
function convertStudentStatus(status) {
    const statusMap = {
        "مستمر": "ACTIVE",
        "منقطع": "DROPPED",
        "موقوف": "SUSPENDED",
        "مطرود": "EXPELLED",
        "إيقاف قيد": "PAUSED",
        "متخرج": "GRADUATED",
        "ACTIVE": "ACTIVE",
        "DROPPED": "DROPPED",
        "SUSPENDED": "SUSPENDED",
        "EXPELLED": "EXPELLED",
        "PAUSED": "PAUSED",
        "GRADUATED": "GRADUATED",
    };

    return statusMap[status.trim()] || "ACTIVE";
}

// تشغيل السكريبت
main()
    .catch((e) => {
        console.error("❌ خطأ عام في التطبيق:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
