// "use client";

// import Image from "next/image";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   {
//     name: "Jan",
//     income: 4000,
//     expense: 2400,
//   },
//   {
//     name: "Feb",
//     income: 3000,
//     expense: 1398,
//   },
//   {
//     name: "Mar",
//     income: 2000,
//     expense: 9800,
//   },
//   {
//     name: "Apr",
//     income: 2780,
//     expense: 3908,
//   },
//   {
//     name: "May",
//     income: 1890,
//     expense: 4800,
//   },
//   {
//     name: "Jun",
//     income: 2390,
//     expense: 3800,
//   },
//   {
//     name: "Jul",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Aug",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Sep",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Oct",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Nov",
//     income: 3490,
//     expense: 4300,
//   },
//   {
//     name: "Dec",
//     income: 3490,
//     expense: 4300,
//   },
// ];

// const FinanceChart = () => {
//   return (
//     <div className="bg-white rounded-xl w-full h-full p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-lg font-semibold">Finance</h1>
//         <Image src="/moreDark.png" alt="" width={20} height={20} />
//       </div>
//       <ResponsiveContainer width="100%" height="90%">
//         <LineChart
//           width={500}
//           height={300}
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
//           <XAxis
//             dataKey="name"
//             axisLine={false}
//             tick={{ fill: "#d1d5db" }}
//             tickLine={false}
//             tickMargin={10}
//           />
//           <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false}  tickMargin={20}/>
//           <Tooltip />
//           <Legend
//             align="center"
//             verticalAlign="top"
//             wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
//           />
//           <Line
//             type="monotone"
//             dataKey="income"
//             stroke="#C3EBFA"
//             strokeWidth={5}
//           />
//           <Line type="monotone" dataKey="expense" stroke="#CFCEFF" strokeWidth={5}/>
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default FinanceChart;


"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "يناير", income: 4000, expense: 2400 },
  { name: "فبراير", income: 3000, expense: 1398 },
  { name: "مارس", income: 2000, expense: 9800 },
  { name: "أبريل", income: 2780, expense: 3908 },
  { name: "مايو", income: 1890, expense: 4800 },
  { name: "يونيو", income: 2390, expense: 3800 },
  { name: "يوليو", income: 3490, expense: 4300 },
  { name: "أغسطس", income: 3490, expense: 4300 },
  { name: "سبتمبر", income: 3490, expense: 4300 },
  { name: "أكتوبر", income: 3490, expense: 4300 },
  { name: "نوفمبر", income: 3490, expense: 4300 },
  { name: "ديسمبر", income: 3490, expense: 4300 },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4" dir="rtl" style={{ textAlign: "right" }}>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">المالية</h1>
        <Image src="/moreDark.png" alt="المزيد" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
            reversed={true} // يعكس المحور X ليكون من اليمين لليسار
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "income") return [value, "الدخل"];
              if (name === "expense") return [value, "المصروف"];
              return [value, name];
            }}
            labelFormatter={(label) => `الشهر: ${label}`}
            wrapperStyle={{ direction: "rtl", textAlign: "right" }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px", direction: "rtl" }}
            formatter={(value) => {
              if (value === "income") return "الدخل";
              if (value === "expense") return "المصروف";
              return value;
            }}
          />
          <Line type="monotone" dataKey="income" stroke="#C3EBFA" strokeWidth={5} />
          <Line type="monotone" dataKey="expense" stroke="#CFCEFF" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
