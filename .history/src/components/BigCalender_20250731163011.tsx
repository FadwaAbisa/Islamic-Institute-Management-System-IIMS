

"use client";

import { Calendar, momentLocalizer, View, Views, stringOrDate } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const messages = {
  allDay: "طوال اليوم",
  previous: "السابق",
  next: "التالي",
  today: "اليوم",
  month: "الشهر",
  week: "الأسبوع",
  work_week: "أسبوع العمل",
  day: "اليوم",
  agenda: "الأجندة",
  date: "التاريخ",
  time: "الوقت",
  event: "الحدث",
  noEventsInRange: "لا توجد أحداث في هذه الفترة",
  showMore: (total: number) => `+ عرض ${total} المزيد`,
};

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: stringOrDate; end: stringOrDate }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <div dir="rtl" style={{ height: "98%", textAlign: "right" }}>
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        views={{ work_week: true, day: true }} // بالترجمة من Views
        view={view}
        onView={handleOnChangeView}
        style={{ height: "100%" }}
        messages={messages}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
      />
    </div>
  );
};

export default BigCalendar;
