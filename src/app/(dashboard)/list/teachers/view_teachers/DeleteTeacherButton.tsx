"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import DeleteSuccessMessage from "@/components/ui/delete-success-message"

interface DeleteTeacherButtonProps {
  teacherId: string
  teacherName?: string
}

export default function DeleteTeacherButton({ teacherId, teacherName = "المعلم" }: DeleteTeacherButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [deletedTeacher, setDeletedTeacher] = useState<{ id: string, name: string } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null)

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      setToast({
        type: 'warning',
        message: `هل أنت متأكد من حذف ${teacherName}؟ هذا الإجراء لا يمكن التراجع عنه.`
      })
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

        // إعادة تحميل الصفحة بعد 8 ثوانٍ
        setTimeout(() => {
          window.location.reload()
        }, 8000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setToast({
          type: 'error',
          message: errorData.message || 'حدث خطأ أثناء حذف المعلم. يرجى المحاولة مرة أخرى.'
        })
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'حدث خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setToast({
      type: 'info',
      message: 'تم إلغاء عملية الحذف بنجاح.'
    })
  }

  const handleUndo = async () => {
    if (!deletedTeacher) return

    try {
      // هنا يمكن إضافة منطق استعادة المعلم المحذوف
      // إذا كان لديك API لاستعادة البيانات المحذوفة
      setToast({
        type: 'info',
        message: 'سيتم إضافة منطق استعادة المعلم قريباً.'
      })
    } catch (error) {
      setToast({
        type: 'error',
        message: 'حدث خطأ أثناء محاولة استعادة المعلم.'
      })
    }
  }

  if (showSuccess && deletedTeacher) {
    return (
      <DeleteSuccessMessage
        teacherName={deletedTeacher.name}
        onClose={() => setShowSuccess(false)}
        onUndo={handleUndo}
      />
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
