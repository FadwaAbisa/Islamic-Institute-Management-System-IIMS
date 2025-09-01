"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AcademicChartProps {
  data: Array<{
    name: string;
    "الفترة الأولى": number;
    "الفترة الثانية": number;
    "الفترة الثالثة": number;
  }>;
  totalStats?: {
    totalStudents: number;
    overallSuccessRate: number;
    totalGrades?: number;
  };
}

const AcademicChart = ({ data, totalStats }: AcademicChartProps) => {
  // تعريب تسميات الـ Legend
  const renderLegend = () => {
    return (
      <div style={{ paddingTop: 20, paddingBottom: 30, textAlign: "center", direction: "rtl" }}>
        <span style={{ marginLeft: 20, color: "#D2B48C", fontWeight: "bold" }}>● الفترة الأولى</span>
        <span style={{ marginLeft: 20, color: "#B8956A", fontWeight: "bold" }}>● الفترة الثانية</span>
        <span style={{ marginLeft: 20, color: "#E2D5C7", fontWeight: "bold" }}>● الفترة الثالثة</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4" dir="rtl">
      {/* رأس المخطط */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">إحصائيات النجاح في المعهد</h1>
          <p className="text-sm text-gray-500">نسبة النجاح لكل مرحلة دراسية حسب الفترات</p>
        </div>
        <Image src="/moreDark.png" alt="المزيد" width={20} height={20} />
      </div>

      {/* الإحصائيات العلوية */}
      {totalStats && (
        <div className="flex justify-center gap-8 mb-4 p-3 rounded-lg" style={{ backgroundColor: "#F7F3EE" }}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#B8956A" }}>{totalStats.totalStudents.toLocaleString('en-US')}</div>
            <div className="text-xs text-gray-600">إجمالي الطلاب</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#D2B48C" }}>{totalStats.overallSuccessRate}%</div>
            <div className="text-xs text-gray-600">معدل النجاح العام</div>
          </div>
          {totalStats.totalGrades && (
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#E2D5C7" }}>{totalStats.totalGrades.toLocaleString('en-US')}</div>
              <div className="text-xs text-gray-600">إجمالي الدرجات</div>
            </div>
          )}
        </div>
      )}

      {/* الرسم البياني */}
      <ResponsiveContainer width="100%" height="75%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D6" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#B8956A", fontSize: 12 }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            axisLine={false} 
            tick={{ fill: "#B8956A", fontSize: 12 }} 
            tickLine={false}
            tickMargin={10}
            domain={[0, 100]}
            label={{ value: 'معدل النجاح (%)', angle: 90, position: 'outside' }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E2D5C7",
              backgroundColor: "#FCFAF8",
              direction: "rtl",
              textAlign: "right",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend content={renderLegend} />
          
          {/* أعمدة الفترات */}
          <Bar
            dataKey="الفترة الأولى"
            fill="#D2B48C"
            radius={[4, 4, 0, 0]}
            name="الفترة الأولى"
          />
          <Bar
            dataKey="الفترة الثانية"
            fill="#B8956A"
            radius={[4, 4, 0, 0]}
            name="الفترة الثانية"
          />
          <Bar
            dataKey="الفترة الثالثة"
            fill="#E2D5C7"
            radius={[4, 4, 0, 0]}
            name="الفترة الثالثة"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AcademicChart;
