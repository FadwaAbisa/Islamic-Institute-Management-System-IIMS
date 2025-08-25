const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");

const prisma = new PrismaClient();

// دالة مساعدة لتحويل حالة الطالب
function convertStudentStatus(status) {
    if (!status) return "ACTIVE";

    const statusMap = {
        "مستمر": "ACTIVE",
        "منقطع": "DROPPED",
        "موقوف": "SUSPENDED",
        "مطرود": "EXPELLED",
        "إيقاف قيد": "PAUSED",
        "متخرج": "GRADUATED", // تغيير إلى GRADUATED
        "ACTIVE": "ACTIVE",
        "DROPPED": "DROPPED",
        "SUSPENDED": "SUSPENDED",
        "EXPELLED": "EXPELLED",
        "PAUSED": "PAUSED",
        "GRADUATED": "GRADUATED"
    };

    return statusMap[status.trim()] || "ACTIVE";
}

// دالة مساعدة لتحويل نظام الدراسة
function convertStudyMode(mode) {
    if (!mode) return "REGULAR";

    const modeMap = {
        "نظامي": "REGULAR",
        "انتساب": "DISTANCE",
        "REGULAR": "REGULAR",
        "DISTANCE": "DISTANCE"
    };

    return modeMap[mode.trim()] || "REGULAR";
}

// دالة مساعدة لتحويل صفة القيد
function convertEnrollmentStatus(status) {
    if (!status) return "NEW";

    const statusMap = {
        "مستجد": "NEW",
        "مستجدة": "NEW",
        "معيد": "REPEATER",
        "معيدة": "REPEATER",
        "NEW": "NEW",
        "REPEATER": "REPEATER"
    };

    return statusMap[status.trim()] || "NEW";
}

// دالة مساعدة لتحويل المستوى الدراسي
function convertStudyLevel(level) {
    if (!level) return "1";

    const levelMap = {
        "السنة الأولى": "1",
        "السنة الثانية": "2",
        "السنة الثالثة": "3",
        "السنة الرابعة": "4",
        "السنة الخامسة": "5",
        "السنة السادسة": "6"
    };

    return levelMap[level.trim()] || "1";
}

