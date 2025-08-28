"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Advertisement {
    id: number
    title: string
    description: string
    image: string | null
    startDate: string
    endDate: string
    status: string
    createdAt: string
}

interface AdsContextType {
    ads: Advertisement[]
    addAd: (ad: Omit<Advertisement, 'id' | 'createdAt'>) => Promise<void>
    updateAd: (id: number, ad: Partial<Advertisement>) => Promise<void>
    deleteAd: (id: number) => Promise<void>
    toggleAdStatus: (id: number) => Promise<void>
    getActiveAds: () => Advertisement[]
    loading: boolean
    error: string | null
}

const AdsContext = createContext<AdsContextType | undefined>(undefined)

export function AdsProvider({ children }: { children: React.ReactNode }) {
    const [ads, setAds] = useState<Advertisement[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // جلب الإعلانات من قاعدة البيانات
    const fetchAnnouncements = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/announcements')
            if (!response.ok) {
                throw new Error('فشل في جلب الإعلانات')
            }
            const data = await response.json()
            setAds(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const addAd = async (newAd: Omit<Advertisement, 'id' | 'createdAt'>) => {
        try {
            setLoading(true)
            const response = await fetch('/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAd),
            })

            if (!response.ok) {
                throw new Error('فشل في إضافة الإعلان')
            }

            const createdAd = await response.json()
            setAds(prev => [createdAd, ...prev])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateAd = async (id: number, updatedAd: Partial<Advertisement>) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/announcements/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAd),
            })

            if (!response.ok) {
                throw new Error('فشل في تحديث الإعلان')
            }

            const updated = await response.json()
            setAds(prev => prev.map(ad => ad.id === id ? updated : ad))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteAd = async (id: number) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/announcements/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('فشل في حذف الإعلان')
            }

            setAds(prev => prev.filter(ad => ad.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const toggleAdStatus = async (id: number) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/announcements/${id}`, {
                method: 'PATCH',
            })

            if (!response.ok) {
                throw new Error('فشل في تبديل حالة الإعلان')
            }

            const updated = await response.json()
            setAds(prev => prev.map(ad => ad.id === id ? updated : ad))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getActiveAds = () => {
        return ads.filter(ad => ad.status === "نشط")
    }

    return (
        <AdsContext.Provider value={{
            ads,
            addAd,
            updateAd,
            deleteAd,
            toggleAdStatus,
            getActiveAds,
            loading,
            error
        }}>
            {children}
        </AdsContext.Provider>
    )
}

export function useAds() {
    const context = useContext(AdsContext)
    if (context === undefined) {
        throw new Error('useAds must be used within an AdsProvider')
    }
    return context
}
