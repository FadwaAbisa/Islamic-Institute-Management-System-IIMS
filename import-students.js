const ExcelJS = require("exceljs");
const { PrismaClient, StudentStatus, StudyMode, EnrollmentStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function importStudents() {
    try {
        console.log('📚 بدء استيراد الطلاب...');

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile("data/students_db.xlsx");

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error("لم يتم العثور على ورقة عمل في الملف");
        }

        const data = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // تخطي الصف الأول (العناوين)

            const rowData = {};
            row.eachCell((cell, colNumber) => {
                const header = worksheet.getRow(1).getCell(colNumber).value?.toString() || '';
                rowData[header] = cell.value?.toString() || '';
            });
            data.push(rowData);
        });

        console.log(`تم العثور على ${data.length} طالب في ملف الإكسل`);

        // عرض أسماء الأعمدة للتحقق
        if (data.length > 0) {
            console.log('\n=== أسماء الأعمدة في ملف الإكسل ===');
            console.log(Object.keys(data[0]));
        }

        let successCount = 0;
        let errorCount = 0;

        // مجموعة لتتبع الأرقام الوطنية المستخدمة
        const usedNationalIds = new Set();

        for (const row of data) {
            try {
                // تحويل البيانات مع التعامل مع الأعمدة الجديدة
                const studentData = {
                    fullName: (row.fullName || row['الاسم الكامل'] || '').trim(),
                    nationalId: String(row.nationalId || row['الرقم الوطني'] || '').trim(),
                    birthday: row.birthday || row['تاريخ الميلاد'] ? new Date(row.birthday || row['تاريخ الميلاد']) : new Date(),
                    placeOfBirth: (row.placeOfBirth || row['مكان الميلاد'] || '').trim(),
                    address: (row.address || row['العنوان'] || '').trim(),
                    nationality: (row.nationality || row['الجنسية'] || '').trim(),
                    studentPhone: row.studentPhone || row['هاتف الطالب'] ? String(row.studentPhone || row['هاتف الطالب']).trim() : null,
                    academicYear: (row.academicYear || row['السنة الدراسية'] || '').trim() || null,

                    // الأعمدة الجديدة - محاولة العثور على الأسماء الصحيحة
                    studyLevel: (row.studyLevel || row['المستوى الدراسي'] || row['StudyLevel'] || '').trim() || null,
                    specialization: row.specialization || row['التخصص'] || null,
                    studyMode: (row.studyMode || row['StudyMode'] || row['نوع الدراسة'] || '').trim() || null,
                    enrollmentStatus: (row.enrollmentStatus || row['EnrollmentStatus'] || row['حالة التسجيل'] || '').trim() || null,
                    studentStatus: (row.studentStatus || row['StudentStatus'] || row['حالة الطالب'] || '').trim() || null,

                    guardianName: row.guardianName || row['اسم ولي الأمر'] || null,
                    relationship: row.relationship || row['صلة القرابة'] || null,
                    guardianPhone: row.guardianPhone || row['هاتف ولي الأمر'] || null,
                    previousSchool: row.previousSchool || row['المدرسة السابقة'] || null,
                    previousLevel: row.previousLevel || row['المستوى السابق'] || null,
                    healthCondition: row.healthCondition || row['الحالة الصحية'] || null,
                    chronicDiseases: row.chronicDiseases || row['الأمراض المزمنة'] || null,
                    allergies: row.allergies || row['الحساسية'] || null,
                    specialNeeds: row.specialNeeds || row['الاحتياجات الخاصة'] || null,
                    emergencyContactName: row.emergencyContactName || row['اسم الطوارئ'] || null,
                    emergencyContactPhone: row.emergencyContactPhone || row['هاتف الطوارئ'] || null,
                    emergencyContactAddress: row.emergencyContactAddress || row['عنوان الطوارئ'] || null,
                    notes: row.notes || row['ملاحظات'] || null
                };

                // التحقق من البيانات المطلوبة
                if (!studentData.fullName || !studentData.nationalId) {
                    console.log(`تخطي صف: البيانات غير مكتملة - ${JSON.stringify(row)}`);
                    errorCount++;
                    continue;
                }

                // التحقق من عدم تكرار الرقم الوطني
                if (usedNationalIds.has(studentData.nationalId)) {
                    console.log(`تخطي صف: الرقم الوطني مكرر - ${studentData.nationalId} (${studentData.fullName})`);
                    errorCount++;
                    continue;
                }

                // إنشاء الطالب
                const student = await prisma.student.create({
                    data: studentData
                });

                // إضافة الرقم الوطني للمجموعة
                usedNationalIds.add(studentData.nationalId);

                console.log(`تم إضافة الطالب: ${student.fullName} (${student.nationalId})`);
                console.log(`  - studyLevel: ${student.studyLevel || 'غير محدد'}`);
                console.log(`  - studyMode: ${student.studyMode || 'غير محدد'}`);
                console.log(`  - enrollmentStatus: ${student.enrollmentStatus || 'غير محدد'}`);
                console.log(`  - studentStatus: ${student.studentStatus || 'غير محدد'}`);

                successCount++;

            } catch (error) {
                console.error(`خطأ في إضافة الطالب:`, error.message);
                errorCount++;
            }
        }

        console.log(`\n✅ تم الانتهاء من الاستيراد:`);
        console.log(`- نجح: ${successCount} طالب`);
        console.log(`- فشل: ${errorCount} طالب`);

    } catch (error) {
        console.error('❌ خطأ في استيراد الطلاب:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// تشغيل الدالة
importStudents();
