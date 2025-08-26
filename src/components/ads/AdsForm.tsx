"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Ad {
    id?: string
    title: string
    content: string
    status: 'active' | 'inactive' | 'draft'
}

interface AdsFormProps {
    ad?: Ad
    onSubmit: (ad: Ad) => void
    onCancel: () => void
    isEditing?: boolean
}

export function AdsForm({ ad, onSubmit, onCancel, isEditing = false }: AdsFormProps) {
    const [formData, setFormData] = useState<Ad>({
        title: "",
        content: "",
        status: "draft"
    })

    useEffect(() => {
        if (ad) {
            setFormData(ad)
        }
    }, [ad])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field: keyof Ad, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="title">عنوان الإعلان</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="أدخل عنوان الإعلان"
                    required
                    className="mt-2"
                />
            </div>

            <div>
                <Label htmlFor="content">محتوى الإعلان</Label>
                <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="أدخل محتوى الإعلان"
                    required
                    rows={6}
                    className="mt-2"
                />
            </div>

            <div>
                <Label htmlFor="status">حالة الإعلان</Label>
                <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                >
                    <SelectTrigger className="mt-2">
                        <SelectValue placeholder="اختر حالة الإعلان" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    إلغاء
                </Button>
                <Button type="submit">
                    {isEditing ? "تحديث الإعلان" : "إنشاء إعلان"}
                </Button>
            </div>
        </form>
    )
}