async function resetAndImport() {
    try {
        console.log("🔄 بدء عملية إعادة تعيين قاعدة البيانات...");

        // 1. حذف جميع البيانات من الجداول (بترتيب صحيح لتجنب مشاكل العلاقات)
        console.log("🗑️ حذف البيانات من الجداول...");

        // حذف البيانات من الجداول التي تعتمد على جداول أخرى أولاً
        await prisma.subjectGrade.deleteMany({});
        console.log("✅ تم حذف درجات المواد");

        await prisma.result.deleteMany({});
        console.log("✅ تم حذف النتائج");

        await prisma.attendance.deleteMany({});
        console.log("✅ تم حذف سجلات الحضور");

        await prisma.assignment.deleteMany({});
        console.log("✅ تم حذف الواجبات");

        await prisma.exam.deleteMany({});
        console.log("✅ تم حذف الامتحانات");

        await prisma.lesson.deleteMany({});
        console.log("✅ تم حذف الدروس");

        await prisma.announcement.deleteMany({});
        console.log("✅ تم حذف الإعلانات");

        await prisma.event.deleteMany({});
        console.log("✅ تم حذف الأحداث");

        await prisma.student.deleteMany({});
        console.log("✅ تم حذف الطلاب");

        await prisma.teacher.deleteMany({});
        console.log("✅ تم حذف المعلمين");

        await prisma.parent.deleteMany({});
        console.log("✅ تم حذف أولياء الأمور");

        await prisma.class.deleteMany({});
        console.log("✅ تم حذف الفصول");

        await prisma.grade.deleteMany({});
        console.log("✅ تم حذف المراحل");

        await prisma.subject.deleteMany({});
        console.log("✅ تم حذف المواد");

        await prisma.admin.deleteMany({});
        console.log("✅ تم حذف المشرفين");

        console.log("🎯 تم حذف جميع البيانات من قاعدة البيانات");

        // 2. إعادة إنشاء البيانات الأساسية
        console.log("\n🏗️ إعادة إنشاء البيانات الأساسية...");

        // إنشاء المراحل الدراسية
        const grades = await Promise.all([
            prisma.grade.create({ data: { level: 1 } }),
            prisma.grade.create({ data: { level: 2 } }),
            prisma.grade.create({ data: { level: 3 } }),
            prisma.grade.create({ data: { level: 4 } }),
            prisma.grade.create({ data: { level: 5 } }),
            prisma.grade.create({ data: { level: 6 } })
        ]);
        console.log("✅ تم إنشاء المراحل الدراسية");

        // إنشاء المواد الأساسية
        const subjects = [
            "القرآن الكريم و احكام التجويد",
            "علم الحديث",
            "الفقه",
            "التفسير",
            "العقيدة",
            "الدراسات الادبية",
            "الدراسات اللغوية",
            "السيرة",
            "اللغة الانجليزية",
            "الحاسوب",
            "منهج الدعوة",
            "أصول الفقة"
        ];

        const createdSubjects = await Promise.all(
            subjects.map(name =>
                prisma.subject.create({ data: { name } })
            )
        );
        console.log("✅ تم إنشاء المواد الدراسية");

        // إنشاء الفصول الدراسية
        const classes = await Promise.all([
            prisma.class.create({
                data: {
                    name: "الصف الأول أ",
                    capacity: 30,
                    gradeId: grades[0].id
                }
            }),
            prisma.class.create({
                data: {
                    name: "الصف الأول ب",
                    capacity: 30,
                    gradeId: grades[0].id
                }
            }),
            prisma.class.create({
                data: {
                    name: "الصف الثاني أ",
                    capacity: 30,
                    gradeId: grades[1].id
                }
            }),
            prisma.class.create({
                data: {
                    name: "الصف الثاني ب",
                    capacity: 30,
                    gradeId: grades[1].id
                }
            })
        ]);
        console.log("✅ تم إنشاء الفصول الدراسية");

        // 3. استيراد الطلاب من ملف الإكسل
        console.log("\n📊 بدء استيراد الطلاب من ملف الإكسل...");

        try {
            // قراءة ملف الإكسل
            const workbook = XLSX.readFile("data/students_db.xlsx");
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // تحويل البيانات إلى JSON
            const data = XLSX.utils.sheet_to_json(sheet);

            console.log(`📊 تم العثور على ${data.length} طالب في الملف`);

            // إحصائيات التصنيفات
            let regularCount = 0;
            let distanceCount = 0;
            let newCount = 0;
            let repeaterCount = 0;
            let activeCount = 0;
            let graduatedCount = 0;

            // معالجة كل طالب
            for (let i = 0; i < data.length; i++) {
                const row = data[i];

                try {
                    // تحويل البيانات وتنظيفها مع مراعاة التصنيفات
                    const studentData = {
                        fullName: row.fullName?.toString().trim() || row.name?.toString().trim() || row.studentName?.toString().trim(),
                        nationalId: row.nationalId?.toString().trim() || row.studentId?.toString().trim() || row.id?.toString().trim(),
                        sex: row.sex === "ذكر" || row.sex === "MALE" ? "MALE" : "FEMALE",
                        birthday: row.birthday ? new Date(row.birthday) : new Date('2000-01-01'),
                        placeOfBirth: row.placeOfBirth?.toString().trim() || "غير محدد",
                        nationality: row.nationality?.toString().trim() || "عراقي",
                        address: row.address?.toString().trim() || "غير محدد",
                        studentPhone: row.studentPhone?.toString().trim() || row.phone?.toString().trim() || null,
                        guardianName: row.guardianName?.toString().trim() || row.parentName?.toString().trim() || null,
                        relationship: row.relationship?.toString().trim() || "ولي أمر",
                        guardianPhone: row.guardianPhone?.toString().trim() || null,
                        previousSchool: row.previousSchool?.toString().trim() || null,
                        previousLevel: row.previousLevel?.toString().trim() || null,
                        healthCondition: row.healthCondition?.toString().trim() || null,
                        chronicDiseases: row.chronicDiseases?.toString().trim() || null,
                        allergies: row.allergies?.toString().trim() || null,
                        specialNeeds: row.specialNeeds?.toString().trim() || null,
                        emergencyContactName: row.emergencyContactName?.toString().trim() || null,
                        emergencyContactPhone: row.emergencyContactPhone?.toString().trim() || null,
                        emergencyContactAddress: row.emergencyContactAddress?.toString().trim() || null,
                        notes: row.notes?.toString().trim() || null,
                        academicYear: row.academicYear?.toString().trim() || "2024-2025",
                        studyLevel: convertStudyLevel(row.studyLevel),
                        specialization: row.specialization?.toString().trim() || row.subject?.toString().trim() || "الدراسات الإسلامية",

                        // استخدام التصنيفات الفعلية من ملف الإكسل
                        studyMode: convertStudyMode(row.StudyMode),
                        enrollmentStatus: convertEnrollmentStatus(row.EnrollmentStatus),
                        studentStatus: convertStudentStatus(row.studentStatus),

                        gradeId: row.gradeId ? Number(row.gradeId) : grades[0].id,
                        classId: row.classId ? Number(row.classId) : classes[0].id
                    };

                    // التحقق من البيانات المطلوبة
                    if (!studentData.fullName || !studentData.nationalId) {
                        console.warn(`⚠️ تخطي الصف ${i + 1}: بيانات مفقودة (الاسم أو رقم الهوية)`);
                        continue;
                    }

                    // تحديث الإحصائيات
                    if (studentData.studyMode === "REGULAR") regularCount++;
                    else if (studentData.studyMode === "DISTANCE") distanceCount++;

                    if (studentData.enrollmentStatus === "NEW") newCount++;
                    else if (studentData.enrollmentStatus === "REPEATER") repeaterCount++;

                    if (studentData.studentStatus === "ACTIVE") activeCount++;
                    else if (studentData.studentStatus === "GRADUATED") graduatedCount++;

                    // إنشاء الطالب
                    const student = await prisma.student.create({
                        data: studentData,
                    });

                    console.log(`✅ تم إنشاء الطالب: ${student.fullName} (${studentData.studyMode === "REGULAR" ? "نظامي" : "انتساب"})`);

                } catch (error) {
                    console.error(`❌ خطأ في الصف ${i + 1}:`, error);
                    continue;
                }
            }

            // عرض إحصائيات التصنيفات
            console.log("\n📊 إحصائيات التصنيفات:");
            console.log(`👥 الطلاب النظاميون: ${regularCount}`);
            console.log(`📚 الطلاب المنتسبون: ${distanceCount}`);
            console.log(`🆕 الطلاب المستجدون: ${newCount}`);
            console.log(`🔄 الطلاب المعيدون: ${repeaterCount}`);
            console.log(`✅ الطلاب النشطون: ${activeCount}`);
            console.log(`🎓 الطلاب المتخرجون: ${graduatedCount}`);

            console.log("🎉 تم إكمال استيراد الطلاب");

        } catch (error) {
            console.error("❌ خطأ في قراءة ملف الإكسل:", error);
        }

        console.log("\n🎯 تم إكمال عملية إعادة تعيين قاعدة البيانات بنجاح!");

    } catch (error) {
        console.error("❌ خطأ في العملية:", error);
    }
}

// تشغيل السكريبت
resetAndImport()
    .catch((e) => {
        console.error("❌ خطأ عام:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 تم قطع الاتصال مع قاعدة البيانات");
    });
