const XLSX = require("xlsx");

async function checkExcelData() {
    try {
        console.log("🔍 فحص البيانات الفعلية في ملف الإكسل...");
        
        // قراءة ملف الإكسل
        const workbook = XLSX.readFile("data/students_db.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // تحويل البيانات إلى JSON
        const data = XLSX.utils.sheet_to_json(sheet);
        
        console.log(`📊 إجمالي عدد الصفوف: ${data.length}`);
        
        if (data.length > 0) {
            console.log("\n📋 عناوين الأعمدة:");
            const headers = Object.keys(data[0]);
            headers.forEach((header, index) => {
                console.log(`${index + 1}. ${header}`);
            });
            
            console.log("\n📊 عينة من البيانات (أول 3 صفوف):");
            for (let i = 0; i < Math.min(3, data.length); i++) {
                const row = data[i];
                console.log(`\n--- الصف ${i + 1} ---`);
                
                // عرض البيانات المهمة للتصنيف
                if (row.studentStatus) console.log(`studentStatus: ${row.studentStatus}`);
                if (row.StudyMode) console.log(`StudyMode: ${row.StudyMode}`);
                if (row.EnrollmentStatus) console.log(`EnrollmentStatus: ${row.EnrollmentStatus}`);
                if (row.studyLevel) console.log(`studyLevel: ${row.studyLevel}`);
                if (row.specialization) console.log(`specialization: ${row.specialization}`);
                if (row.academicYear) console.log(`academicYear: ${row.academicYear}`);
            }
            
            // إحصائيات التصنيفات
            console.log("\n📈 إحصائيات التصنيفات:");
            
            // تصنيف حسب studentStatus
            const statusCounts = {};
            data.forEach(row => {
                const status = row.studentStatus || 'غير محدد';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
            console.log("\nحسب studentStatus:");
            Object.entries(statusCounts).forEach(([status, count]) => {
                console.log(`  ${status}: ${count}`);
            });
            
            // تصنيف حسب StudyMode
            const modeCounts = {};
            data.forEach(row => {
                const mode = row.StudyMode || 'غير محدد';
                modeCounts[mode] = (modeCounts[mode] || 0) + 1;
            });
            console.log("\nحسب StudyMode:");
            Object.entries(modeCounts).forEach(([mode, count]) => {
                console.log(`  ${mode}: ${count}`);
            });
            
            // تصنيف حسب EnrollmentStatus
            const enrollmentCounts = {};
            data.forEach(row => {
                const enrollment = row.EnrollmentStatus || 'غير محدد';
                enrollmentCounts[enrollment] = (enrollmentCounts[enrollment] || 0) + 1;
            });
            console.log("\nحسب EnrollmentStatus:");
            Object.entries(enrollmentCounts).forEach(([enrollment, count]) => {
                console.log(`  ${enrollment}: ${count}`);
            });
            
            // تصنيف حسب studyLevel
            const levelCounts = {};
            data.forEach(row => {
                const level = row.studyLevel || 'غير محدد';
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            });
            console.log("\nحسب studyLevel:");
            Object.entries(levelCounts).forEach(([level, count]) => {
                console.log(`  ${level}: ${count}`);
            });
            
            // تصنيف حسب specialization
            const specCounts = {};
            data.forEach(row => {
                const spec = row.specialization || 'غير محدد';
                specCounts[spec] = (specCounts[spec] || 0) + 1;
            });
            console.log("\nحسب specialization:");
            Object.entries(specCounts).forEach(([spec, count]) => {
                console.log(`  ${spec}: ${count}`);
            });
        }
        
    } catch (error) {
        console.error("❌ خطأ في قراءة ملف الإكسل:", error);
    }
}

// تشغيل السكريبت
checkExcelData()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    });
