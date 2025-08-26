"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Search } from "lucide-react"

interface Ad {
    id: string
    title: string
    content: string
    status: 'active' | 'inactive' | 'draft'
    createdAt: string
    updatedAt: string
}

interface AdsListProps {
    ads: Ad[]
    onEdit: (ad: Ad) => void
    onDelete: (id: string) => void
    onView: (ad: Ad) => void
}

export function AdsList({ ads, onEdit, onDelete, onView }: AdsListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    const filteredAds = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ad.content.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === "all" || ad.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">نشط</Badge>
            case 'inactive':
                return <Badge className="bg-red-100 text-red-800">غير نشط</Badge>
            case 'draft':
                return <Badge className="bg-yellow-100 text-yellow-800">مسودة</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            {/* شريط البحث والفلترة */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="البحث في الإعلانات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="draft">مسودة</option>
                </select>
            </div>

            {/* قائمة الإعلانات */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                العنوان
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                تاريخ الإنشاء
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAds.map((ad) => (
                            <tr key={ad.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {ad.content}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {getStatusBadge(ad.status)}
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-gray-500">
                                    {new Date(ad.createdAt).toLocaleDateString('ar-SA')}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onView(ad)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onEdit(ad)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600"
                                            onClick={() => onDelete(ad.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAds.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        لا توجد إعلانات
                    </div>
                )}
            </div>
        </div>
    )
}
