import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), //teacher ids
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
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
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
