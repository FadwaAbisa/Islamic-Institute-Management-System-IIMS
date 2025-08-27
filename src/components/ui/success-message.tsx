"use client"

import React, { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuccessMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  onClose?: () => void
  className?: string
}

export default function SuccessMessage({
  type,
  title,
  description,
  duration = 5000,
  onClose,
  className
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (duration > 0) {
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
    }
  }, [duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-2 rounded-2xl shadow-2xl transform transition-all duration-300",
        "animate-in slide-in-from-top-full",
        getStyles(),
        className
      )}
      style={{
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-100%) scale(0.95)',
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-current/20 rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-current transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight">{title}</h4>
            {description && (
              <p className="text-sm opacity-90 mt-1 leading-relaxed">{description}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-current/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
