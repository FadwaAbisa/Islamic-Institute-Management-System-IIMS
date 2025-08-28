const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearStudentsAndSubjects() {
    try {
        console.log('بدء عملية تفريغ الجداول...');

        // تفريغ جدول SubjectGrade أولاً (لأنه مرتبط بالطلاب والمواد)
        console.log('جاري تفريغ جدول SubjectGrade...');
        const deletedSubjectGrades = await prisma.subjectGrade.deleteMany({});
        console.log(`تم حذف ${deletedSubjectGrades.count} سجل من جدول SubjectGrade`);

        // تفريغ جدول Attendance (لأنه مرتبط بالطلاب)
        console.log('جاري تفريغ جدول Attendance...');
        const deletedAttendance = await prisma.attendance.deleteMany({});
        console.log(`تم حذف ${deletedAttendance.count} سجل من جدول Attendance`);

        // تفريغ جدول TeacherSubject (لأنه مرتبط بالمواد)
        console.log('جاري تفريغ جدول TeacherSubject...');
        const deletedTeacherSubjects = await prisma.teacherSubject.deleteMany({});
        console.log(`تم حذف ${deletedTeacherSubjects.count} سجل من جدول TeacherSubject`);

        // تفريغ جدول الطلاب
        console.log('جاري تفريغ جدول الطلاب...');
        const deletedStudents = await prisma.student.deleteMany({});
        console.log(`تم حذف ${deletedStudents.count} طالب من جدول الطلاب`);

        // تفريغ جدول المواد
        console.log('جاري تفريغ جدول المواد...');
        const deletedSubjects = await prisma.subject.deleteMany({});
        console.log(`تم حذف ${deletedSubjects.count} مادة من جدول المواد`);

        console.log('✅ تم تفريغ جميع الجداول بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في عملية التفريغ:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// تشغيل السكريبت
clearStudentsAndSubjects();
