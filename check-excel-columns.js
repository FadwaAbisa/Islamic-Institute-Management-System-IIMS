const ExcelJS = require("exceljs");

async function checkExcelColumns() {
    try {
        console.log('=== فحص أسماء الأعمدة في ملف الإكسل ===\n');

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile('./data/students_db.xlsx');

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error("لم يتم العثور على ورقة عمل في الملف");
        }

        // عرض أسماء الأعمدة
        const headers = [];
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            if (cell.value) {
                headers.push({
                    column: colNumber,
                    value: cell.value.toString()
                });
            }
        });

        console.log('\nأسماء الأعمدة:');
        headers.forEach((header, index) => {
            console.log(`${index + 1}. العمود ${header.column}: "${header.value}"`);
        });

        // فحص أول صف من البيانات
        console.log('\n=== أول صف من البيانات ===');
        const firstRow = {};
        if (worksheet.rowCount > 1) {
            worksheet.getRow(2).eachCell((cell, colNumber) => {
                const header = worksheet.getRow(1).getCell(colNumber).value?.toString();
                if (header) {
                    firstRow[header] = cell.value?.toString() || null;
                }
            });
        }

        console.log('بيانات أول صف:');
        Object.entries(firstRow).forEach(([key, value]) => {
            console.log(`"${key}": "${value}"`);
        });

    } catch (error) {
        console.error("خطأ في فحص الأعمدة:", error);
    }
}

checkExcelColumns();
