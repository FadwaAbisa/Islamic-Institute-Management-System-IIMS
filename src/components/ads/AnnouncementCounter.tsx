"use client"

import React from 'react'
import { useAds } from '@/contexts/AdsContext'
import Image from 'next/image'
import Link from 'next/link'

export function AnnouncementCounter() {
    const { getActiveAds } = useAds()
    const activeCount = getActiveAds().length

    return (
        <Link href="/list/announcements" title="الإعلانات">
            <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200 relative">
                <Image
                    src="/announcement.png"
                    alt="إعلانات"
                    width={18}
                    height={18}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                />
                {activeCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs font-medium shadow-sm animate-pulse">
                        {activeCount}
                    </div>
                )}
            </div>
        </Link>
    )
}
