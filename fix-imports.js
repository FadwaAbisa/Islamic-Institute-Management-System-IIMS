const fs = require('fs');
const path = require('path');

console.log('🔧 بدء إصلاح مسارات الاستيراد...');

// قائمة المكونات التي تم نقلها
const movedComponents = {
    'Announcements': 'ads/Announcements',
    'BigCalendarContainer': 'calendar/BigCalendarContainer',
    'AttendanceChartContainer': 'attendance/AttendanceChartContainer',
    'CountChartContainer': 'stats/CountChartContainer',
    'EventCalendarContainer': 'calendar/EventCalendarContainer',
    'FinanceChart': 'stats/FinanceChart',
    'UserCard': 'core/UserCard',
    'HomeAds': 'ads/HomeAds',
    'Menu': 'core/Menu',
    'MenuWrapper': 'core/MenuWrapper',
    'Navbar': 'core/Navbar',
    'FormContainer': 'forms/FormContainer',
    'Pagination': 'tables/Pagination',
    'Table': 'tables/Table',
    'TableSearch': 'tables/TableSearch',
    'StudentAttendanceCard': 'students/StudentAttendanceCard',
    'BigCalendar': 'calendar/BigCalender',
    'EventCalendar': 'calendar/EventCalendar',
    'Performance': 'stats/Performance',
    'PDFViewer': 'core/PDFViewer'
};

// دالة لإصلاح ملف واحد
function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // إصلاح الاستيرادات
        Object.entries(movedComponents).forEach(([oldName, newPath]) => {
            const oldImport = `from "@/components/${oldName}"`;
            const newImport = `from "@/components/${newPath}"`;

            if (content.includes(oldImport)) {
                content = content.replace(new RegExp(oldImport, 'g'), newImport);
                hasChanges = true;
                console.log(`✅ تم إصلاح: ${oldName} -> ${newPath} في ${filePath}`);
            }
        });

        // إصلاح الاستيرادات بدون default
        Object.entries(movedComponents).forEach(([oldName, newPath]) => {
            const oldImport = `from "@/components/${oldName}"`;
            const newImport = `from "@/components/${newPath}"`;

            if (content.includes(oldImport)) {
                content = content.replace(new RegExp(oldImport, 'g'), newImport);
                hasChanges = true;
                console.log(`✅ تم إصلاح: ${oldName} -> ${newPath} في ${filePath}`);
            }
        });

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    } catch (error) {
        console.log(`⚠️  خطأ في معالجة ${filePath}: ${error.message}`);
    }
}

// دالة للمرور على جميع الملفات
function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            walkDir(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fixFile(filePath);
        }
    });
}

// بدء الإصلاح
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
    walkDir(srcDir);
    console.log('🎉 تم إصلاح جميع مسارات الاستيراد!');
} else {
    console.log('❌ مجلد src غير موجود');
}
