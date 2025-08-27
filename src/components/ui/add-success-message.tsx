"use client"

import React, { useState, useEffect } from 'react'
import { CheckCircle, X, UserPlus, Star, Users, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddSuccessMessageProps {
  teacherName: string
  onClose?: () => void
  onView?: () => void
  className?: string
}

export default function AddSuccessMessage({
  teacherName,
  onClose,
  onView,
  className
}: AddSuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const duration = 7000
    const startTime = Date.now()
    const endTime = startTime + duration

    const updateProgress = () => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      const newProgress = (remaining / duration) * 100
      setProgress(newProgress)

      if (remaining > 0) {
        requestAnimationFrame(updateProgress)
      } else {
        handleClose()
      }
    }

    requestAnimationFrame(updateProgress)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const handleView = () => {
    onView?.()
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md w-full bg-gradient-to-r from-lamaSkyLight via-lamaPurpleLight to-lamaPurple border-2 border-lamaSky rounded-2xl shadow-2xl transform transition-all duration-500",
        "animate-in slide-in-from-top-full",
        className
      )}
      style={{
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-100%) scale(0.95)',
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-lamaSky rounded-2xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-lamaSky to-lamaYellow transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-lamaSky" />
              <h4 className="font-bold text-lamaSky text-lg">تمت الإضافة بنجاح! ⭐</h4>
            </div>
            
            <p className="text-lamaSky/80 text-sm leading-relaxed mb-3">
              تم إضافة <span className="font-semibold bg-lamaSkyLight px-2 py-1 rounded-lg">{teacherName}</span> بنجاح إلى قاعدة البيانات.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-lamaSky/70">
                <Users className="w-3 h-3" />
                <span>تم تسجيل المعلم في النظام</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-lamaSky/70">
                <Star className="w-3 h-3" />
                <span>يمكن الآن تعيين المواد والمراحل الدراسية</span>
              </div>
            </div>

            {onView && (
              <button
                onClick={handleView}
                className="inline-flex items-center gap-2 px-3 py-2 bg-lamaSkyLight hover:bg-lamaSky text-lamaSky text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowRight className="w-3 h-3" />
                عرض بيانات المعلم
              </button>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="opacity-70 hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-lamaSkyLight hover:scale-110"
          >
            <X className="w-5 h-5 text-lamaSky" />
          </button>
        </div>
      </div>
    </div>
  )
}
