// سكريبت لإصلاح مشاكل Next.js

const fs = require('fs');
const path = require('path');

console.log('🔧 بدء إصلاح المشروع...');

try {
    // حذف مجلد .next إذا كان موجود
    const nextPath = path.join(__dirname, '.next');
    if (fs.existsSync(nextPath)) {
        console.log('🗑️ حذف مجلد .next...');
        fs.rmSync(nextPath, { recursive: true, force: true });
        console.log('✅ تم حذف مجلد .next');
    }

    // حذف مجلد node_modules/.cache إذا كان موجود
    const cachePath = path.join(__dirname, 'node_modules', '.cache');
    if (fs.existsSync(cachePath)) {
        console.log('🗑️ حذف مجلد cache...');
        fs.rmSync(cachePath, { recursive: true, force: true });
        console.log('✅ تم حذف مجلد cache');
    }

    console.log('✅ تم إصلاح المشروع بنجاح!');
    console.log('🚀 يمكنك الآن تشغيل: pnpm dev');

} catch (error) {
    console.error('❌ خطأ في الإصلاح:', error.message);
}


