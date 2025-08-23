import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, Printer } from "lucide-react"
import Link from "next/link"

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 font-cairo flex items-center gap-3">
            <FileText className="w-8 h-8 text-lamaYellow" />
            طباعة كشوفات أعمال الفترة
          </h1>
          <Link href="/">
            <Button
              variant="outline"
              className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white px-6 py-2 transition-colors bg-white font-tajawal"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>

        <Card className="bg-white border-lamaYellowLight shadow-lg mb-8">
          <CardContent className="p-6">
            <p className="text-gray-600 text-center mb-6 bg-lamaSkyLight p-3 rounded-lg font-tajawal">
              اختر المجموعة الدراسية المطلوبة ثم اضغط على زر التحضير للطباعة.
            </p>

            <div className="grid grid-cols-4 gap-4">
              {/* Academic Year */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center font-tajawal">
                  العام الدراسي
                </label>
                <Select>
                  <SelectTrigger className="w-full border-lamaYellowLight focus:border-lamaYellow focus:ring-lamaYellow font-tajawal">
                    <SelectValue placeholder="-- اختر --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center font-tajawal">المرحلة</label>
                <Select>
                  <SelectTrigger className="w-full border-lamaYellowLight focus:border-lamaYellow focus:ring-lamaYellow font-tajawal">
                    <SelectValue placeholder="-- اختر --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-year">السنة الأولى</SelectItem>
                    <SelectItem value="second-year">السنة الثانية</SelectItem>
                    <SelectItem value="third-year">السنة الثالثة</SelectItem>
                    <SelectItem value="graduation">التخرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Division */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center font-tajawal">الشعبة</label>
                <Select>
                  <SelectTrigger className="w-full border-lamaYellowLight focus:border-lamaYellow focus:ring-lamaYellow font-tajawal">
                    <SelectValue placeholder="-- اختر --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="islamic-studies">الدراسات الإسلامية</SelectItem>
                    <SelectItem value="quranic-readings">القراءات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Study System */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center font-tajawal">نظام الدراسة</label>
                <Select>
                  <SelectTrigger className="w-full border-lamaYellowLight focus:border-lamaYellow focus:ring-lamaYellow font-tajawal">
                    <SelectValue placeholder="-- اختر --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">نظامي</SelectItem>
                    <SelectItem value="correspondence">انتساب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button className="bg-lamaYellow hover:bg-lamaSky text-white px-8 py-2 transition-colors font-tajawal">
                <Printer className="w-4 h-4 ml-2" />
                تحضير للطباعة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
