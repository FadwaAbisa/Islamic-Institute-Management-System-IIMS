"use client"

import React from 'react'
import { useAds } from '@/contexts/AdsContext'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Calendar, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HomeAds() {
    const { getActiveAds } = useAds()
    const activeAds = getActiveAds()

    if (activeAds.length === 0) {
        return null
    }

    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-xl overflow-hidden" dir="rtl">
            <CardHeader className="bg-gradient-to-r from-lama-yellow/20 via-lama-sky/20 to-lama-purple/20 border-b border-lama-sky/20">
                <CardTitle className="flex items-center justify-between text-lama-yellow">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-lama-yellow to-lama-sky p-2 rounded-xl shadow-lg">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">الإعلانات الحالية</div>
                            <div className="text-sm text-gray-600 font-normal">آخر الإعلانات والعروض</div>
                        </div>
                    </div>
                    <Link href="/list/announcements">
                        <Button variant="outline" size="sm" className="text-lama-yellow border-lama-yellow hover:bg-lama-yellow hover:text-white">
                            إدارة الإعلانات
                        </Button>
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    {activeAds.slice(0, 2).map((ad, index) => (
                        <div
                            key={ad.id}
                            className={`group border-2 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${index === 0
                                ? 'border-lama-yellow/30 bg-gradient-to-br from-lama-yellow/10 to-lama-sky/5 hover:border-lama-yellow/60'
                                : 'border-lama-sky/30 bg-gradient-to-br from-lama-sky/10 to-lama-purple/5 hover:border-lama-sky/60'
                                }`}
                        >
                            <div className="flex gap-4">
                                {/* صورة الإعلان */}
                                <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                                    <Image
                                        src={ad.image || "/placeholder.svg"}
                                        alt={ad.title}
                                        width={120}
                                        height={80}
                                        className="w-30 h-20 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* محتوى الإعلان */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-lama-yellow transition-colors duration-300">
                                            {ad.title}
                                        </h3>
                                        <Badge className="bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
                                            نشط
                                        </Badge>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                        {ad.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span>حتى {new Date(ad.endDate).toLocaleDateString('ar-EG')}</span>
                                        </div>

                                        {ad.link && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                                className="text-lama-yellow hover:text-white hover:bg-lama-yellow rounded-xl p-2 transition-all duration-300"
                                            >
                                                <a href={ad.link} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4 ml-1" />
                                                    زيارة الرابط
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeAds.length > 2 && (
                        <div className="text-center pt-4">
                            <Link href="/list/announcements">
                                <Button
                                    variant="outline"
                                    className="text-lama-yellow border-lama-yellow hover:bg-lama-yellow hover:text-white transition-all duration-300"
                                >
                                    عرض جميع الإعلانات ({activeAds.length})
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
