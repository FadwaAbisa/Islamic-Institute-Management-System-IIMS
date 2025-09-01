const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

// دالة لتحويل التواريخ من تنسيق Excel إلى DateTime
function parseDate(dateValue) {
  if (!dateValue || dateValue === 'لا يوجد') {
    return null;
  }
  
  // إذا كان الرقم من Excel (Excel date serial number)
  if (typeof dateValue === 'number') {
    const excelEpoch = new Date(1900, 0, 1);
    const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
    return date;
  }
  
  // إذا كان نص
  if (typeof dateValue === 'string') {
    // تنسيق DD-MM-YYYY
    const parts = dateValue.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
  }
  
  return null;
}

// دالة لتحويل الحالة الاجتماعية
function parseMaritalStatus(status) {
  if (!status || status === 'لا يوجد') return null;
  
  const statusMap = {
    'أعزب': 'SINGLE',
    'متزوج': 'MARRIED',
    'متزوجة': 'MARRIED',
    'مطلق': 'DIVORCED',
    'مطلقة': 'DIVORCED',
    'أرمل': 'WIDOWED',
    'أرملة': 'WIDOWED'
  };
  
  return statusMap[status] || null;
}

// دالة لتنظيف النصوص
function cleanText(text) {
  if (!text || text === 'لا يوجد' || text === '') {
    return null;
  }
  return text.toString().trim();
}

// دالة لتحويل سنة التخرج
function parseGraduationYear(year) {
  if (!year || year === 'لا يوجد') return null;
  return year.toString();
}

async function importStaffFromExcel() {
  try {
    console.log('🚀 بدء استيراد بيانات الموظفين...');
    
    // قراءة ملف Excel
    const filePath = path.join(__dirname, 'data', 'staff_db.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 تم العثور على ${data.length} موظف في الملف`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // التحقق من البيانات المطلوبة
        if (!row['الاسم الكامل (مطلوب)'] || !row['الرقم الوطني/الجواز (مطلوب)']) {
          throw new Error('الاسم الكامل أو الرقم الوطني مفقود');
        }
        
        // تحضير البيانات
        const staffData = {
          fullName: cleanText(row['الاسم الكامل (مطلوب)']),
          nationalId: row['الرقم الوطني/الجواز (مطلوب)'].toString(),
          birthday: parseDate(row['تاريخ الميلاد (YYYY-MM-DD)']),
          maritalStatus: parseMaritalStatus(row['الحالة الاجتماعية']),
          address: cleanText(row['عنوان السكن']),
          phone1: cleanText(row['هاتف أول (مطلوب)']),
          appointmentDate: parseDate(row['تاريخ التعيين (YYYY-MM-DD)']),
          serviceStartDate: parseDate(row['تاريخ بداية الخدمة (YYYY-MM-DD)']),
          academicQualification: cleanText(row['المؤهل العلمي']),
          educationalInstitution: cleanText(row['المؤسسة التعليمية']),
          majorSpecialization: cleanText(row['التخصص الرئيسي']),
          graduationYear: parseGraduationYear(row['سنة التخرج'])
        };
        
        // التحقق من وجود الموظف مسبقاً
        const existingStaff = await prisma.staff.findUnique({
          where: { nationalId: staffData.nationalId }
        });
        
        if (existingStaff) {
          console.log(`⚠️  الموظف ${staffData.fullName} موجود مسبقاً (الرقم الوطني: ${staffData.nationalId})`);
          continue;
        }
        
        // إدراج الموظف
        const newStaff = await prisma.staff.create({
          data: staffData
        });
        
        console.log(`✅ تم إدراج الموظف: ${newStaff.fullName} (ID: ${newStaff.id})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ خطأ في الصف ${i + 1}: ${error.message}`);
        errors.push({
          row: i + 1,
          name: row['الاسم الكامل (مطلوب)'] || 'غير محدد',
          error: error.message
        });
        errorCount++;
      }
    }
    
    console.log('\n📈 ملخص الاستيراد:');
    console.log(`✅ تم إدراج ${successCount} موظف بنجاح`);
    console.log(`❌ فشل في إدراج ${errorCount} موظف`);
    
    if (errors.length > 0) {
      console.log('\n🔍 تفاصيل الأخطاء:');
      errors.forEach(error => {
        console.log(`الصف ${error.row}: ${error.name} - ${error.error}`);
      });
    }
    
  } catch (error) {
    console.error('💥 خطأ عام في الاستيراد:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل الاستيراد
importStaffFromExcel();
