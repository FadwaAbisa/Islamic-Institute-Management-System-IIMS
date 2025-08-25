import * as XLSX from "xlsx";

async function checkExcelData() {
    try {
        console.log("🔍 فحص بيانات ملف Excel...");

        // 1. افتح الملف
        const workbook = XLSX.readFile("data/students_db.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        console.log(`📊 اسم الشيت: ${sheetName}`);
        console.log(`📊 عدد الصفوف: ${XLSX.utils.sheet_to_json(sheet).length}`);

        // 2. عرض أسماء الأعمدة
        const headers = Object.keys(XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] || []);
        console.log(`📋 أسماء الأعمدة:`, headers);

        // 3. حوّل البيانات إلى JSON
        const data: any[] = XLSX.utils.sheet_to_json(sheet);

        // 4. عرض أول 3 صفوف للتحقق
        console.log("\n📋 أول 3 صفوف من البيانات:");
        for (let i = 0; i < Math.min(3, data.length); i++) {
            console.log(`\n--- الصف ${i + 1} ---`);
            console.log(JSON.stringify(data[i], null, 2));
        }

        // 5. فحص البيانات المهمة
        console.log("\n🔍 فحص البيانات المهمة:");

        const studyLevels = Array.from(new Set(data.map(row => row.studyLevel || row.level || row.class).filter(Boolean)));
        console.log(`📚 المراحل الدراسية الموجودة:`, studyLevels);

        const specializations = Array.from(new Set(data.map(row => row.specialization || row.subject).filter(Boolean)));
        console.log(`🎯 التخصصات الموجودة:`, specializations);

        const academicYears = Array.from(new Set(data.map(row => row.academicYear).filter(Boolean)));
        console.log(`📅 الأعوام الدراسية:`, academicYears);

        const studyModes = Array.from(new Set(data.map(row => row.studyMode || row.StudyMode).filter(Boolean)));
        console.log(`📖 أنظمة الدراسة:`, studyModes);

        // 6. فحص البيانات المفقودة
        console.log("\n⚠️ فحص البيانات المفقودة:");

        const missingNames = data.filter(row => !row.fullName && !row.name && !row.studentName).length;
        console.log(`❌ صفوف بدون أسماء: ${missingNames}`);

        const missingIds = data.filter(row => !row.nationalId && !row.studentId && !row.id).length;
        console.log(`❌ صفوف بدون هويات: ${missingIds}`);

        const missingStudyLevels = data.filter(row => !row.studyLevel && !row.level && !row.class).length;
        console.log(`❌ صفوف بدون مراحل دراسية: ${missingStudyLevels}`);

        // 7. اقتراحات للاستيراد
        console.log("\n💡 اقتراحات للاستيراد:");

        if (missingStudyLevels > 0) {
            console.log(`   • ${missingStudyLevels} طالب بدون مرحلة دراسية - سيتم تعيين "1" كافتراضي`);
        }

        if (missingNames > 0 || missingIds > 0) {
            console.log(`   • ${missingNames + missingIds} صفوف تحتوي على بيانات ناقصة - سيتم تخطيها`);
        }

        console.log(`   • إجمالي الطلاب الصالحين للاستيراد: ${data.length - Math.max(missingNames, missingIds)}`);

    } catch (error) {
        console.error("❌ خطأ في فحص الملف:", error);
    }
}

// تشغيل السكريبت
checkExcelData()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    });
