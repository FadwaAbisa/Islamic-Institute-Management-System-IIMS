const ExcelJS = require("exceljs");

async function checkExcelData() {
    try {
        console.log("🔍 فحص بيانات ملف Excel...");

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile("data/students_db.xlsx");

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error("لم يتم العثور على ورقة عمل في الملف");
        }

        const data = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // تخطي الصف الأول (العناوين)

            const rowData = {};
            row.eachCell((cell, colNumber) => {
                const header = worksheet.getRow(1).getCell(colNumber).value?.toString() || '';
                rowData[header] = cell.value?.toString() || '';
            });
            data.push(rowData);
        });

        console.log(`📊 عدد الصفوف: ${data.length}`);

        if (data.length > 0) {
            const headers = worksheet.getRow(1).values?.slice(1) || [];
            console.log(`📋 أسماء الأعمدة:`, headers);

            console.log(`📄 أول صف من البيانات:`, data[0]);
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
