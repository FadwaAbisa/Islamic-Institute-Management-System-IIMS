"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "white",
    },
    {
      name: "Girls",
      count: girls,
      fill: "#D2B48C", // lamaSky - ذهبي دافئ للبنات
    },
    {
      name: "Boys", 
      count: boys,
      fill: "#B8956A", // lamaYellow - بني ذهبي للأولاد
    },
  ];

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar 
            background={{ fill: '#F7F3EE' }} // lamaPurple كخلفية
            dataKey="count" 
            cornerRadius={4}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      {/* أيقونة مركزية محسنة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-sm">
        <Image
          src="/maleFemale.png"
          alt="ذكور وإناث"
          width={40}
          height={40}
          className="opacity-80"
        />
      </div>
    </div>
  );
};

export default CountChart;