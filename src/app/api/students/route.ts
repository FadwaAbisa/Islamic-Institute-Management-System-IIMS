import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // استخراج البيانات من الطلب
    const {
      // البيانات الشخصية (مطلوبة)
      fullName,
      nationalId,
      gender,
      birthDate,
      birthPlace,
      nationality,
      address,
      phoneNumber,
      
      // البيانات الأكاديمية (اختيارية)
      academicYear,
      academicLevel,
      branch,
      studySystem,
      enrollmentStatus,
      studentStatus,
      
      // البيانات الإضافية (اختيارية)
      guardianName,
      relationship,
      guardianPhone,
      previousSchool,
      previousLevel,
      healthCondition,
      chronicDiseases,
      allergies,
      specialNeeds,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactAddress,
      notes
    } = body

    // التحقق من البيانات المطلوبة
    if (!fullName || !nationalId || !gender || !birthDate || !birthPlace || !nationality || !address || !phoneNumber) {
      return NextResponse.json(
        { error: 'جميع البيانات الشخصية مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من عدم تكرار رقم الهوية
    const existingStudent = await prisma.student.findUnique({
      where: { nationalId }
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: 'رقم الهوية موجود مسبقاً في النظام' },
        { status: 409 }
      )
    }

    // تحويل القيم إلى الأنواع المطلوبة في Prisma
    const genderEnum = gender === 'male' ? 'MALE' : 'FEMALE'
    const birthPlaceEnum = getBirthPlaceEnum(birthPlace)
    const nationalityEnum = getNationalityEnum(nationality)
    const branchEnum = getBranchEnum(branch)
    const studySystemEnum = getStudySystemEnum(studySystem)
    const enrollmentStatusEnum = getEnrollmentStatusEnum(enrollmentStatus)
    const studentStatusEnum = getStudentStatusEnum(studentStatus)

    // إنشاء الطالب الجديد في قاعدة البيانات
    const newStudent = await prisma.student.create({
      data: {
        // البيانات الشخصية (مطلوبة)
        fullName,
        nationalId,
        sex: genderEnum,
        birthday: new Date(birthDate),
        placeOfBirth: birthPlaceEnum,
        nationality: nationalityEnum,
        address,
        studentPhone: phoneNumber,
        
        // البيانات الأكاديمية (اختيارية)
        ...(academicYear && { academicYear }),
        ...(academicLevel && { studyLevel: academicLevel }),
        ...(branchEnum && { specialization: branchEnum }),
        ...(studySystemEnum && { studyMode: studySystemEnum }),
        ...(enrollmentStatusEnum && { enrollmentStatus: enrollmentStatusEnum }),
        ...(studentStatusEnum && { studentStatus: studentStatusEnum }),
        
        // البيانات الإضافية (اختيارية)
        guardianName: guardianName || null,
        relationship: relationship || null,
        guardianPhone: guardianPhone || null,
        previousSchool: previousSchool || null,
        previousLevel: previousLevel || null,
        healthCondition: healthCondition || null,
        chronicDiseases: chronicDiseases || null,
        allergies: allergies || null,
        specialNeeds: specialNeeds || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        emergencyContactAddress: emergencyContactAddress || null,
        notes: notes || null
      }
    })

    return NextResponse.json(
      { 
        message: 'تم إضافة الطالب بنجاح',
        student: newStudent
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('خطأ في إضافة الطالب:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء إضافة الطالب' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // استخراج معاملات البحث والتصفية
    const search = searchParams.get('search') || ''
    const academicYear = searchParams.get('academicYear') || ''
    const stage = searchParams.get('stage') || ''
    const gender = searchParams.get('gender') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'fullName'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    
    // بناء شروط البحث
    const where: any = {}
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (academicYear && academicYear !== 'الكل') {
      where.academicYear = academicYear
    }
    
    if (stage && stage !== 'الكل') {
      where.studyLevel = stage
    }
    
    if (gender && gender !== 'الكل') {
      where.sex = gender === 'ذكر' ? 'MALE' : 'FEMALE'
    }
    
    if (status && status !== 'الكل') {
      where.studentStatus = status
    }
    
    // حساب الإزاحة
    const skip = (page - 1) * limit
    
    // جلب الطلاب مع الصفحات
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        select: {
          id: true,
          fullName: true,
          nationalId: true,
          sex: true,
          birthday: true,
          placeOfBirth: true,
          nationality: true,
          address: true,
          studentPhone: true,
          academicYear: true,
          studyLevel: true,
          specialization: true,
          studyMode: true,
          enrollmentStatus: true,
          studentStatus: true,
          guardianName: true,
          relationship: true,
          guardianPhone: true,
          previousSchool: true,
          previousLevel: true,
          healthCondition: true,
          chronicDiseases: true,
          allergies: true,
          specialNeeds: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          emergencyContactAddress: true,
          notes: true,
          studentPhoto: true,
          createdAt: true,
        }
      }),
      prisma.student.count({ where })
    ])
    
    // تحويل البيانات لتتناسب مع الواجهة
    const formattedStudents = students.map((student, index) => ({
      id: student.id,
      registrationNumber: (skip + index + 1).toString().padStart(6, '0'),
      fullName: student.fullName,
      status: student.studentStatus || 'مستمر',
      academicYear: student.academicYear || 'غير محدد',
      stage: student.studyLevel || 'غير محدد',
      section: student.specialization || 'غير محدد',
      studySystem: student.studyMode === 'REGULAR' ? 'نظامي' : student.studyMode === 'DISTANCE' ? 'انتساب' : 'غير محدد',
      gender: student.sex === 'MALE' ? 'ذكر' : 'أنثى',
      photo: student.studentPhoto,
      nationalId: student.nationalId,
      birthDate: student.birthday ? student.birthday.toISOString().split('T')[0] : '',
      nationality: student.nationality,
      birthPlace: student.placeOfBirth,
      phone: student.studentPhone || '',
      address: student.address,
      guardianName: student.guardianName || '',
      guardianRelation: student.relationship || '',
      guardianPhone: student.guardianPhone || '',
      emergencyContact: student.emergencyContactName || '',
      emergencyPhone: student.emergencyContactPhone || '',
      emergencyAddress: student.emergencyContactAddress || '',
      branch: student.specialization || '',
      registrationDate: student.createdAt ? student.createdAt.toISOString().split('T')[0] : '',
      registrationStatus: student.enrollmentStatus === 'NEW' ? 'مستجد' : student.enrollmentStatus === 'REPEATER' ? 'معيد' : 'غير محدد',
      previousLevel: student.previousLevel || '',
      previousSchool: student.previousSchool || '',
      healthStatus: student.healthCondition || '',
      chronicDiseases: student.chronicDiseases || '',
      allergies: student.allergies || '',
      specialNeeds: student.specialNeeds || '',
      skills: student.notes || '',
    }))
    
    return NextResponse.json({
      students: formattedStudents,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    })
    
  } catch (error) {
    console.error('خطأ في جلب الطلاب:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب الطلاب' },
      { status: 500 }
    )
  }
}

