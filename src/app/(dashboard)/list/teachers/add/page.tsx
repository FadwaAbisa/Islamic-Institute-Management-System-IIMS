"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

export default function AddTeacherPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    sex: "",
    birthday: "",
    placeOfBirth: "",
    nationality: "",
    address: "",
    phone: "",
    email: "",
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "فشل إضافة المعلم")
      }
      setSuccess("تم إضافة المعلم بنجاح")
      setForm({
        fullName: "",
        nationalId: "",
        sex: "",
        birthday: "",
        placeOfBirth: "",
        nationality: "",
        address: "",
        phone: "",
        email: "",
      })
    } catch (e: any) {
      setError(e?.message || "خطأ غير متوقع")
    } finally {
      setIsSubmitting(false)
    }
  }

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight via-lamaPurple to-lamaSkyLight" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky via-lamaYellow to-lamaSky text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-20 h-1 bg-white/80 mx-auto mb-3 rounded-full"></div>
            <p className="text-white/90 text-lg font-medium">إضافة معلم جديد</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-8 max-w-5xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight py-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-lamaYellow mb-2">إضافة معلم جديد</CardTitle>
            <p className="text-gray-600">البيانات الشخصية والاتصال</p>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            {error && <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">{error}</div>}
            {success && (
              <div className="text-green-700 text-sm p-3 bg-green-50 rounded-lg border border-green-200">{success}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">الاسم الرباعي</Label>
                <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="الاسم الكامل" />
              </div>
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">رقم الهوية / الرقم الوطني</Label>
                <Input value={form.nationalId} onChange={(e) => update("nationalId", e.target.value)} placeholder="رقم الهوية" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">الجنس</Label>
                <Select value={form.sex} onValueChange={(v) => update("sex", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">ذكر</SelectItem>
                    <SelectItem value="FEMALE">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">تاريخ الميلاد</Label>
                <Input type="date" value={form.birthday} onChange={(e) => update("birthday", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">مكان الميلاد</Label>
                <Input value={form.placeOfBirth} onChange={(e) => update("placeOfBirth", e.target.value)} placeholder="مكان الميلاد" />
              </div>
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">الجنسية</Label>
                <Input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} placeholder="الجنسية" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-lamaYellow font-semibold">العنوان</Label>
              <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="العنوان الكامل" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">الهاتف</Label>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="رقم الهاتف" />
              </div>
              <div className="space-y-3">
                <Label className="text-lamaYellow font-semibold">البريد الإلكتروني</Label>
                <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="example@mail.com" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-lamaSky to-lamaYellow">
                {isSubmitting ? "جاري الإضافة..." : "إضافة المعلم"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


