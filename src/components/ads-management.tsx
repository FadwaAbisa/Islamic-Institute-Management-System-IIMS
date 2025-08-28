"use client"

import React, { useState } from "react"
import Image from "next/image"

import { useAds, type Advertisement } from "@/contexts/AdsContext"
import Toast from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Upload,
  Home,
  ChevronLeft,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Calendar,
  ImageIcon,
  LinkIcon,
  FileText,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"

export function AdsManagement() {
  const { ads, addAd, updateAd, deleteAd, toggleAdStatus, getActiveAds } = useAds()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: "",
    startDate: "",
    endDate: "",
    status: "نشط" as "نشط" | "غير نشط",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("الكل")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      updateAd(editingId, {
        ...formData,
        image: formData.image || "/generic-advertisement-banner.png",
      })
      setEditingId(null)
      setToast({
        message: "تم تحديث الإعلان بنجاح ✅",
        type: "success"
      })
    } else {
      addAd({
        ...formData,
        image: formData.image || "/generic-advertisement-banner.png",
      })
      setToast({
        message: "تمت إضافة الإعلان بنجاح ✅",
        type: "success"
      })
    }

    setFormData({
      title: "",
      description: "",
      link: "",
      image: "",
      startDate: "",
      endDate: "",
      status: "نشط",
    })
  }

  const handleEdit = (ad: Advertisement) => {
    setFormData({
      title: ad.title,
      description: ad.description,
      link: ad.link || "",
      image: ad.image,
      startDate: ad.startDate,
      endDate: ad.endDate,
      status: ad.status,
    })
    setEditingId(ad.id)
  }

  const handleDelete = (id: number) => {
    deleteAd(id)
    toast({
      title: "تم حذف الإعلان",
      description: "تم حذف الإعلان من القائمة بنجاح",
      variant: "destructive",
    })
  }

  const toggleStatus = (id: number) => {
    toggleAdStatus(id)
  }

  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "الكل" || ad.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-white to-lama-sky-light">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lama-yellow via-lama-sky to-lama-yellow-light opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <nav className="flex items-center gap-3 text-sm text-white/90 mb-8" dir="rtl">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Home className="h-4 w-4" />
              <span>الرئيسية</span>
            </div>
            <ChevronLeft className="h-4 w-4" />
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <BarChart3 className="h-4 w-4" />
              <span>لوحة التحكم</span>
            </div>
            <ChevronLeft className="h-4 w-4" />
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 font-medium">
              <Sparkles className="h-4 w-4" />
              <span>إدارة الإعلانات</span>
            </div>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">إدارة الإعلانات</h1>
                  <p className="text-white/90 text-xl font-medium">إنشاء وإدارة إعلانات الموقع بأسلوب احترافي</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center min-w-[120px] border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-white mr-2" />
                  <div className="text-3xl font-bold text-white">{ads.length}</div>
                </div>
                <div className="text-white/80 text-sm font-medium">إجمالي الإعلانات</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center min-w-[120px] border border-white/20">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-green-300 mr-2" />
                  <div className="text-3xl font-bold text-white">{ads.filter((ad) => ad.status === "نشط").length}</div>
                </div>
                <div className="text-white/80 text-sm font-medium">إعلانات نشطة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          <div className="xl:col-span-3">
            <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-lama-sky/20 via-lama-purple/30 to-lama-yellow-light/20 border-b border-lama-sky/20">
                <CardTitle className="flex items-center gap-4 text-2xl text-lama-yellow">
                  <div className="bg-gradient-to-br from-lama-yellow to-lama-sky p-3 rounded-2xl shadow-lg">
                    <Plus className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{editingId ? "تعديل الإعلان" : "إضافة إعلان جديد"}</div>
                    <div className="text-sm text-gray-600 font-normal mt-1">املأ البيانات أدناه لإنشاء إعلان جذاب</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-lama-sky/20">
                        <div className="bg-gradient-to-br from-lama-yellow/20 to-lama-sky/20 p-2 rounded-xl">
                          <FileText className="h-6 w-6 text-lama-yellow" />
                        </div>
                        <span className="text-xl font-bold text-lama-yellow">المعلومات الأساسية</span>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="title" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <div className="w-2 h-2 bg-lama-yellow rounded-full"></div>
                          عنوان الإعلان
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="أدخل عنوان جذاب ومميز للإعلان"
                          className="h-14 text-lg border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="description"
                          className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-lama-yellow rounded-full"></div>
                          وصف الإعلان
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="اكتب وصفاً مفصلاً وجذاباً يوضح مميزات الإعلان"
                          rows={5}
                          className="text-lg border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm resize-none transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="link" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <div className="w-2 h-2 bg-lama-sky rounded-full"></div>
                          <LinkIcon className="h-5 w-5 text-lama-sky" />
                          رابط الإعلان (اختياري)
                        </Label>
                        <Input
                          id="link"
                          type="url"
                          value={formData.link}
                          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                          placeholder="https://example.com"
                          className="h-14 text-lg border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-lama-sky/20">
                        <div className="bg-gradient-to-br from-lama-sky/20 to-lama-yellow/20 p-2 rounded-xl">
                          <ImageIcon className="h-6 w-6 text-lama-sky" />
                        </div>
                        <span className="text-xl font-bold text-lama-sky">الصورة والمرفقات</span>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <div className="w-2 h-2 bg-lama-sky rounded-full"></div>
                          صورة الإعلان
                        </Label>
                        <div className="relative group">
                          <div className="border-3 border-dashed border-lama-sky/40 rounded-2xl p-12 text-center bg-gradient-to-br from-lama-purple/20 to-lama-sky/10 hover:from-lama-purple/30 hover:to-lama-sky/20 transition-all duration-500 group-hover:border-lama-yellow/60">
                            <div className="bg-gradient-to-br from-lama-yellow to-lama-sky p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Upload className="h-10 w-10 text-white" />
                            </div>
                            <p className="text-lama-yellow font-bold text-lg mb-2">اسحب وأفلت الصورة هنا</p>
                            <p className="text-gray-600 mb-6 text-base">
                              أو انقر لاختيار صورة من جهازك (PNG, JPG, GIF)
                            </p>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setFormData({ ...formData, image: URL.createObjectURL(file) })
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white hover:from-lama-yellow/90 hover:to-lama-sky/90 border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => document.getElementById("image")?.click()}
                            >
                              اختر صورة
                            </Button>
                          </div>
                          {formData.image && (
                            <div className="mt-6 relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-lama-yellow/20 to-lama-sky/20 rounded-2xl blur-xl"></div>
                              <Image
                                src={formData.image || "/placeholder.svg"}
                                alt="معاينة"
                                width={400}
                                height={160}
                                className="relative h-40 w-full object-cover rounded-2xl border-3 border-lama-sky/30 shadow-xl"
                              />
                              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                تم الرفع
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-lama-purple/20 via-white/50 to-lama-sky/20 rounded-2xl p-8 border border-lama-sky/20">
                    <div className="flex items-center gap-3 pb-6 border-b-2 border-lama-sky/20 mb-8">
                      <div className="bg-gradient-to-br from-lama-sky/20 to-lama-yellow/20 p-2 rounded-xl">
                        <Calendar className="h-6 w-6 text-lama-sky" />
                      </div>
                      <span className="text-xl font-bold text-lama-sky">التوقيت والحالة</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <Label
                          htmlFor="startDate"
                          className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                        >
                          <Clock className="h-5 w-5 text-green-600" />
                          تاريخ البداية
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="h-14 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <Label
                          htmlFor="endDate"
                          className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                        >
                          <Clock className="h-5 w-5 text-red-600" />
                          تاريخ النهاية
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="h-14 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="status" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                          حالة الإعلان
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: "نشط" | "غير نشط") => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger className="h-14 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="نشط">نشط</SelectItem>
                            <SelectItem value="غير نشط">غير نشط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6 pt-8">
                    <Button
                      type="submit"
                      className="flex-1 h-16 text-xl bg-gradient-to-r from-lama-yellow via-lama-sky to-lama-yellow-light hover:from-lama-yellow/90 hover:via-lama-sky/90 hover:to-lama-yellow-light/90 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        {editingId ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                        {editingId ? "تحديث الإعلان" : "حفظ الإعلان"}
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="px-10 h-16 text-xl border-3 border-lama-sky/40 text-lama-yellow hover:bg-lama-sky/10 hover:border-lama-sky hover:text-lama-sky rounded-2xl bg-white/80 backdrop-blur-sm font-semibold transition-all duration-300"
                      onClick={() => {
                        setFormData({
                          title: "",
                          description: "",
                          link: "",
                          image: "",
                          startDate: "",
                          endDate: "",
                          status: "نشط",
                        })
                        setEditingId(null)
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1">
            <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl sticky top-8 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-lama-sky/20 to-lama-yellow/20 border-b border-lama-sky/20">
                <CardTitle className="flex items-center gap-3 text-lama-sky">
                  <div className="bg-gradient-to-br from-lama-sky to-lama-yellow p-2 rounded-xl shadow-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">معاينة الموقع</div>
                    <div className="text-sm text-gray-600 font-normal">الإعلانات المعروضة</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-base text-gray-700 font-semibold">الإعلانات النشطة:</p>
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      {getActiveAds().length}
                    </Badge>
                  </div>
                  {getActiveAds()
                    .slice(0, 3)
                    .map((ad) => (
                      <div
                        key={ad.id}
                        className="group border-2 border-lama-sky/20 rounded-2xl p-5 bg-gradient-to-br from-white via-lama-purple/10 to-lama-sky/5 hover:from-lama-purple/20 hover:to-lama-sky/15 hover:shadow-xl hover:border-lama-yellow/40 transition-all duration-500 hover:scale-[1.02]"
                      >
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          <Image
                            src={ad.image || "/placeholder.svg"}
                            alt={ad.title}
                            width={300}
                            height={96}
                            className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <h4 className="font-bold text-base text-lama-yellow mb-2 group-hover:text-lama-sky transition-colors duration-300">
                          {ad.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{ad.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">نشط الآن</span>
                        </div>
                      </div>
                    ))}
                  {getActiveAds().length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="bg-gray-100 rounded-2xl p-8">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">لا توجد إعلانات نشطة</p>
                        <p className="text-sm mt-2">قم بإنشاء إعلان جديد لعرضه هنا</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-12 shadow-2xl border-0 bg-white/70 backdrop-blur-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lama-purple/20 via-lama-sky/20 to-lama-yellow/20 border-b border-lama-sky/20">
            <CardTitle className="text-2xl text-lama-yellow font-bold">قائمة الإعلانات</CardTitle>
            <div className="flex gap-6 mt-8">
              <div className="flex-1 relative">
                <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-lama-yellow" />
                <Input
                  placeholder="البحث في الإعلانات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-14 h-14 text-lg border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-56 h-14 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                  <Filter className="h-5 w-5 ml-2 text-lama-yellow" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع الحالات</SelectItem>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="غير نشط">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-lama-purple/30 to-lama-sky/30 hover:from-lama-purple/40 hover:to-lama-sky/40 border-b-2 border-lama-sky/20">
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">المعرف</TableHead>
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">الصورة</TableHead>
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">العنوان</TableHead>
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">الحالة</TableHead>
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">
                      تاريخ البداية
                    </TableHead>
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">
                      تاريخ النهاية
                    </TableHead>
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">الرابط</TableHead>
                    <TableHead className="text-right font-bold text-lama-yellow text-base py-6">العمليات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds.map((ad, index) => (
                    <TableRow
                      key={ad.id}
                      className={`hover:bg-gradient-to-r hover:from-lama-purple/20 hover:to-lama-sky/20 transition-all duration-300 border-b border-lama-sky/10 ${index % 2 === 0 ? "bg-white/80" : "bg-lama-purple/5"
                        }`}
                    >
                      <TableCell className="font-bold text-lama-yellow text-lg py-6">#{ad.id}</TableCell>
                      <TableCell className="py-6">
                        <div className="relative group">
                          <Image
                            src={ad.image || "/placeholder.svg"}
                            alt={ad.title}
                            width={128}
                            height={80}
                            className="h-20 w-32 object-cover rounded-xl border-2 border-lama-sky/30 shadow-lg group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs py-6">
                        <div>
                          <p className="font-bold text-gray-800 mb-2 text-base">{ad.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{ad.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <Badge
                          variant={ad.status === "نشط" ? "default" : "secondary"}
                          className={`px-4 py-2 text-sm font-semibold rounded-xl ${ad.status === "نشط"
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300"
                            }`}
                        >
                          {ad.status === "نشط" ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {ad.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium py-6">{ad.startDate}</TableCell>
                      <TableCell className="text-gray-700 font-medium py-6">{ad.endDate}</TableCell>
                      <TableCell className="py-6">
                        {ad.link ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-lama-yellow hover:text-white hover:bg-lama-yellow rounded-xl p-3 transition-all duration-300"
                          >
                            <a href={ad.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">لا يوجد</span>
                        )}
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(ad)}
                            className="text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl p-3 transition-all duration-300"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(ad.id)}
                            className={`rounded-xl p-3 transition-all duration-300 ${ad.status === "نشط"
                              ? "text-green-600 hover:text-white hover:bg-green-600"
                              : "text-gray-400 hover:text-white hover:bg-gray-600"
                              }`}
                          >
                            {ad.status === "نشط" ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-white hover:bg-red-600 rounded-xl p-3 transition-all duration-300"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-2 border-lama-sky/30 rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold text-lama-yellow">
                                  تأكيد الحذف
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base text-gray-700">
                                  هل أنت متأكد أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(ad.id)}
                                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}