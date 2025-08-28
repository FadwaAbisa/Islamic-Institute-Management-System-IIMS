const XLSX = require("xlsx");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("🚀 بدء عملية استيراد بيانات الموظفين الإداريين...");

        // 1. افتح الملف
        const workbook = XLSX.readFile("data/staff_db.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // 2. حوّل البيانات إلى JSON
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`📊 تم العثور على ${data.length} موظف في الملف`);

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
                if (!row['الاسم الكامل (مطلوب)'] || !row['الرقم الوطني/الجواز (مطلوب)'] || !row['هاتف أول (مطلوب)']) {
                    console.warn(`⚠️ تخطي الصف ${i + 1}: بيانات مفقودة (الاسم: ${row['الاسم الكامل (مطلوب)']}, الهوية: ${row['الرقم الوطني/الجواز (مطلوب)']}, الهاتف: ${row['هاتف أول (مطلوب)']})`);
                    errorCount++;
                    continue;
                }

                // تحضير البيانات
                const staffData = {
                    // البيانات الأساسية (مطلوبة)
                    fullName: row['الاسم الكامل (مطلوب)'].toString().trim(),
                    nationalId: row['الرقم الوطني/الجواز (مطلوب)'].toString().trim(),
                    phone1: row['هاتف أول (مطلوب)'].toString().trim(),

                    // البيانات الاختيارية
                    birthday: row['تاريخ الميلاد (YYYY-MM-DD)'] ? parseDate(row['تاريخ الميلاد (YYYY-MM-DD)'].toString()) : new Date('1990-01-01'),
                    address: row['عنوان السكن']?.toString().trim() || null,
                    
                    // البيانات الوظيفية
                    appointmentDate: row['تاريخ التعيين (YYYY-MM-DD)'] ? parseDate(row['تاريخ التعيين (YYYY-MM-DD)'].toString()) : null,
                    serviceStartDate: row['تاريخ بداية الخدمة (YYYY-MM-DD)'] ? parseDate(row['تاريخ بداية الخدمة (YYYY-MM-DD)'].toString()) : null,
                    
                    // البيانات التعليمية
                    academicQualification: row['المؤهل العلمي']?.toString().trim() || null,
                    educationalInstitution: row['المؤسسة التعليمية']?.toString().trim() || null,
                    majorSpecialization: row['التخصص الرئيسي']?.toString().trim() || null,
                    graduationYear: row['سنة التخرج']?.toString().trim() || null,

                    // تحويل Enums
                    maritalStatus: row['الحالة الاجتماعية'] ? 
                        convertMaritalStatus(row['الحالة الاجتماعية'].toString()) : null,
                };

                // إنشاء الموظف
                const staff = await prisma.staff.create({
                    data: {
                        ...staffData,
                        id: staffData.nationalId, // استخدام الرقم الوطني كمعرف فريد
                    },
                });

                console.log(`✅ [${i + 1}/${data.length}] تم إنشاء الموظف: ${staff.fullName}`);
                successCount++;

            } catch (error) {
                console.error(`❌ خطأ في الصف ${i + 1} (${row.fullName || 'غير معروف'}):`, error.message);

                // إذا كان خطأ في المفتاح المكرر
                if (error.code === 'P2002') {
                    console.error(`   - رقم الهوية ${row.nationalId} موجود مسبقاً`);
                }
                errorCount++;
            }
        }

        console.log("\n📈 ملخص العملية:");
        console.log(`✅ نجح: ${successCount} موظف`);
        console.log(`❌ فشل: ${errorCount} موظف`);
        console.log(`📊 إجمالي: ${data.length} سجل`);

    } catch (error) {
        console.error("❌ خطأ في قراءة الملف:", error.message);

        if (error.code === 'ENOENT') {
            console.error("📁 تأكد من وجود مجلد 'data' وملف 'staff_db.xlsx' بداخله");
        }
    }
}

function parseDate(dateStr) {
    if (!dateStr || dateStr === 'لا يوجد') return null;
    
    // تنسيق DD-MM-YYYY
    if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // الشهر يبدأ من 0
            const year = parseInt(parts[2]);
            
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(year, month, day);
            }
        }
    }
    
    // تنسيق YYYY-MM-DD
    if (dateStr.includes('-') && dateStr.length === 10) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    
    // تنسيق DD/MM/YYYY
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // الشهر يبدأ من 0
            const year = parseInt(parts[2]);
            
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(year, month, day);
            }
        }
    }
    
    // إذا كان رقم Excel (عدد الأيام منذ 1900)
    if (!isNaN(dateStr) && dateStr > 1000) {
        const excelDate = new Date((parseInt(dateStr) - 25569) * 86400 * 1000);
        if (!isNaN(excelDate.getTime())) {
            return excelDate;
        }
    }
    
    // إذا فشل التحليل، استخدم تاريخ افتراضي
    console.warn(`⚠️ تعذر تحليل التاريخ: ${dateStr}، سيتم استخدام تاريخ افتراضي`);
    return new Date('1990-01-01');
}

function convertMaritalStatus(status) {
    const statusMap = {
        "أعزب": "SINGLE",
        "متزوج": "MARRIED",
        "مطلق": "DIVORCED",
        "أرمل": "WIDOWED",
        "متزوجة": "MARRIED",
        "أرملة": "WIDOWED",
        "SINGLE": "SINGLE",
        "MARRIED": "MARRIED",
        "DIVORCED": "DIVORCED",
        "WIDOWED": "WIDOWED",
    };

    return statusMap[status.trim()] || "SINGLE";
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
