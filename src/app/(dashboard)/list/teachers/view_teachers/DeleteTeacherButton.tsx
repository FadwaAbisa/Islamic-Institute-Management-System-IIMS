"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, XCircle } from "lucide-react"


interface DeleteTeacherButtonProps {
  teacherId: string
  teacherName?: string
}

export default function DeleteTeacherButton({ teacherId, teacherName = "المعلم" }: DeleteTeacherButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [deletedTeacher, setDeletedTeacher] = useState<{ id: string, name: string } | null>(null)


  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      // عرض رسالة تأكيد
      return
    }

    setIsDeleting(true)
    setShowConfirm(false)

    try {
      const res = await fetch(`/api/teachers/${teacherId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setDeletedTeacher({ id: teacherId, name: teacherName })
        setShowSuccess(true)

        // إعادة تحميل الصفحة بعد 3 ثوانٍ
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('خطأ في حذف المعلم:', errorData.message || 'حدث خطأ أثناء حذف المعلم')
      }
    } catch (error) {
      console.error('خطأ في الاتصال بالخادم:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
    // تم إلغاء عملية الحذف
  }



  if (showSuccess && deletedTeacher) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-sm font-medium">
          تم حذف {deletedTeacher.name} بنجاح
        </span>
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
          onClick={() => window.location.reload()}
        >
          تحديث الصفحة
        </Button>
      </div>
    )
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg transition-all duration-300 bg-red-50 hover:scale-105 transform"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-slate-600 hover:text-slate-700 hover:bg-slate-50 border-slate-200 rounded-lg transition-all duration-300 hover:scale-105 transform"
          onClick={handleCancel}
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg transition-all duration-300 group"
      onClick={handleDelete}
      title={`حذف ${teacherName}`}
    >
      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
    </Button>
  )
}
