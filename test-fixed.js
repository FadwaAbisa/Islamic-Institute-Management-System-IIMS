// اختبار النظام المصحح

async function testFixedSystem() {
    try {
        console.log('🔍 اختبار النظام المصحح...');

        await new Promise(resolve => setTimeout(resolve, 3000));

        const url = 'http://localhost:3003/list/students/grades/enhanced';
        console.log('📞 اختبار الصفحة:', url);

        const response = await fetch(url);
        console.log(`📊 استجابة الخادم: ${response.status} ${response.statusText}`);

        if (response.ok) {
            console.log('✅ الصفحة تعمل بنجاح!');
            const html = await response.text();

            // فحص المحتوى
            if (html.includes('نظام إدارة الدرجات المتطور')) {
                console.log('✅ العنوان الرئيسي موجود');
            }

            if (html.includes('الفترة الثالثة')) {
                console.log('✅ تبويب الفترة الثالثة موجود');
            }

            if (html.includes('ThirdPeriodManager')) {
                console.log('✅ مكون الفترة الثالثة محمل');
            } else {
                console.log('⚠️ مكون الفترة الثالثة غير محمل');
            }

        } else {
            console.log('❌ خطأ في الصفحة:', response.status);
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

testFixedSystem();


