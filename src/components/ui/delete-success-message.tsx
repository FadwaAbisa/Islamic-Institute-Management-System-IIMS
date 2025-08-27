"use client"

import React, { useState, useEffect } from 'react'
import { CheckCircle, X, Trash2, UserX, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeleteSuccessMessageProps {
  teacherName: string
  onClose?: () => void
  onUndo?: () => void
  className?: string
}

export default function DeleteSuccessMessage({
  teacherName,
  onClose,
  onUndo,
  className
}: DeleteSuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const duration = 8000 // وقت أطول للحذف
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

  const handleUndo = () => {
    onUndo?.()
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md w-full bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-2xl transform transition-all duration-500",
        "animate-in slide-in-from-top-full",
        className
      )}
      style={{
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-100%) scale(0.95)',
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-200 rounded-2xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
            <UserX className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-red-800 text-lg">تم الحذف بنجاح! 🗑️</h4>
            </div>
            
            <p className="text-red-700 text-sm leading-relaxed mb-3">
              تم حذف <span className="font-semibold">{teacherName}</span> من قاعدة البيانات بنجاح.
            </p>
            
            <div className="flex items-center gap-2 text-xs text-red-600 mb-3">
              <Trash2 className="w-3 h-3" />
              <span>هذا الإجراء لا يمكن التراجع عنه</span>
            </div>

            {onUndo && (
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105"
              >
                <RotateCcw className="w-3 h-3" />
                التراجع عن الحذف
              </button>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="opacity-70 hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-red-100 hover:scale-110"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
