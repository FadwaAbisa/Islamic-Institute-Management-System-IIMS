"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Advertisement {
    id: number
    title: string
    description: string
    link?: string
    image: string
    startDate: string
    endDate: string
    status: "نشط" | "غير نشط"
}

interface AdsContextType {
    ads: Advertisement[]
    addAd: (ad: Omit<Advertisement, 'id'>) => void
    updateAd: (id: number, ad: Partial<Advertisement>) => void
    deleteAd: (id: number) => void
    toggleAdStatus: (id: number) => void
    getActiveAds: () => Advertisement[]
}

const AdsContext = createContext<AdsContextType | undefined>(undefined)

export function AdsProvider({ children }: { children: React.ReactNode }) {
    const [ads, setAds] = useState<Advertisement[]>([
        {
            id: 1,
            title: "عرض خاص على المنتجات الإلكترونية",
            description: "خصم يصل إلى 50% على جميع المنتجات الإلكترونية",
            link: "https://example.com/electronics",
            image: "/electronics-sale-banner.png",
            startDate: "2024-01-15",
            endDate: "2024-02-15",
            status: "نشط",
        },
        {
            id: 2,
            title: "مجموعة الأزياء الجديدة",
            description: "اكتشف أحدث صيحات الموضة لهذا الموسم",
            image: "/placeholder-mik0e.png",
            startDate: "2024-01-10",
            endDate: "2024-03-10",
            status: "غير نشط",
        },
        {
            id: 3,
            title: "دورة تحفيظ القرآن الكريم",
            description: "انضم إلى دورة تحفيظ القرآن الكريم للطلاب والطالبات",
            image: "/placeholder.jpg",
            startDate: "2024-01-20",
            endDate: "2024-06-20",
            status: "نشط",
        },
    ])

    // حفظ البيانات في localStorage
    useEffect(() => {
        const savedAds = localStorage.getItem('ads-data')
        if (savedAds) {
            setAds(JSON.parse(savedAds))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('ads-data', JSON.stringify(ads))
    }, [ads])

    const addAd = (newAd: Omit<Advertisement, 'id'>) => {
        const id = Math.max(...ads.map(ad => ad.id), 0) + 1
        setAds(prev => [...prev, { ...newAd, id }])
    }

    const updateAd = (id: number, updatedAd: Partial<Advertisement>) => {
        setAds(prev => prev.map(ad =>
            ad.id === id ? { ...ad, ...updatedAd } : ad
        ))
    }

    const deleteAd = (id: number) => {
        setAds(prev => prev.filter(ad => ad.id !== id))
    }

    const toggleAdStatus = (id: number) => {
        setAds(prev => prev.map(ad =>
            ad.id === id ? { ...ad, status: ad.status === "نشط" ? "غير نشط" : "نشط" } : ad
        ))
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
            getActiveAds
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
