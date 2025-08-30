const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkStudents() {
    try {
        console.log('🔍 فحص قاعدة البيانات...');

        // عدد الطلاب الإجمالي
        const totalStudents = await prisma.student.count();
        console.log(`📊 إجمالي الطلاب: ${totalStudents}`);

        if (totalStudents === 0) {
            console.log('⚠️ لا يوجد طلاب في قاعدة البيانات!');
            return;
        }

        // عرض أول 5 طلاب
        const sampleStudents = await prisma.student.findMany({
            take: 5,
            select: {
                id: true,
                fullName: true,
                nationalId: true,
                academicYear: true,
                studyLevel: true,
                studyMode: true,
                specialization: true,
                studentStatus: true
            }
        });

        console.log('\n📋 عينة من الطلاب:');
        sampleStudents.forEach((student, index) => {
            console.log(`${index + 1}. ${student.fullName}`);
            console.log(`   الرقم الوطني: ${student.nationalId || 'غير محدد'}`);
            console.log(`   العام الدراسي: ${student.academicYear || 'غير محدد'}`);
            console.log(`   المرحلة: ${student.studyLevel || 'غير محدد'}`);
            console.log(`   النظام: ${student.studyMode || 'غير محدد'}`);
            console.log(`   التخصص: ${student.specialization || 'غير محدد'}`);
            console.log(`   الحالة: ${student.studentStatus || 'غير محدد'}`);
            console.log('   ---');
        });

        // إحصائيات حسب المراحل
        const levelStats = await prisma.student.groupBy({
            by: ['studyLevel'],
            _count: true
        });

        console.log('\n📈 إحصائيات المراحل:');
        levelStats.forEach(stat => {
            console.log(`   ${stat.studyLevel || 'غير محدد'}: ${stat._count} طالب`);
        });

        // إحصائيات حسب نظام الدراسة
        const modeStats = await prisma.student.groupBy({
            by: ['studyMode'],
            _count: true
        });

        console.log('\n📈 إحصائيات نظام الدراسة:');
        modeStats.forEach(stat => {
            console.log(`   ${stat.studyMode || 'غير محدد'}: ${stat._count} طالب`);
        });

        // إحصائيات حسب العام الدراسي
        const yearStats = await prisma.student.groupBy({
            by: ['academicYear'],
            _count: true
        });

        console.log('\n📈 إحصائيات العام الدراسي:');
        yearStats.forEach(stat => {
            console.log(`   ${stat.academicYear || 'غير محدد'}: ${stat._count} طالب`);
        });

        console.log('\n✅ تم الفحص بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في فحص قاعدة البيانات:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkStudents();
