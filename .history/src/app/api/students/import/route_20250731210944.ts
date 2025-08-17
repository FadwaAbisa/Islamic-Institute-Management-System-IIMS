// src/app/api/students/import/route.ts
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

    const results = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      
      try {
        const studentData = await processStudentData(row, i + 2);
        
        if (studentData) {
          const student = await createStudent(studentData);
          results.push({ 
            row: i + 2, 
            name: `${student.name} ${student.surname}`, 
            status: 'تم إضافته بنجاح' 
          });
        }
      } catch (error: any) {
        console.error(`خطأ في الصف ${i + 2}:`, error);
        errors.push({ 
          row: i + 2, 
          error: error.message,
          data: {
            name: row['الاسم الرباعي (مطلوب)'] || row['الاسم الرباعي'] || 'غير محدد'
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `تم إضافة ${results.length} طالب من أصل ${data.length}`,
      results,
      errors,
      total: data.length,
      successCount: results.length,
      errorCount: errors.length
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
  // تنظيف البيانات
  const cleanRow: any = {};
  Object.keys(row).forEach(key => {
    const cleanKey = key.trim();
    cleanRow[cleanKey] = typeof row[key] === 'string' ? row[key].trim() : row[key];
  });

  // استخراج البيانات
  const fullName = cleanRow['الاسم الرباعي (مطلوب)'] || cleanRow['الاسم الرباعي'] ||
  const birthDate = cleanRow['تاريخ الميلاد (YYYY-MM-DD)'] || cleanRow['تاريخ الميلاد'] || '';
  const gender = cleanRow['الجنس (مطلوب: ذكر/أنثى)'] || cleanRow['الجنس'] || '';
  const address = cleanRow['العنوان'] || 'غير محدد';
  const studentPhone = cleanRow['هاتف الطالب'] || '';
  const parentPhone = cleanRow['هاتف ولي الأمر'] || '';
  const parentName = cleanRow['اسم ولي الأمر'] || '';
  const gradeLevel = cleanRow['المرحلة الدراسية (اسم المرحلة كما هو في النظام، مطلوب)'] || 
                    cleanRow['المرحلة الدراسية'] || '';
  const className = cleanRow['الفرع (مطلوب إذا لم يكن المستخدم مقيدًا بفرع)'] || 
                    cleanRow['الفرع'] || '';

  // التحقق من البيانات المطلوبة
  if (!fullName) {
    throw new Error(`الاسم الرباعي مطلوب في الصف ${rowNumber}`);
  }

  if (!birthDate) {
    throw new Error(`تاريخ الميلاد مطلوب في الصف ${rowNumber}`);
  }

  if (!gender || (gender !== 'ذكر' && gender !== 'أنثى')) {
    throw new Error(`الجنس مطلوب ويجب أن يكون 'ذكر' أو 'أنثى' في الصف ${rowNumber}`);
  }

  // تقسيم الاسم
  const nameParts = fullName.split(' ').filter((part: string | any[]) => part.length > 0);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || 'غير محدد';

  // تحويل الجنس
  const sex = gender === 'ذكر' ? 'MALE' : 'FEMALE';

  // تحويل تاريخ الميلاد
  let birthday: Date;
  try {
    if (typeof birthDate === 'number') {
      // تحويل Excel serial date
      birthday = new Date((birthDate - 25569) * 86400 * 1000);
    } else {
      birthday = new Date(birthDate);
    }
    
    if (isNaN(birthday.getTime())) {
      throw new Error('تنسيق تاريخ غير صحيح');
    }
  } catch (error) {
    throw new Error(`تنسيق تاريخ الميلاد غير صحيح في الصف ${rowNumber}`);
  }

  return {
    firstName,
    lastName,
    birthday,
    sex,
    address,
    studentPhone,
    parentPhone,
    parentName,
    gradeLevel: parseInt(gradeLevel) || 1,
    className: className || 'الصف الافتراضي'
  };
}

async function createStudent(data: any) {
  // إنشاء username فريد
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  const username = `student_${timestamp}_${random}`;
  
  // البحث عن أو إنشاء Grade
  let grade = await prisma.grade.findFirst({
    where: { level: data.gradeLevel }
  });

  if (!grade) {
    grade = await prisma.grade.create({
      data: { level: data.gradeLevel }
    });
  }

  // البحث عن أو إنشاء Class
  let classRecord = await prisma.class.findFirst({
    where: {
      name: data.className,
      gradeId: grade.id
    }
  });

  if (!classRecord) {
    classRecord = await prisma.class.create({
      data: {
        name: data.className,
        capacity: 30,
        gradeId: grade.id
      }
    });
  }

  // البحث عن أو إنشاء Parent
  let parent = await prisma.parent.findFirst({
    where: {
      OR: [
        { phone: data.parentPhone },
        { name: data.parentName }
      ]
    }
  });

  if (!parent) {
    const parentUsername = `parent_${timestamp}_${random}`;
    parent = await prisma.parent.create({
      data: {
        id: parentUsername,
        username: parentUsername,
        name: data.parentName || 'ولي أمر',
        surname: '',
        phone: data.parentPhone || `phone_${timestamp}`,
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
      phone: data.studentPhone || null,
      address: data.address,
      bloodType: 'O+', // قيمة افتراضية
      sex: data.sex,
      birthday: data.birthday,
      parentId: parent.id,
      classId: classRecord.id,
      gradeId: grade.id
    }
  });

  return student;
}