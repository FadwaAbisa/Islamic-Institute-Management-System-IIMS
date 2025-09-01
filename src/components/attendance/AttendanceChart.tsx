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
        <span style={{ marginLeft: 15, color: "#B8956A", fontWeight: "bold" }}>حاضر</span>
        <span style={{ marginLeft: 15, color: "#D2B48C", fontWeight: "bold" }}>غائب</span>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E6D6" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#B8956A" }}
          tickLine={false}
          reversed={true} // لو تريد المحور X من اليمين لليسار
        />
        <YAxis 
          axisLine={false} 
          tick={{ fill: "#B8956A" }} 
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString('en-US')}
        />
        <Tooltip
          contentStyle={{ 
            borderRadius: "10px", 
            borderColor: "#E2D5C7", 
            backgroundColor: "#FCFAF8",
            direction: "rtl", 
            textAlign: "right" 
          }}
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
          fill="#B8956A"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="absent"
          fill="#D2B48C"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
