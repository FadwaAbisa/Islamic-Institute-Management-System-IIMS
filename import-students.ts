import * as XLSX from "xlsx";
import { PrismaClient, StudentStatus, StudyMode, EnrollmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("🚀 بدء عملية استيراد بيانات الطلاب...");

        // 1. افتح الملف
        const workbook = XLSX.readFile("data/students_db.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // 2. حوّل البيانات إلى JSON
        const data: any[] = XLSX.utils.sheet_to_json(sheet);

        console.log(`📊 تم العثور على ${data.length} طالب في الملف`);

        if (data.length === 0) {
            console.log("⚠️ الملف فارغ أو لا يحتوي على بيانات");
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        // 3. أدخل البيانات في قاعدة البيانات
        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            try {
                // التحقق من البيانات المطلوبة
                if (!row.fullName || !row.nationalId) {
                    console.warn(`⚠️ تخطي الصف ${i + 1}: بيانات مفقودة (الاسم: ${row.fullName}, الهوية: ${row.nationalId})`);
                    errorCount++;
                    continue;
                }

                // تحضير البيانات
                const studentData = {
                    // البيانات الأساسية (مطلوبة)
                    fullName: row.fullName.toString().trim(),
                    nationalId: row.nationalId.toString().trim(),
                    birthday: new Date(row.birthday),
                    placeOfBirth: row.placeOfBirth?.toString().trim() || "غير محدد",
                    nationality: row.nationality?.toString().trim() || "عراقي",
                    address: row.address?.toString().trim() || "غير محدد",

                    // البيانات الأكاديمية (اختيارية)
                    academicYear: row.academicYear?.toString().trim() || null,
                    studyLevel: row.studyLevel?.toString().trim() || null,
                    specialization: row.specialization?.toString().trim() || null,

                    // تحويل Enums
                    studyMode: row.StudyMode ?
                        convertStudyMode(row.StudyMode.toString()) : null,

                    enrollmentStatus: row.EnrollmentStatus ?
                        convertEnrollmentStatus(row.EnrollmentStatus.toString()) : null,

                    studentStatus: row.studentStatus ?
                        convertStudentStatus(row.studentStatus.toString()) : StudentStatus.ACTIVE,

                    // بيانات الاتصال
                    studentPhone: row.studentPhone?.toString().trim() || null,
                    guardianName: row.guardianName?.toString().trim() || null,

                    // ربط مع الجداول الأخرى (اختياري)
                    parentId: row.parentId?.toString().trim() || null,
                    gradeId: row.gradeId ? Number(row.gradeId) : null,
                    classId: row.classId ? Number(row.classId) : null,
                };

                // إنشاء الطالب
                const student = await prisma.student.create({
                    data: studentData,
                });

                console.log(`✅ [${i + 1}/${data.length}] تم إنشاء الطالب: ${student.fullName}`);
                successCount++;

            } catch (error: any) {
                console.error(`❌ خطأ في الصف ${i + 1} (${row.fullName || 'غير معروف'}):`, error.message);
                errorCount++;

                // إذا كان خطأ في المفتاح المكرر
                if (error.code === 'P2002') {
                    console.error(`   - رقم الهوية ${row.nationalId} موجود مسبقاً`);
                }
            }
        }

        console.log("\n📈 ملخص العملية:");
        console.log(`✅ نجح: ${successCount} طالب`);
        console.log(`❌ فشل: ${errorCount} طالب`);
        console.log(`📊 إجمالي: ${data.length} سجل`);

    } catch (error: any) {
        console.error("❌ خطأ في قراءة الملف:", error.message);

        if (error.code === 'ENOENT') {
            console.error("📁 تأكد من وجود مجلد 'data' وملف 'students.xlsx' بداخله");
        }
    }
}

// دوال مساعدة للتحويل
function convertStudentStatus(status: string): StudentStatus {
    const statusMap: { [key: string]: StudentStatus } = {
        "مستمر": StudentStatus.ACTIVE,
        "منقطع": StudentStatus.DROPPED,
        "موقوف": StudentStatus.SUSPENDED,
        "مطرود": StudentStatus.EXPELLED,
        "إيقاف قيد": StudentStatus.PAUSED,
        "متخرج": StudentStatus.GRADUATED,
        "ACTIVE": StudentStatus.ACTIVE,
        "DROPPED": StudentStatus.DROPPED,
        "SUSPENDED": StudentStatus.SUSPENDED,
        "EXPELLED": StudentStatus.EXPELLED,
        "PAUSED": StudentStatus.PAUSED,
        "GRADUATED": StudentStatus.GRADUATED,
    };

    return statusMap[status.trim()] || StudentStatus.ACTIVE;
}

function convertStudyMode(mode: string): StudyMode {
    const modeMap: { [key: string]: StudyMode } = {
        "نظامي": StudyMode.REGULAR,
        "انتساب": StudyMode.DISTANCE,
        "REGULAR": StudyMode.REGULAR,
        "DISTANCE": StudyMode.DISTANCE,
    };

    return modeMap[mode.trim()] || StudyMode.REGULAR;
}

function convertEnrollmentStatus(status: string): EnrollmentStatus {
    const statusMap: { [key: string]: EnrollmentStatus } = {
        "مستجد": EnrollmentStatus.NEW,
        "معيد": EnrollmentStatus.REPEATER,
        "NEW": EnrollmentStatus.NEW,
        "REPEATER": EnrollmentStatus.REPEATER,
    };

    return statusMap[status.trim()] || EnrollmentStatus.NEW;
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