import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - جلب جميع الإعلانات
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الإعلانات' },
      { status: 500 }
    )
  }
}

// POST - إنشاء إعلان جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, description, startDate, endDate, image, status } = body
    
    // التحقق من البيانات المطلوبة
    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        image: image || null,
        status: status || 'نشط'
      }
    })
    
    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء الإعلان' },
      { status: 500 }
    )
  }
}
