
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        grade: true,
        class: true,
      },
      orderBy: {
        createdAt: 'desc', // لترتيب الطلاب من الأحدث إلى الأقدم
      },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
