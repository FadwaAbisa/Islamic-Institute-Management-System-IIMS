import { Card, CardContent } from "@/components/ui/card"
import { FileText, AlertTriangle, Award, ClipboardCheck, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 font-cairo">صفحة الدرجات الرئيسية</h1>
          <p className="text-gray-600 text-lg font-tajawal">اختر المهمة التي تريد تنفيذها من القائمة أدناه</p>
        </div>

        {/* Reports Section */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <BarChart3 className="w-7 h-7 text-lamaYellow" />
            <h2 className="text-2xl font-bold text-gray-800 font-cairo">التقارير</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Review List */}
            <Link href="/grades/results/review">
              <Card className="bg-white border-lamaYellowLight hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                    <ClipboardCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm font-tajawal">كشف المراجعة</h3>
                  <p className="text-gray-600 text-xs leading-relaxed font-tajawal">كشوفات المراجعة والتدقيق</p>
                </CardContent>
              </Card>
            </Link>

            {/* Top Students */}
            <Link href="/grades/results/top-students">
              <Card className="bg-white border-lamaYellowLight hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm font-tajawal">كشف الأوائل</h3>
                  <p className="text-gray-600 text-xs leading-relaxed font-tajawal">قائمة الطلاب المتفوقين والأوائل</p>
                </CardContent>
              </Card>
            </Link>

            {/* Second Round Students */}
            <Link href="/grades/results/second-round">
              <Card className="bg-white border-lamaYellowLight hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm font-tajawal">طلاب الدور الثاني</h3>
                  <p className="text-gray-600 text-xs leading-relaxed font-tajawal">
                    قائمة الطلاب المؤجلين للدور الثاني
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Approved Transcripts */}
            <Link href="/grades/results/approved-transcripts">
              <Card className="bg-white border-lamaYellowLight hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-sm font-tajawal">الكشوفات المعتمدة</h3>
                  <p className="text-gray-600 text-xs leading-relaxed font-tajawal">عرض وطباعة الكشوفات المعتمدة</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
