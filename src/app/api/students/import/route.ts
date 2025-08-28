// src/app/api/students/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as ExcelJS from 'exceljs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم تحديد ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(bytes);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json({ error: 'لم يتم العثور على ورقة عمل في الملف' }, { status: 400 });
    }

    const data: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // تخطي الصف الأول (العناوين)

      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        const header = worksheet.getRow(1).getCell(colNumber).value?.toString() || '';
        rowData[header] = cell.value?.toString() || '';
      });
      data.push(rowData);
    });

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
            name: student.fullName,
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
  // تنظيف المفاتيح والقيم
  const cleanRow: any = {};
  Object.keys(row).forEach((key) => {
    const cleanKey = String(key).trim();
    const value = row[key];
    cleanRow[cleanKey] = typeof value === 'string' ? value.trim() : value;
  });

  // استخراج الحقول مع دعم أكثر من تسمية عربية
  const fullName = cleanRow['الاسم الرباعي (مطلوب)'] || cleanRow['الاسم الرباعي'] || '';
  const nationalId = cleanRow['الرقم الوطني (فريد)'] || cleanRow['الرقم الوطني'] || cleanRow['الرقم القومي'] || '';
  const birthDate = cleanRow['تاريخ الميلاد (YYYY-MM-DD)'] || cleanRow['تاريخ الميلاد'] || '';
  const genderRaw = cleanRow['الجنس (مطلوب: ذكر/أنثى)'] || cleanRow['الجنس'] || '';
  const birthPlace = cleanRow['مكان الميلاد'] || cleanRow['مكان الولادة'] || '';
  const nationality = cleanRow['الجنسية'] || '';
  const address = cleanRow['العنوان'] || '';
  const studentPhone = cleanRow['هاتف الطالب'] || '';

  // التحقق من الحقول الإلزامية فقط
  if (!fullName) throw new Error(`الاسم الرباعي مطلوب في الصف ${rowNumber}`);
  if (!nationalId) throw new Error(`الرقم الوطني مطلوب في الصف ${rowNumber}`);
  if (!birthDate) throw new Error(`تاريخ الميلاد مطلوب في الصف ${rowNumber}`);
  if (!genderRaw) throw new Error(`الجنس مطلوب في الصف ${rowNumber}`);
  if (!birthPlace) throw new Error(`مكان الميلاد مطلوب في الصف ${rowNumber}`);
  if (!nationality) throw new Error(`الجنسية مطلوبة في الصف ${rowNumber}`);
  if (!address) throw new Error(`العنوان مطلوب في الصف ${rowNumber}`);

  // تحويل الجنس
  const genderNormalized = String(genderRaw).replace(/\s+/g, '').toLowerCase();
  const sex = genderNormalized === 'ذكر' || genderNormalized === 'male' ? 'MALE' :
    genderNormalized === 'أنثى' || genderNormalized === 'انثى' || genderNormalized === 'female' ? 'FEMALE' : null;
  if (!sex) throw new Error(`قيمة الجنس غير صحيحة (يجب ذكر/أنثى) في الصف ${rowNumber}`);

  // تحويل تاريخ الميلاد (يدعم serial من Excel)
  let birthday: Date;
  try {
    if (typeof birthDate === 'number') {
      birthday = new Date((birthDate - 25569) * 86400 * 1000);
    } else {
      birthday = new Date(birthDate);
    }
    if (isNaN(birthday.getTime())) throw new Error('bad');
  } catch {
    throw new Error(`تنسيق تاريخ الميلاد غير صحيح في الصف ${rowNumber}`);
  }

  return {
    fullName,
    nationalId: String(nationalId),
    birthday,
    sex,
    placeOfBirth: String(birthPlace),
    nationality: String(nationality),
    address: String(address),
    studentPhone: studentPhone ? String(studentPhone) : null,
  };
}

async function createStudent(data: any) {
  // التحقق من التكرار بواسطة الرقم الوطني
  const existing = await prisma.student.findUnique({ where: { nationalId: data.nationalId } });
  if (existing) {
    throw new Error('رقم الهوية/الرقم الوطني موجود مسبقاً');
  }

  // إنشاء الطالب بالحد الأدنى من الحقول الإلزامية، والباقي اختياري
  try {
    const student = await prisma.student.create({
      data: {
        fullName: data.fullName,
        nationalId: data.nationalId,
        birthday: data.birthday,
        placeOfBirth: data.placeOfBirth,
        nationality: data.nationality,
        address: data.address,
        studentPhone: data.studentPhone || null,
        // قيم اختيارية يمكن إضافتها لاحقاً من الواجهة
      }
    });
    return student;
  } catch (err: any) {
    if (err?.code === 'P2002') {
      throw new Error('رقم الهوية/الرقم الوطني موجود مسبقاً');
    }
    throw err;
  }
}

