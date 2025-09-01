import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // اختبار الاتصال بقاعدة البيانات
    const studentCount = await prisma.student.count();
    const gradeCount = await prisma.subjectGrade.count();
    
    console.log(`Found ${studentCount} students and ${gradeCount} grades`);
    
    return NextResponse.json({
      success: true,
      studentCount,
      gradeCount,
      message: "Database connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
