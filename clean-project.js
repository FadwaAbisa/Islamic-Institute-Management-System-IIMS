const fs = require('fs');
const path = require('path');

console.log('🧹 بدء تنظيف المشروع...');

// الملفات والمجلدات التي يجب حذفها
const toDelete = [
    '.next',
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.cache',
    '.temp',
    '*.tsbuildinfo',
    'prisma/dev.db',
    'prisma/shadow.db'
];

// حذف الملفات والمجلدات
toDelete.forEach(item => {
    const itemPath = path.join(__dirname, item);
    if (fs.existsSync(itemPath)) {
        if (fs.lstatSync(itemPath).isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
            console.log(`✅ حذف المجلد: ${item}`);
        } else {
            fs.unlinkSync(itemPath);
            console.log(`✅ حذف الملف: ${item}`);
        }
    }
});

console.log('🎉 تم تنظيف المشروع بنجاح!');
console.log('💡 الآن قم بتشغيل: pnpm install');


