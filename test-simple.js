// اختبار سريع للنسخة البسيطة

async function testSimpleVersion() {
    try {
        console.log('🔍 اختبار النسخة البسيطة...');

        // انتظار تحميل الخادم
        await new Promise(resolve => setTimeout(resolve, 5000));

        const url = 'http://localhost:3003/list/students/grades/enhanced';
        console.log('📞 اختبار الصفحة:', url);

        const response = await fetch(url);
        console.log(`📊 استجابة الخادم: ${response.status} ${response.statusText}`);

        if (response.ok) {
            console.log('✅ الصفحة تعمل بنجاح!');
            const html = await response.text();
            if (html.includes('نظام إدارة الدرجات المتطور')) {
                console.log('✅ المحتوى محمل بشكل صحيح');
            } else {
                console.log('⚠️ المحتوى قد لا يكون صحيحاً');
            }
        } else {
            console.log('❌ خطأ في الصفحة:', response.status);
            const text = await response.text();
            console.log('📝 رسالة الخطأ:', text.substring(0, 300));
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

testSimpleVersion();


