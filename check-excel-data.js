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

        console.log('=== فحص بيانات ملف الإكسل ===\n');

        // فحص أول 5 صفوف
        for (let i = 0; i < Math.min(5, data.length); i++) {
            const row = data[i];
            console.log(`\n--- الصف ${i + 1} ---`);
            console.log('الاسم:', row.fullName || row['الاسم الرباعي'] || 'غير موجود');
            console.log('المستوى الدراسي:', row.studyLevel || row['المستوى الدراسي'] || 'غير موجود');
            console.log('نوع الدراسة:', row.studyMode || row['نوع الدراسة'] || 'غير موجود');
            console.log('حالة التسجيل:', row.enrollmentStatus || row['حالة التسجيل'] || 'غير موجود');
            console.log('حالة الطالب:', row.studentStatus || row['حالة الطالب'] || 'غير موجود');
        }

        console.log('\n=== إحصائيات ===');
        console.log('إجمالي الصفوف:', data.length);

        // فحص الحقول الفارغة
        let studyLevelCount = 0;
        let studyModeCount = 0;
        let enrollmentStatusCount = 0;
        let studentStatusCount = 0;

        data.forEach(row => {
            if (row.studyLevel || row['المستوى الدراسي']) studyLevelCount++;
            if (row.studyMode || row['نوع الدراسة']) studyModeCount++;
            if (row.enrollmentStatus || row['حالة التسجيل']) enrollmentStatusCount++;
            if (row.studentStatus || row['حالة الطالب']) studentStatusCount++;
        });

        console.log('صفوف تحتوي على المستوى الدراسي:', studyLevelCount);
        console.log('صفوف تحتوي على نوع الدراسة:', studyModeCount);
        console.log('صفوف تحتوي على حالة التسجيل:', enrollmentStatusCount);
        console.log('صفوف تحتوي على حالة الطالب:', studentStatusCount);

    } catch (error) {
        console.error("خطأ في فحص البيانات:", error);
    }
}

checkExcelData();
