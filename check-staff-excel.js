const ExcelJS = require("exceljs");

async function checkStaffExcel() {
    try {
        console.log("🔍 فحص بيانات ملف Excel للموظفين...");

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile("data/staff_db.xlsx");

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

        console.log(`📊 تم العثور على ${data.length} صف في الملف`);

        if (data.length === 0) {
            console.log("⚠️ الملف فارغ");
            return;
        }

        // عرض أسماء الأعمدة
        const firstRow = data[0];
        const columns = Object.keys(firstRow);

        console.log("\n📋 أسماء الأعمدة الموجودة:");
        columns.forEach((col, index) => {
            console.log(`   ${index + 1}. ${col}`);
        });

        // عرض أول 3 صفوف كمثال
        console.log("\n📝 مثال على البيانات (أول 3 صفوف):");
        data.slice(0, 3).forEach((row, index) => {
            console.log(`\n   الصف ${index + 1}:`);
            Object.entries(row).forEach(([key, value]) => {
                console.log(`     ${key}: ${value}`);
            });
        });

        // فحص البيانات المطلوبة
        console.log("\n🔍 فحص البيانات المطلوبة:");
        const requiredColumns = ['fullName', 'nationalId', 'phone1'];
        const missingColumns = requiredColumns.filter(col => !columns.includes(col));

        if (missingColumns.length === 0) {
            console.log("✅ جميع الأعمدة المطلوبة موجودة");
        } else {
            console.log("❌ الأعمدة المفقودة:", missingColumns.join(', '));
        }

        // فحص البيانات الفارغة
        let emptyRows = 0;
        data.forEach((row, index) => {
            if (!row.fullName || !row.nationalId || !row.phone1) {
                emptyRows++;
                if (emptyRows <= 5) { // عرض أول 5 صفوف فارغة فقط
                    console.log(`⚠️ الصف ${index + 1} يحتوي على بيانات مفقودة:`, {
                        fullName: row.fullName || 'مفقود',
                        nationalId: row.nationalId || 'مفقود',
                        phone1: row.phone1 || 'مفقود'
                    });
                }
            }
        });

        if (emptyRows > 0) {
            console.log(`⚠️ إجمالي الصفوف التي تحتوي على بيانات مفقودة: ${emptyRows}`);
        } else {
            console.log("✅ جميع الصفوف تحتوي على البيانات المطلوبة");
        }

    } catch (error) {
        console.error("❌ خطأ في قراءة الملف:", error.message);

        if (error.code === 'ENOENT') {
            console.error("📁 تأكد من وجود مجلد 'data' وملف 'staff_db.xlsx' بداخله");
        }
    }
}

checkStaffExcel();
