const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTestData() {
  try {
    console.log('🚀 إضافة بيانات تجريبية...');

    // إضافة موظفين إداريين
    await prisma.staff.createMany({
      data: [
        {
          id: 'staff_test_1',
          fullName: 'منسق الشؤون الطلابية',
          nationalId: '123456789',
          birthday: new Date('1985-01-01'),
          phone1: '0501234567'
        },
        {
          id: 'staff_test_2', 
          fullName: 'مسؤول الامتحانات',
          nationalId: '987654321',
          birthday: new Date('1980-05-15'),
          phone1: '0509876543'
        },
        {
          id: 'staff_test_3',
          fullName: 'منسق الأنشطة',
          nationalId: '555666777',
          birthday: new Date('1988-10-20'),
          phone1: '0555666777'
        }
      ],
      skipDuplicates: true
    });
    console.log('✅ تم إضافة الموظفين الإداريين');

    // إضافة معلمين
    await prisma.teacher.createMany({
      data: [
        {
          id: 'teacher_test_1',
          fullName: 'الأستاذ أحمد محمد',
          nationalId: '111222333',
          birthday: new Date('1975-03-10'),
          phone: '0501112223'
        },
        {
          id: 'teacher_test_2',
          fullName: 'الأستاذة فاطمة علي',
          nationalId: '444555666', 
          birthday: new Date('1982-09-20'),
          phone: '0504445556'
        },
        {
          id: 'teacher_test_3',
          fullName: 'الأستاذ محمد خالد',
          nationalId: '777999888',
          birthday: new Date('1978-12-05'),
          phone: '0507779998'
        }
      ],
      skipDuplicates: true
    });
    console.log('✅ تم إضافة المعلمين');

    // إضافة طلاب
    await prisma.student.createMany({
      data: [
        {
          id: 'student_test_1',
          fullName: 'محمد أحمد إبراهيم',
          nationalId: '333444555',
          birthday: new Date('2005-12-01'),
          placeOfBirth: 'الرياض',
          address: 'الرياض - حي النرجس',
          nationality: 'سعودي',
          studentPhone: '0503334445'
        },
        {
          id: 'student_test_2',
          fullName: 'فاطمة محمد علي',
          nationalId: '666777888',
          birthday: new Date('2006-08-15'),
          placeOfBirth: 'جدة',
          address: 'جدة - حي الصفا',
          nationality: 'سعودي',
          studentPhone: '0506667778'
        },
        {
          id: 'student_test_3',
          fullName: 'عبدالله سالم أحمد',
          nationalId: '999111222',
          birthday: new Date('2005-04-20'),
          placeOfBirth: 'الدمام',
          address: 'الدمام - حي الفردوس',
          nationality: 'سعودي',
          studentPhone: '0509991112'
        }
      ],
      skipDuplicates: true
    });
    console.log('✅ تم إضافة الطلاب');

    // إضافة مدير نظام
    await prisma.admin.createMany({
      data: [
        {
          id: 'admin_test_1',
          username: 'مدير النظام الرئيسي'
        },
        {
          id: 'admin_test_2', 
          username: 'نائب مدير النظام'
        }
      ],
      skipDuplicates: true
    });
    console.log('✅ تم إضافة المديرين');

    console.log('\n🎉 تم إضافة جميع البيانات التجريبية بنجاح!');
    console.log('\n📋 البيانات المضافة:');
    console.log('   👥 3 موظفين إداريين');
    console.log('   👨‍🏫 3 معلمين');
    console.log('   🎓 3 طلاب');
    console.log('   🏛️ 2 مديرين للنظام');
    console.log('\n🚀 يمكنك الآن اختبار نظام الرسائل!');

  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData();
