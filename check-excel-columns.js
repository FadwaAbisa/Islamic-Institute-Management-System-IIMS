const XLSX = require('xlsx');

// قراءة ملف الإكسل
const workbook = XLSX.readFile('./data/students_db.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

console.log('=== فحص أسماء الأعمدة في ملف الإكسل ===\n');

// الحصول على نطاق البيانات
const range = XLSX.utils.decode_range(worksheet['!ref']);
console.log('نطاق البيانات:', worksheet['!ref']);

// عرض أسماء الأعمدة
const headers = [];
for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    const cellValue = worksheet[cellAddress];
    if (cellValue) {
        headers.push({
            column: col,
            address: cellAddress,
            value: cellValue.v
        });
    }
}

console.log('\nأسماء الأعمدة:');
headers.forEach((header, index) => {
    console.log(`${index + 1}. العمود ${header.column}: "${header.value}"`);
});

// فحص أول صف من البيانات
console.log('\n=== أول صف من البيانات ===');
const firstRow = {};
headers.forEach(header => {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: header.column });
    const cellValue = worksheet[cellAddress];
    firstRow[header.value] = cellValue ? cellValue.v : null;
});

console.log('بيانات أول صف:');
Object.entries(firstRow).forEach(([key, value]) => {
    console.log(`"${key}": "${value}"`);
});
