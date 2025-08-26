"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface Ad {
    id: string
    title: string
    content: string
    status: 'active' | 'inactive' | 'draft'
    createdAt: string
    updatedAt: string
}

interface AdsStatsProps {
    ads: Ad[]
}

export function AdsStats({ ads }: AdsStatsProps) {
    const totalAds = ads.length
    const activeAds = ads.filter(ad => ad.status === 'active').length
    const inactiveAds = ads.filter(ad => ad.status === 'inactive').length
    const draftAds = ads.filter(ad => ad.status === 'draft').length

    const activePercentage = totalAds > 0 ? Math.round((activeAds / totalAds) * 100) : 0
    const inactivePercentage = totalAds > 0 ? Math.round((inactiveAds / totalAds) * 100) : 0
    const draftPercentage = totalAds > 0 ? Math.round((draftAds / totalAds) * 100) : 0

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-600'
            case 'inactive':
                return 'text-red-600'
            case 'draft':
                return 'text-yellow-600'
            default:
                return 'text-gray-600'
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي الإعلانات</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAds}</div>
                    <p className="text-xs text-muted-foreground">
                        جميع الإعلانات في النظام
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الإعلانات النشطة</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{activeAds}</div>
                    <p className="text-xs text-muted-foreground">
                        {activePercentage}% من إجمالي الإعلانات
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الإعلانات غير النشطة</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{inactiveAds}</div>
                    <p className="text-xs text-muted-foreground">
                        {inactivePercentage}% من إجمالي الإعلانات
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">المسودات</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        {draftPercentage}%
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{draftAds}</div>
                    <p className="text-xs text-muted-foreground">
                        في انتظار المراجعة
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
