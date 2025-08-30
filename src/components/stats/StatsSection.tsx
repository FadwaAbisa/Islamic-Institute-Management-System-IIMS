interface StatsSectionProps {
  stats: {
    total: number
    complete: number
    incomplete: number
    excellent: number
    needsAttention: number
  }
}

export function StatsSection({ stats }: StatsSectionProps) {
  const completionRate = stats.total > 0 ? (stats.complete / stats.total) * 100 : 0

  return (
    <div className="bg-lamaPurpleLight p-6 rounded-lg shadow-sm border border-lamaSkyLight mt-6">
      <h3 className="text-lg font-semibold text-lamaBlack mb-4">ملخص إحصائي</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-lamaSky">{stats.total}</div>
          <div className="text-sm text-lamaBlackLight">إجمالي الطلاب</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
          <div className="text-sm text-lamaBlackLight">مكتملة</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.incomplete}</div>
          <div className="text-sm text-lamaBlackLight">غير مكتملة</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.excellent}</div>
          <div className="text-sm text-lamaBlackLight">متفوقون</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.needsAttention}</div>
          <div className="text-sm text-lamaBlackLight">يحتاجون اهتمام</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-lamaBlackLight mb-1">
          <span>نسبة الإكمال</span>
          <span>{completionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-lamaYellowLight rounded-full h-2">
          <div
            className="bg-lamaSky h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
