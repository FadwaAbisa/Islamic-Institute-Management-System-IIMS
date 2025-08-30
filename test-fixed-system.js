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

            // اختبار API للطلاب المصفين
            const studentsAPI = 'http://localhost:3003/api/students/filtered?academicYear=2024-2025&educationLevel=السنة الأولى&studySystem=نظامي&subject=الدراسات الأدبية&period=الفترة الثالثة';
            const studentsResponse = await fetch(studentsAPI);

            if (studentsResponse.ok) {
                const studentsData = await studentsResponse.json();
                console.log(`✅ API الطلاب يعمل: ${studentsData.count} طالب`);
            } else {
                console.log('❌ مشكلة في API الطلاب');
            }

        } else {
            console.log('❌ خطأ في الصفحة:', response.status);
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

testFixedSystem();


