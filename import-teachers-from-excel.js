const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

// دالة لتحويل التواريخ من تنسيق Excel إلى DateTime
function parseDate(dateValue) {
  if (!dateValue || dateValue === '/' || dateValue === 'لا يوجد') {
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
  if (!status || status === '/' || status === 'لا يوجد') return null;
  
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

// دالة لتحويل حالة التوظيف
function parseEmploymentStatus(status) {
  if (!status || status === '/' || status === 'لا يوجد') return null;
  
  const statusMap = {
    'تعيين': 'APPOINTMENT',
    'عقد': 'CONTRACT',
    'ندب': 'SECONDMENT'
  };
  
  return statusMap[status] || null;
}

// دالة لتنظيف النصوص
function cleanText(text) {
  if (!text || text === '/' || text === 'لا يوجد' || text === '') {
    return null;
  }
  return text.toString().trim();
}

// دالة لتحويل سنة التخرج
function parseGraduationYear(year) {
  if (!year || year === '/' || year === 'لا يوجد') return null;
  return year.toString();
}

// دالة لتنظيف أرقام الهواتف
function cleanPhone(phone) {
  if (!phone || phone === '/' || phone === 'لا يوجد') return null;
  
  // تحويل الرقم إلى نص وإزالة المسافات والشرطات
  let phoneStr = phone.toString().replace(/[\s-]/g, '');
  
  // إضافة 0 في البداية إذا لم تكن موجودة
  if (phoneStr.length === 9 && !phoneStr.startsWith('0')) {
    phoneStr = '0' + phoneStr;
  }
  
  return phoneStr;
}

async function importTeachersFromExcel() {
  try {
    console.log('🚀 بدء استيراد بيانات المعلمين...');
    
    // قراءة ملف Excel
    const filePath = path.join(__dirname, 'data', 'teachers_db.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 تم العثور على ${data.length} معلم في الملف`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // التحقق من البيانات المطلوبة
        if (!row.fullName || !row.nationalId) {
          throw new Error('الاسم الكامل أو الرقم الوطني مفقود');
        }
        
        // تحضير البيانات
        const teacherData = {
          fullName: cleanText(row.fullName),
          nationalId: row.nationalId.toString(),
          birthday: parseDate(row.birthday),
          nationality: cleanText(row.nationality),
          address: cleanText(row.address),
          phone1: cleanPhone(row.phone1),
          phone2: cleanPhone(row.phone2),
          appointmentDate: parseDate(row.appointmentDate),
          contractEndDate: parseDate(row[' contractEndDate']), // لاحظ المسافة في بداية اسم العمود
          serviceStartDate: parseDate(row.serviceStartDate),
          academicQualification: cleanText(row.academicQualification),
          educationalInstitution: cleanText(row.educationalInstitution),
          majorSpecialization: cleanText(row.majorSpecialization),
          minorSpecialization: cleanText(row.minorSpecialization),
          graduationYear: parseGraduationYear(row.graduationYear),
          maritalStatus: parseMaritalStatus(row['maritalStatus ']), // لاحظ المسافة في نهاية اسم العمود
          employmentStatus: parseEmploymentStatus(row.employmentStatus),
          emergencyContactName: cleanText(row.emergencyContactName),
          emergencyContactRelation: cleanText(row.emergencyContactRelation)
        };
        
        // التحقق من وجود المعلم مسبقاً
        const existingTeacher = await prisma.teacher.findUnique({
          where: { nationalId: teacherData.nationalId }
        });
        
        if (existingTeacher) {
          console.log(`⚠️  المعلم ${teacherData.fullName} موجود مسبقاً (الرقم الوطني: ${teacherData.nationalId})`);
          continue;
        }
        
        // إدراج المعلم
        const newTeacher = await prisma.teacher.create({
          data: teacherData
        });
        
        console.log(`✅ تم إدراج المعلم: ${newTeacher.fullName} (ID: ${newTeacher.id})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ خطأ في الصف ${i + 1}: ${error.message}`);
        errors.push({
          row: i + 1,
          name: row.fullName || 'غير محدد',
          error: error.message
        });
        errorCount++;
      }
    }
    
    console.log('\n📈 ملخص الاستيراد:');
    console.log(`✅ تم إدراج ${successCount} معلم بنجاح`);
    console.log(`❌ فشل في إدراج ${errorCount} معلم`);
    
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
importTeachersFromExcel();
