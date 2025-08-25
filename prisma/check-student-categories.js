const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkStudentCategories() {
    try {
        console.log("🔍 فحص التصنيفات المختلفة للطلاب...");

        // إحصائيات عامة
        const totalStudents = await prisma.student.count();
        console.log(`📊 إجمالي عدد الطلاب: ${totalStudents}`);

        // تصنيف حسب نظام الدراسة
        console.log("\n👥 تصنيف حسب نظام الدراسة:");
        const studyModeStats = await prisma.student.groupBy({
            by: ['studyMode'],
            _count: { studyMode: true }
        });

        studyModeStats.forEach(stat => {
            const mode = stat.studyMode === 'REGULAR' ? 'نظامي' : 'انتساب';
            console.log(`  ${mode}: ${stat._count.studyMode} طالب`);
        });

        // تصنيف حسب صفة القيد
        console.log("\n🆕 تصنيف حسب صفة القيد:");
        const enrollmentStats = await prisma.student.groupBy({
            by: ['enrollmentStatus'],
            _count: { enrollmentStatus: true }
        });

        enrollmentStats.forEach(stat => {
            const status = stat.enrollmentStatus === 'NEW' ? 'مستجد' : 'معيد';
            console.log(`  ${status}: ${stat._count.enrollmentStatus} طالب`);
        });

        // تصنيف حسب حالة الطالب
        console.log("\n✅ تصنيف حسب حالة الطالب:");
        const studentStatusStats = await prisma.student.groupBy({
            by: ['studentStatus'],
            _count: { studentStatus: true }
        });

        studentStatusStats.forEach(stat => {
            let status = '';
            switch (stat.studentStatus) {
                case 'ACTIVE': status = 'نشط'; break;
                case 'GRADUATED': status = 'متخرج'; break;
                case 'DROPPED': status = 'منقطع'; break;
                case 'SUSPENDED': status = 'موقوف'; break;
                case 'EXPELLED': status = 'مطرود'; break;
                case 'PAUSED': status = 'إيقاف قيد'; break;
                default: status = stat.studentStatus;
            }
            console.log(`  ${status}: ${stat._count.studentStatus} طالب`);
        });

        // تصنيف حسب المستوى الدراسي
        console.log("\n📚 تصنيف حسب المستوى الدراسي:");
        const levelStats = await prisma.student.groupBy({
            by: ['studyLevel'],
            _count: { studyLevel: true }
        });

        levelStats.forEach(stat => {
            let level = '';
            switch (stat.studyLevel) {
                case '1': level = 'السنة الأولى'; break;
                case '2': level = 'السنة الثانية'; break;
                case '3': level = 'السنة الثالثة'; break;
                case '4': level = 'السنة الرابعة'; break;
                case '5': level = 'السنة الخامسة'; break;
                case '6': level = 'السنة السادسة'; break;
                default: level = stat.studyLevel;
            }
            console.log(`  ${level}: ${stat._count.studyLevel} طالب`);
        });

        // عينة من الطلاب المتخرجين
        console.log("\n🎓 عينة من الطلاب المتخرجين:");
        const graduatedStudents = await prisma.student.findMany({
            where: { studentStatus: 'GRADUATED' },
            select: {
                fullName: true,
                studyMode: true,
                enrollmentStatus: true
            },
            take: 5
        });

        graduatedStudents.forEach((student, index) => {
            const mode = student.studyMode === 'REGULAR' ? 'نظامي' : 'انتساب';
            const enrollment = student.enrollmentStatus === 'NEW' ? 'مستجد' : 'معيد';
            console.log(`  ${index + 1}. ${student.fullName} (${mode} - ${enrollment})`);
        });

        // عينة من الطلاب المنتسبين
        console.log("\n📚 عينة من الطلاب المنتسبين:");
        const distanceStudents = await prisma.student.findMany({
            where: { studyMode: 'DISTANCE' },
            select: {
                fullName: true,
                studentStatus: true,
                enrollmentStatus: true
            },
            take: 5
        });

        distanceStudents.forEach((student, index) => {
            let status = '';
            switch (student.studentStatus) {
                case 'ACTIVE': status = 'نشط'; break;
                case 'GRADUATED': status = 'متخرج'; break;
                default: status = student.studentStatus;
            }
            const enrollment = student.enrollmentStatus === 'NEW' ? 'مستجد' : 'معيد';
            console.log(`  ${index + 1}. ${student.fullName} (${status} - ${enrollment})`);
        });

        console.log("\n🎯 تم فحص جميع التصنيفات بنجاح!");

    } catch (error) {
        console.error("❌ خطأ في فحص التصنيفات:", error);
    }
}

// تشغيل السكريبت
checkStudentCategories()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
