"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        academicYear: data.academicYear || null,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        academicYear: data.academicYear || null,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// Class functions
export const createClass = async (
  currentState: CurrentState,
  data: any
) => {
  try {
    await prisma.student.updateMany({
      where: {
        studyLevel: data.studyLevel,
      },
      data: {
        studyLevel: data.studyLevel,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: any
) => {
  try {
    await prisma.student.updateMany({
      where: {
        studyLevel: data.oldStudyLevel,
      },
      data: {
        studyLevel: data.studyLevel,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const studyLevel = data.get("studyLevel") as string;
  try {
    await prisma.student.updateMany({
      where: {
        studyLevel: studyLevel as any,
      },
      data: {
        studyLevel: null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// Exam functions
export const createExam = async (
  currentState: CurrentState,
  data: any
) => {
  try {
    // Placeholder for exam creation
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: any
) => {
  try {
    // Placeholder for exam update
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    // Placeholder for exam deletion
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.fullName.toLowerCase().replace(/\s+/g, ''),
      password: "12345678", // Default password
      firstName: data.fullName.split(' ')[0] || data.fullName,
      lastName: data.fullName.split(' ').slice(1).join(' ') || data.fullName,
      publicMetadata: { role: "teacher" }
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        fullName: data.fullName,
        nationalId: data.nationalId,
        birthday: data.birthday,
        nationality: data.nationality || null,
        maritalStatus: data.maritalStatus || null,
        address: data.address || null,
        phone1: data.phone1,
        phone2: data.phone2 || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactRelation: data.emergencyContactRelation || null,
        employmentStatus: data.employmentStatus || null,
        appointmentDate: data.appointmentDate || null,
        serviceStartDate: data.serviceStartDate || null,
        contractEndDate: data.contractEndDate || null,
        academicQualification: data.academicQualification || null,
        educationalInstitution: data.educationalInstitution || null,
        majorSpecialization: data.majorSpecialization || null,
        minorSpecialization: data.minorSpecialization || null,
        graduationYear: data.graduationYear || null,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      firstName: data.fullName.split(' ')[0] || data.fullName,
      lastName: data.fullName.split(' ').slice(1).join(' ') || data.fullName,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        fullName: data.fullName,
        nationalId: data.nationalId,
        birthday: data.birthday,
        nationality: data.nationality || null,
        maritalStatus: data.maritalStatus || null,
        address: data.address || null,
        phone1: data.phone1,
        phone2: data.phone2 || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactRelation: data.emergencyContactRelation || null,
        employmentStatus: data.employmentStatus || null,
        appointmentDate: data.appointmentDate || null,
        serviceStartDate: data.serviceStartDate || null,
        contractEndDate: data.contractEndDate || null,
        academicQualification: data.academicQualification || null,
        educationalInstitution: data.educationalInstitution || null,
        majorSpecialization: data.majorSpecialization || null,
        minorSpecialization: data.minorSpecialization || null,
        graduationYear: data.graduationYear || null,
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {
    const user = await clerkClient.users.createUser({
      username: data.fullName.toLowerCase().replace(/\s+/g, ''),
      password: "12345678", // Default password
      firstName: data.fullName.split(' ')[0] || data.fullName,
      lastName: data.fullName.split(' ').slice(1).join(' ') || data.fullName,
      publicMetadata: { role: "student" }
    });

    await prisma.student.create({
      data: {
        id: user.id,
        fullName: data.fullName,
        nationalId: data.nationalId,
        guardianName: data.guardianName || null,
        studentPhone: data.studentPhone || null,
        birthday: data.birthday,
        placeOfBirth: data.placeOfBirth,
        address: data.address,
        nationality: data.nationality,
        academicYear: data.academicYear || null,
        studyLevel: data.studyLevel || null,
        specialization: data.specialization || null,
        studyMode: data.studyMode || null,
        enrollmentStatus: data.enrollmentStatus || null,
        studentStatus: data.studentStatus || null,
        relationship: data.relationship || null,
        guardianPhone: data.guardianPhone || null,
        previousSchool: data.previousSchool || null,
        previousLevel: data.previousLevel || null,
        healthCondition: data.healthCondition || null,
        chronicDiseases: data.chronicDiseases || null,
        allergies: data.allergies || null,
        specialNeeds: data.specialNeeds || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        emergencyContactAddress: data.emergencyContactAddress || null,
        notes: data.notes || null,
        studentPhoto: data.studentPhoto || null,
        nationalIdCopy: data.nationalIdCopy || null,
        birthCertificate: data.birthCertificate || null,
        educationForm: data.educationForm || null,
        equivalencyDocument: data.equivalencyDocument || null,
        otherDocuments: data.otherDocuments || null,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      firstName: data.fullName.split(' ')[0] || data.fullName,
      lastName: data.fullName.split(' ').slice(1).join(' ') || data.fullName,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        fullName: data.fullName,
        nationalId: data.nationalId,
        guardianName: data.guardianName || null,
        studentPhone: data.studentPhone || null,
        birthday: data.birthday,
        placeOfBirth: data.placeOfBirth,
        address: data.address,
        nationality: data.nationality,
        academicYear: data.academicYear || null,
        studyLevel: data.studyLevel || null,
        specialization: data.specialization || null,
        studyMode: data.studyMode || null,
        enrollmentStatus: data.enrollmentStatus || null,
        studentStatus: data.studentStatus || null,
        relationship: data.relationship || null,
        guardianPhone: data.guardianPhone || null,
        previousSchool: data.previousSchool || null,
        previousLevel: data.previousLevel || null,
        healthCondition: data.healthCondition || null,
        chronicDiseases: data.chronicDiseases || null,
        allergies: data.allergies || null,
        specialNeeds: data.specialNeeds || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        emergencyContactAddress: data.emergencyContactAddress || null,
        notes: data.notes || null,
        studentPhoto: data.studentPhoto || null,
        nationalIdCopy: data.nationalIdCopy || null,
        birthCertificate: data.birthCertificate || null,
        educationForm: data.educationForm || null,
        equivalencyDocument: data.equivalencyDocument || null,
        otherDocuments: data.otherDocuments || null,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// Exam functions removed - not in current schema