// دوال مساعدة لتحويل القيم إلى Enums
function getBirthPlaceEnum(birthPlace: string) {
  // إرجاع القيمة كما هي لأن placeOfBirth في schema هو String وليس Enum
  return birthPlace
}

function getNationalityEnum(nationality: string) {
  // إرجاع القيمة كما هي لأن nationality في schema هو String وليس Enum
  return nationality
}

function getBranchEnum(branch: string | undefined) {
  if (!branch) return null
  // إرجاع القيمة كما هي لأن specialization في schema هو String وليس Enum
  return branch
}

function getStudySystemEnum(studySystem: string | undefined) {
  if (!studySystem) return null
  switch (studySystem) {
    case 'regular': return 'REGULAR'
    case 'correspondence': return 'DISTANCE'
    default: return null
  }
}

function getEnrollmentStatusEnum(enrollmentStatus: string | undefined) {
  if (!enrollmentStatus) return null
  switch (enrollmentStatus) {
    case 'new': return 'NEW'
    case 'repeat': return 'REPEATER'
    default: return null
  }
}

function getStudentStatusEnum(studentStatus: string | undefined) {
  if (!studentStatus) return null
  switch (studentStatus) {
    case 'continuing': return 'ACTIVE'
    case 'dropped': return 'DROPPED'
    case 'suspended': return 'SUSPENDED'
    case 'expelled': return 'EXPELLED'
    case 'enrollment-suspended': return 'PAUSED'
    default: return null
  }
}