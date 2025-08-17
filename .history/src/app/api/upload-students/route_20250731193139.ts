import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'لم يتم العثور على ملف' }, { status: 400 });
    }

    // قراءة ملف Excel
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('بيانات Excel:', data);

    const results = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      
      try {
        // تنظيف وتحويل البيانات
        const studentData = await processStudentData(row, i + 2); // +2 لأن الصف الأول هو العناوين
        
        if (studentData) {
          // إنشاء الطالب
          const student = await createStudent(studentData);
          results.push({ row: i + 2, student: student.name, status: 'نجح' });
        }
      } catch (error: any) {
        console.error(`خطأ في الصف ${i + 2}:`, error);
        errors.push({ 
          row: i + 2, 
          error: error.message || 'خطأ غير معروف',
          data: row 
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `تم إضافة ${results.length} طالب بنجاح`,
      results,
      errors,
      total: data.length
    });

  } catch (error: any) {
    console.error('خطأ في معالجة الملف:', error);
    return NextResponse.json(
      { error: 'خطأ في معالجة الملف: ' + error.message }, 
      { status: 500 }
    );
  }
}

async function processStudentData(row: any, rowNumber: number) {
  // تنظيف أسماء الأعمدة (إزالة المسافات والأحرف الخاصة)
  const cleanRow: any = {};
  Object.keys(row).forEach(key => {
    const cleanKey = key.trim();
    cleanRow[cleanKey] = row[key];
  });

  // استخراج البيانات مع التحقق من وجودها
  const fullName = cleanRow['الاسم الرباعي (مطلوب)'] || cleanRow['الاسم الرباعي'] || '';
  const birthDate = cleanRow['تاريخ الميلاد (YYYY-MM-DD)'] || cleanRow['تاريخ الميلاد'] || '';
  const gender = cleanRow['الجنس (مطلوب: ذكر/أنثى)'] || cleanRow['الجنس'] || '';
  const nationality = cleanRow['الجنسية'] || '';
  const nationalId = cleanRow['الرقم الوطني (فريد)'] || cleanRow['الرقم الوطني'] || '';
  const birthPlace = cleanRow['مكان الميلاد'] || '';
  const address = cleanRow['العنوان'] || '';
  const studentPhone = cleanRow['هاتف الطالب'] || '';
  const parentPhone = cleanRow['هاتف ولي الأمر'] || '';
  const parentName = cleanRow['اسم ولي الأمر'] || '';
  const relationship = cleanRow['صلة القرابة'] || '';
  const branch = cleanRow['الفرع (مطلوب إذا لم يكن المستخدم مقيدًا بفرع)'] || cleanRow['الفرع'] || '';
  const studentStatus = cleanRow['حالة الطالب (مطلوب: مستمر/منقطع/موقوف/مطرود/إيقاف قيد)'] || cleanRow['حالة الطالب'] || '';
  const studySystem = cleanRow['النظام الدراسي (مطلوب: نظامي/انتساب)'] || cleanRow['النظام الدراسي'] || '';
  const enrollmentType = cleanRow['الصفة القيد (مطلوب: مستجد/معيد)'] || cleanRow['الصفة القيد'] || '';
  const academicYear = cleanRow['العام الدراسي (اسم العام كما هو في النظام، مطلوب)'] || cleanRow['العام الدراسي'] || '';
  const gradeLevel = cleanRow['المرحلة الدراسية (اسم المرحلة كما هو في النظام، مطلوب)'] || cleanRow['المرحلة الدراسية'] || '';
  const specialization = cleanRow['الشعبة التخصصية'] || '';

  // التحقق من البيانات المطلوبة
  if (!fullName.trim()) {
    throw new Error(`الاسم الرباعي مطلوب في الصف ${rowNumber}`);
  }

  if (!birthDate) {
    throw new Error(`تاريخ الميلاد مطلوب في الصف ${rowNumber}`);
  }

  if (!gender || (gender !== 'ذكر' && gender !== 'أنثى')) {
    throw new Error(`الجنس مطلوب ويجب أن يكون 'ذكر' أو 'أنثى' في الصف ${rowNumber}`);
  }

  if (!gradeLevel.trim()) {
    throw new Error(`المرحلة الدراسية مطلوبة في الصف ${rowNumber}`);
  }

  // تقسيم الاسم الرباعي
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // تحويل الجنس
  const sex = gender === 'ذكر' ? 'MALE' : 'FEMALE';

  // تحويل تاريخ الميلاد
  let birthday: Date;
  try {
    if (typeof birthDate === 'number') {
      // إذا كان Excel قد حول التاريخ إلى رقم
      birthday = new Date((birthDate - 25569) * 86400 * 1000);
    } else {
      birthday = new Date(birthDate);
    }
    
    if (isNaN(birthday.getTime())) {
      throw new Error('تنسيق تاريخ غير صحيح');
    }
  } catch (error) {
    throw new Error(`تنسيق تاريخ الميلاد غير صحيح في الصف ${rowNumber}. يجب أن يكون بتنسيق YYYY-MM-DD`);
  }

  return {
    fullName,
    firstName,
    lastName,
    birthday,
    sex,
    nationality,
    nationalId,
    birthPlace,
    address: address || 'غير محدد',
    studentPhone,
    parentPhone,
    parentName,
    relationship,
    branch,
    studentStatus,
    studySystem,
    enrollmentType,
    academicYear,
    gradeLevel,
    specialization
  };
}

async function createStudent(data: any) {
  // إنشاء username فريد باستخدام الرقم الوطني أو اسم عشوائي
  const username = data.nationalId || `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // البحث عن أو إنشاء Grade
  let grade = await prisma.grade.findFirst({
    where: {
      level: parseInt(data.gradeLevel) || 1
    }
  });

  if (!grade) {
    grade = await prisma.grade.create({
      data: {
        level: parseInt(data.gradeLevel) || 1
      }
    });
  }

  // البحث عن أو إنشاء Class
  let classRecord = await prisma.class.findFirst({
    where: {
      name: data.branch || 'الصف الأول',
      gradeId: grade.id
    }
  });

  if (!classRecord) {
    classRecord = await prisma.class.create({
      data: {
        name: data.branch || 'الصف الأول',
        capacity: 30,
        gradeId: grade.id
      }
    });
  }

  // البحث عن أو إنشاء Parent
  let parent = await prisma.parent.findFirst({
    where: {
      phone: data.parentPhone
    }
  });

  if (!parent && data.parentPhone) {
    const parentUsername = `parent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    parent = await prisma.parent.create({
      data: {
        id: parentUsername,
        username: parentUsername,
        name: data.parentName || 'ولي أمر',
        surname: '',
        phone: data.parentPhone,
        address: data.address
      }
    });
  }

  // إذا لم يتم العثور على ولي أمر، إنشاء واحد افتراضي
  if (!parent) {
    const parentUsername = `parent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    parent = await prisma.parent.create({
      data: {
        id: parentUsername,
        username: parentUsername,
        name: 'ولي أمر افتراضي',
        surname: '',
        phone: '000000000',
        address: data.address
      }
    });
  }

  // إنشاء الطالب
  const student = await prisma.student.create({
    data: {
      id: username,
      username: username,
      name: data.firstName,
      surname: data.lastName,
      email: data.nationalId ? `${data.nationalId}@school.edu` : null,
      phone: data.studentPhone || null,
      address: data.address,
      bloodType: 'O+', // افتراضي
      sex: data.sex,
      birthday: data.birthday,
      parentId: parent.id,
      classId: classRecord.id,
      gradeId: grade.id
    }
  });

  return student;
}