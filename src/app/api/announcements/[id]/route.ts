import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - جلب إعلان واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'معرف غير صحيح' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id }
    })
    
    if (!announcement) {
      return NextResponse.json(
        { error: 'الإعلان غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الإعلان' },
      { status: 500 }
    )
  }
}

// PUT - تحديث إعلان
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'معرف غير صحيح' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, description, startDate, endDate, image, status } = body
    
    // التحقق من البيانات المطلوبة
    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        image: image || null,
        status: status || 'نشط'
      }
    })
    
    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الإعلان' },
      { status: 500 }
    )
  }
}

// DELETE - حذف إعلان
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'معرف غير صحيح' },
        { status: 400 }
      )
    }

    await prisma.announcement.delete({
      where: { id }
    })
    
    return NextResponse.json(
      { message: 'تم حذف الإعلان بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { error: 'فشل في حذف الإعلان' },
      { status: 500 }
    )
  }
}

// PATCH - تبديل حالة الإعلان
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'معرف غير صحيح' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id }
    })
    
    if (!announcement) {
      return NextResponse.json(
        { error: 'الإعلان غير موجود' },
        { status: 404 }
      )
    }

    const newStatus = announcement.status === 'نشط' ? 'غير نشط' : 'نشط'
    
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: { status: newStatus }
    })
    
    return NextResponse.json(updatedAnnouncement)
  } catch (error) {
    console.error('Error toggling announcement status:', error)
    return NextResponse.json(
      { error: 'فشل في تبديل حالة الإعلان' },
      { status: 500 }
    )
  }
}
