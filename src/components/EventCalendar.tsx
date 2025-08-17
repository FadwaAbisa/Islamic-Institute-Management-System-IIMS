"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value.toISOString().split("T")[0]}`); // إرسال التاريخ بصيغة YYYY-MM-DD
    }
  }, [value, router]);

  return (
    <div dir="rtl" className="calendar-ar">
      <Calendar
        onChange={onChange}
        value={value}
        locale="ar" // تعريب أسماء الأيام والشهور
        
      />
      <style jsx global>{`
        /* تعديل اتجاه التقويم للنصوص والخلية */
        .react-calendar {
          direction: rtl;
          text-align: right;
        }
        .react-calendar__month-view__days__day abbr {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
