const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 بدء التنظيف المتقدم للمشروع...');

// 1. حذف الملفات والمجلدات غير الضرورية
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
    'prisma/shadow.db',
    '*.log',
    '.DS_Store',
    'Thumbs.db'
];

console.log('📁 حذف الملفات والمجلدات...');
toDelete.forEach(item => {
    const itemPath = path.join(__dirname, item);
    if (fs.existsSync(itemPath)) {
        try {
            if (fs.lstatSync(itemPath).isDirectory()) {
                fs.rmSync(itemPath, { recursive: true, force: true });
                console.log(`✅ حذف المجلد: ${item}`);
            } else {
                fs.unlinkSync(itemPath);
                console.log(`✅ حذف الملف: ${item}`);
            }
        } catch (error) {
            console.log(`⚠️  خطأ في حذف: ${item} - ${error.message}`);
        }
    }
});

// 2. تنظيف الكاش
console.log('🗑️  تنظيف الكاش...');
try {
    if (process.platform === 'win32') {
        execSync('npm cache clean --force', { stdio: 'inherit' });
    } else {
        execSync('npm cache clean --force', { stdio: 'inherit' });
    }
    console.log('✅ تم تنظيف كاش npm');
} catch (error) {
    console.log('⚠️  خطأ في تنظيف كاش npm');
}

// 3. حذف الملفات المكررة
console.log('🔍 البحث عن الملفات المكررة...');
const componentsDir = path.join(__dirname, 'src/components');
if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir);
    const duplicates = [];

    files.forEach(file => {
        if (file.includes('copy') || file.includes('Copy')) {
            duplicates.push(file);
        }
    });

    if (duplicates.length > 0) {
        console.log('📋 الملفات المكررة الموجودة:');
        duplicates.forEach(file => {
            console.log(`   - ${file}`);
        });
    } else {
        console.log('✅ لا توجد ملفات مكررة');
    }
}

// 4. تحليل حجم الملفات
console.log('📊 تحليل أحجام الملفات...');
const analyzeFile = (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        const sizeInKB = Math.round(stats.size / 1024);
        if (sizeInKB > 20) {
            console.log(`   ⚠️  ملف كبير: ${path.basename(filePath)} (${sizeInKB}KB)`);
        }
    } catch (error) {
        // تجاهل الأخطاء
    }
};

const walkDir = (dir) => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                analyzeFile(filePath);
            }
        });
    }
};

walkDir(path.join(__dirname, 'src'));

console.log('\n🎉 تم التنظيف المتقدم بنجاح!');
console.log('\n💡 الخطوات التالية:');
console.log('   1. pnpm install');
console.log('   2. pnpm run dev:fast');
console.log('   3. راجع ملف PERFORMANCE.md');
console.log('   4. استخدم pnpm run clean:cache إذا احتجت');


