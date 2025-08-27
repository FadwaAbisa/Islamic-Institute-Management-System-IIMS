"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastProvider, ToastViewport } from './toast'
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  showToast: (message: Omit<ToastMessage, 'id'>) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastContainerProps {
  children: React.ReactNode
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      ...message,
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove toast after duration
    if (newToast.duration) {
      setTimeout(() => {
        hideToast(id)
      }, newToast.duration)
    }
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const getToastIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-lamaYellow" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-lamaYellow" />
      case 'info':
        return <Info className="w-5 h-5 text-lamaSky" />
      default:
        return <Info className="w-5 h-5 text-lamaSky" />
    }
  }

  const getToastVariant = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'success'
      case 'error':
        return 'destructive'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <ToastProvider>
        {children}
        <ToastViewport className="fixed top-4 right-4 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]" />
        
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={getToastVariant(toast.type)}
            className={cn(
              "group border-0 shadow-lg",
              toast.type === 'success' && "bg-lamaYellowLight border-lamaYellow text-lamaYellow",
              toast.type === 'error' && "bg-red-50 border-red-200 text-red-800",
              toast.type === 'warning' && "bg-lamaYellowLight border-lamaYellow text-lamaYellow",
              toast.type === 'info' && "bg-lamaSkyLight border-lamaSky text-lamaSky"
            )}
          >
            <div className="flex items-start gap-3">
              {getToastIcon(toast.type)}
              <div className="flex-1">
                <div className="font-semibold text-sm">{toast.title}</div>
                {toast.description && (
                  <div className="text-sm opacity-90 mt-1">{toast.description}</div>
                )}
              </div>
              <button
                onClick={() => hideToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Toast>
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  )
}
