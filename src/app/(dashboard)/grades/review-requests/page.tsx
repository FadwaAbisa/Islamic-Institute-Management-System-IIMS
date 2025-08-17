import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Check, X } from "lucide-react"

const mockRequests = [
  {
    id: 1,
    studentName: "أحمد محمد علي السعيد",
    requestType: "مراجعة درجات",
    subject: "التفسير وعلوم القرآن",
    date: "2024-01-15",
    status: "قيد المراجعة",
    reason: "خطأ في حساب درجة الامتحان النهائي",
  },
  {
    id: 2,
    studentName: "فاطمة عبدالله حسن النور",
    requestType: "تعديل بيانات",
    subject: "-",
    date: "2024-01-14",
    status: "جديد",
    reason: "تعديل رقم الهاتف",
  },
  {
    id: 3,
    studentName: "محمد عبدالرحمن أحمد الزهراني",
    requestType: "إعادة قيد",
    subject: "-",
    date: "2024-01-13",
    status: "مكتمل",
    reason: "طلب إعادة القيد بعد الانقطاع",
  },
]

export default function ReviewRequestsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-800"
      case "قيد المراجعة":
        return "bg-yellow-100 text-yellow-800"
      case "مكتمل":
        return "bg-green-100 text-green-800"
      case "مرفوض":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-lamaSky to-lamaYellow text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</h1>
            <div className="w-16 h-0.5 bg-white mx-auto mb-2 rounded-full"></div>
            <p className="text-white/90 text-lg">طلبات المراجعة</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Card className="shadow-xl border-2 border-lamaSkyLight bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl text-lamaYellow font-bold">طلبات المراجعة</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الطالب</TableHead>
                    <TableHead className="text-right">نوع الطلب</TableHead>
                    <TableHead className="text-right">المادة</TableHead>
                    <TableHead className="text-right">تاريخ الطلب</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">السبب</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.studentName}</TableCell>
                      <TableCell>{request.requestType}</TableCell>
                      <TableCell>{request.subject}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {request.status !== "مكتمل" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 bg-transparent"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
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
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-lamaSkyLight to-lamaYellowLight hover:from-lamaYellowLight hover:to-lamaSkyLight text-lamaYellow border border-lamaSky font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
