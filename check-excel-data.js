const XLSX = require('xlsx');

// قراءة ملف الإكسل
const workbook = XLSX.readFile('./data/students_db.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

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
