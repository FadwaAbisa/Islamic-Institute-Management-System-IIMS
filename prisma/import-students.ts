import * as XLSX from "xlsx";
import { PrismaClient, StudentStatus, StudyMode, EnrollmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. افتح الملف
    const workbook = XLSX.readFile("data/students.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 2. حوّل البيانات إلى JSON
    const data: any[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`📊 تم العثور على ${data.length} طالب في الملف`);

    // 3. أدخل البيانات في قاعدة البيانات
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // تحويل البيانات وتنظيفها
        const studentData = {
          // البيانات الأساسية (مطلوبة)
          fullName: row.fullName?.toString().trim(),
          nationalId: row.nationalId?.toString().trim(),
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
            (row.StudyMode.toString().toUpperCase() === "REGULAR" ? StudyMode.REGULAR : StudyMode.DISTANCE) 
            : null,
          
          enrollmentStatus: row.EnrollmentStatus ? 
            (row.EnrollmentStatus.toString().toUpperCase() === "NEW" ? EnrollmentStatus.NEW : EnrollmentStatus.REPEATER) 
            : null,
          
          studentStatus: row.studentStatus ? 
            convertStudentStatus(row.studentStatus.toString()) 
            : StudentStatus.ACTIVE,
          
          // بيانات الاتصال
          studentPhone: row.studentPhone?.toString().trim() || null,
          guardianName: row.guardianName?.toString().trim() || null,
          
          // ربط مع الجداول الأخرى (اختياري)
          parentId: row.parentId?.toString().trim() || null,
          gradeId: row.gradeId ? Number(row.gradeId) : null,
          classId: row.classId ? Number(row.classId) : null,
        };

        // التحقق من البيانات المطلوبة
        if (!studentData.fullName || !studentData.nationalId) {
          console.warn(`⚠️ تخطي الصف ${i + 1}: بيانات مفقودة (الاسم أو رقم الهوية)`);
          continue;
        }

        // إنشاء الطالب
        const student = await prisma.student.create({
          data: studentData,
        });

        console.log(`✅ تم إنشاء الطالب: ${student.fullName} (ID: ${student.id})`);

      } catch (error) {
        console.error(`❌ خطأ في الصف ${i + 1}:`, error);
        // استمر في المعالجة حتى لو فشل صف واحد
        continue;
      }
    }

    console.log("🎉 تم إكمال عملية الاستيراد");

  } catch (error) {
    console.error("❌ خطأ في قراءة الملف:", error);
  }
}

// دالة مساعدة لتحويل حالة الطالب
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