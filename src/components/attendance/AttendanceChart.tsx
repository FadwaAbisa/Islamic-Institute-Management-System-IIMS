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

const AttendanceChart = ({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) => {
  // تعريب تسميات الـ Legend
  const renderLegend = () => {
    return (
      <div style={{ paddingTop: 20, paddingBottom: 40, textAlign: "right", direction: "rtl" }}>
        <span style={{ marginLeft: 15, color: "#FAE27C", fontWeight: "bold" }}>حاضر</span>
        <span style={{ marginLeft: 15, color: "#C3EBFA", fontWeight: "bold" }}>غائب</span>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
          reversed={true} // لو تريد المحور X من اليمين لليسار
        />
        <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: "10px", borderColor: "lightgray", direction: "rtl", textAlign: "right" }}
          formatter={(value: number, name: string) => {
            // ترجمة نصوص tooltip
            if (name === "present") return [value, "حاضر"];
            if (name === "absent") return [value, "غائب"];
            return [value, name];
          }}
        />
        <Legend content={renderLegend} />
        <Bar
          dataKey="present"
          fill="#FAE27C"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="absent"
          fill="#C3EBFA"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
