"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ClipboardCheck, Eye, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ReviewRequestsPageProps {
  onBack: () => void
}

export default function ReviewRequestsPage({ onBack }: ReviewRequestsPageProps) {
  const [requests, setRequests] = useState([
    {
      id: "REQ001",
      studentName: "أحمد محمد علي",
      studentId: "001",
      subject: "القرآن الكريم وعلومه",
      currentGrade: 65,
      requestedGrade: 75,
      reason: "أعتقد أن هناك خطأ في تصحيح السؤال الثالث",
      status: "pending",
      date: "2024-01-15",
      teacher: "د. محمد أحمد",
    },
    {
      id: "REQ002",
      studentName: "فاطمة أحمد حسن",
      studentId: "002",
      subject: "الفقه الإسلامي",
      currentGrade: 58,
      requestedGrade: 68,
      reason: "لم يتم احتساب درجة المشاركة في الفصل",
      status: "pending",
      date: "2024-01-14",
      teacher: "د. عبدالله سالم",
    },
    {
      id: "REQ003",
      studentName: "محمد عبدالله سالم",
      studentId: "003",
      subject: "اللغة العربية",
      currentGrade: 72,
      requestedGrade: 78,
      reason: "خطأ في جمع الدرجات",
      status: "approved",
      date: "2024-01-13",
      teacher: "د. سارة محمود",
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            معلق
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            موافق عليه
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            مرفوض
          </Badge>
        )
      default:
        return <Badge variant="secondary">غير محدد</Badge>
    }
  }

  const handleApprove = (requestId: string) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" } : req)))
  }

  const handleReject = (requestId: string) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-amber-600 text-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-amber-700">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          <div className="text-sm">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-amber-600 mb-2 flex items-center justify-center gap-2">
            <ClipboardCheck className="w-6 h-6" />
            طلبات المراجعة
          </h1>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-sm text-yellow-800">طلبات معلقة</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "approved").length}
              </div>
              <div className="text-sm text-green-800">طلبات موافق عليها</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {requests.filter((r) => r.status === "rejected").length}
              </div>
              <div className="text-sm text-red-800">طلبات مرفوضة</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة طلبات المراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">اسم الطالب</TableHead>
                  <TableHead className="text-right">المادة</TableHead>
                  <TableHead className="text-right">الدرجة الحالية</TableHead>
                  <TableHead className="text-right">الدرجة المطلوبة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.studentName}</TableCell>
                    <TableCell>{request.subject}</TableCell>
                    <TableCell>
                      <span className="font-bold text-red-600">{request.currentGrade}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-600">{request.requestedGrade}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md" dir="rtl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل طلب المراجعة</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <strong>الطالب:</strong> {request.studentName}
                              </div>
                              <div>
                                <strong>المادة:</strong> {request.subject}
                              </div>
                              <div>
                                <strong>الأستاذ:</strong> {request.teacher}
                              </div>
                              <div>
                                <strong>سبب الطلب:</strong>
                                <p className="mt-1 p-2 bg-gray-50 rounded">{request.reason}</p>
                              </div>
                              <div className="flex gap-2">
                                <strong>الدرجة الحالية:</strong>
                                <span className="text-red-600 font-bold">{request.currentGrade}</span>
                                <strong>→ الدرجة المطلوبة:</strong>
                                <span className="text-green-600 font-bold">{request.requestedGrade}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(request.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
