"use client"

import React, { useState, useEffect } from 'react'
import { CheckCircle, X, ArrowRight, UserCheck, Database, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditSuccessMessageProps {
  teacherName: string
  onClose?: () => void
  className?: string
}

export default function EditSuccessMessage({
  teacherName,
  onClose,
  className
}: EditSuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const duration = 6000
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

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md w-full bg-gradient-to-r from-lamaYellowLight to-lamaPurpleLight border-2 border-lamaYellow rounded-2xl shadow-2xl transform transition-all duration-500",
        "animate-in slide-in-from-top-full",
        className
      )}
      style={{
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-100%) scale(0.95)',
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-lamaYellow rounded-2xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-lamaYellow to-lamaSky transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-lamaYellow to-lamaSky rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-lamaYellow" />
              <h4 className="font-bold text-lamaYellow text-lg">تم التعديل بنجاح! 🎉</h4>
            </div>
            
            <p className="text-lamaYellow/80 text-sm leading-relaxed mb-3">
              تم تحديث بيانات <span className="font-semibold bg-lamaYellowLight px-2 py-1 rounded-lg">{teacherName}</span> بنجاح في قاعدة البيانات.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-lamaYellow/70">
                <Database className="w-3 h-3" />
                <span>تم حفظ التغييرات في قاعدة البيانات</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-lamaYellow/70">
                <Clock className="w-3 h-3" />
                <span>آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-lamaYellow/70">
                <ArrowRight className="w-3 h-3" />
                <span>سيتم تحديث القائمة تلقائياً</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="opacity-70 hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-lamaYellowLight hover:scale-110"
          >
            <X className="w-5 h-5 text-lamaYellow" />
          </button>
        </div>
      </div>
    </div>
  )
}
