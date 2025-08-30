// اختبار النظام الجديد

async function testNewSystem() {
    try {
        console.log('🔍 اختبار النظام الجديد...');

        // انتظار تحميل الخادم
        await new Promise(resolve => setTimeout(resolve, 8000));

        const url = 'http://localhost:3003/list/students/grades/enhanced';
        console.log('📞 اختبار الصفحة:', url);

        const response = await fetch(url);
        console.log(`📊 استجابة الخادم: ${response.status} ${response.statusText}`);

        if (response.ok) {
            console.log('✅ الصفحة تعمل بنجاح!');
            const html = await response.text();

            // فحص المحتوى الجديد
            if (html.includes('مجموع الفترة الأولى')) {
                console.log('✅ عنوان "مجموع الفترة الأولى" موجود');
            } else {
                console.log('❌ عنوان "مجموع الفترة الأولى" غير موجود');
            }

            if (html.includes('مجموع الفترة الثانية')) {
                console.log('✅ عنوان "مجموع الفترة الثانية" موجود');
            } else {
                console.log('❌ عنوان "مجموع الفترة الثانية" غير موجود');
            }

            if (html.includes('درجة الفترة الثالثة')) {
                console.log('✅ عنوان "درجة الفترة الثالثة" موجود');
            } else {
                console.log('❌ عنوان "درجة الفترة الثالثة" غير موجود');
            }

            if (html.includes('المجموع النهائي')) {
                console.log('✅ عنوان "المجموع النهائي" موجود');
            } else {
                console.log('❌ عنوان "المجموع النهائي" غير موجود');
            }

            // فحص العناوين القديمة
            if (html.includes('الشهر الأول')) {
                console.log('⚠️ العنوان القديم "الشهر الأول" ما زال موجود!');
            } else {
                console.log('✅ العنوان القديم "الشهر الأول" تم إزالته');
            }

        } else {
            console.log('❌ خطأ في الصفحة:', response.status);
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

testNewSystem();


