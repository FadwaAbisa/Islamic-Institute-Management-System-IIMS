import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  academicYear: z.string().optional(),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),

  // البيانات الأساسية (مطلوبة)
  fullName: z.string().min(1, { message: "الاسم الكامل مطلوب!" }),
  nationalId: z.string().min(1, { message: "الرقم الوطني/الجواز مطلوب!" }),
  birthday: z.coerce.date({ message: "تاريخ الميلاد مطلوب!" }),

  // البيانات الشخصية
  nationality: z.string().optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
  address: z.string().optional(),
  phone1: z.string().min(1, { message: "هاتف أول مطلوب!" }),
  phone2: z.string().optional(),

  // جهة الاتصال للطوارئ
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),

  // الحالة الوظيفية
  employmentStatus: z.enum(["APPOINTMENT", "CONTRACT", "SECONDMENT"]).optional(),
  appointmentDate: z.coerce.date().optional(),
  serviceStartDate: z.coerce.date().optional(),
  contractEndDate: z.coerce.date().optional(),

  // المؤهلات العلمية
  academicQualification: z.string().optional(),
  educationalInstitution: z.string().optional(),
  majorSpecialization: z.string().optional(),
  minorSpecialization: z.string().optional(),
  graduationYear: z.string().optional(),

  // بيانات الصور
  img: z.string().optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  
  // البيانات الشخصية والاتصال
  fullName: z.string().min(1, { message: "الاسم الرباعي مطلوب!" }),
  nationalId: z.string().min(1, { message: "رقم الهوية مطلوب!" }),
  guardianName: z.string().optional(),
  studentPhone: z.string().optional(),
  birthday: z.coerce.date({ message: "تاريخ الميلاد مطلوب!" }),
  placeOfBirth: z.string().min(1, { message: "مكان الميلاد مطلوب!" }),
  address: z.string().min(1, { message: "العنوان مطلوب!" }),
  nationality: z.string().min(1, { message: "الجنسية مطلوبة!" }),
  
  // بيانات التسجيل الأكاديمي
  academicYear: z.string().optional(),
  studyLevel: z.enum(["FIRST_YEAR", "SECOND_YEAR", "THIRD_YEAR", "GRADUATION"]).optional(),
  specialization: z.string().optional(),
  studyMode: z.enum(["REGULAR", "DISTANCE"]).optional(),
  enrollmentStatus: z.enum(["NEW", "REPEATER"]).optional(),
  studentStatus: z.enum(["ACTIVE", "DROPPED", "SUSPENDED", "EXPELLED", "PAUSED", "GRADUATED"]).optional(),
  
  // البيانات الإضافية
  relationship: z.string().optional(),
  guardianPhone: z.string().optional(),
  previousSchool: z.string().optional(),
  previousLevel: z.string().optional(),
  healthCondition: z.string().optional(),
  chronicDiseases: z.string().optional(),
  allergies: z.string().optional(),
  specialNeeds: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactAddress: z.string().optional(),
  notes: z.string().optional(),
  
  // بيانات المستندات
  studentPhoto: z.string().optional(),
  nationalIdCopy: z.string().optional(),
  birthCertificate: z.string().optional(),
  educationForm: z.string().optional(),
  equivalencyDocument: z.string().optional(),
  otherDocuments: z.any().optional(),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;
