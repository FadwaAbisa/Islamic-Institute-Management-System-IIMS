"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  id: string;
  title: string;
  startTime: Date;
  description?: string;
}

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const router = useRouter();

  // جلب الأحداث من قاعدة البيانات
  const fetchEvents = async (date: Date) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events?date=${date.toISOString().split("T")[0]}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('خطأ في جلب الأحداث:', error);
    } finally {
      setLoading(false);
    }
  };

  // جلب جميع الأحداث للشهر الحالي
  const fetchMonthEvents = async (date: Date) => {
    setLoading(true);
    try {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const response = await fetch(`/api/events?startDate=${startOfMonth.toISOString().split("T")[0]}&endDate=${endOfMonth.toISOString().split("T")[0]}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('خطأ في جلب أحداث الشهر:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value.toISOString().split("T")[0]}`);
      fetchMonthEvents(value);
    }
  }, [value, router]);

  // دالة لتحديد ما إذا كان هناك أحداث في تاريخ معين
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });

    if (dayEvents.length > 0) {
      return (
        <div className="relative group">
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-lamaYellow rounded-full animate-pulse"></div>
          {dayEvents.length > 1 && (
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-lamaSky rounded-full animate-pulse"></div>
          )}
          {dayEvents.length > 2 && (
            <div className="absolute -bottom-1 w-2 h-2 bg-lamaPurple rounded-full animate-pulse" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
          )}
          
          {/* Tooltip للأحداث */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-lamaBlack text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            <div className="text-center">
              <div className="font-bold mb-1">{dayEvents.length} حدث</div>
              {dayEvents.slice(0, 3).map((event, index) => (
                <div key={index} className="text-lamaSkyLight">
                  • {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-lamaSkyLight">+{dayEvents.length - 3} أكثر</div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-lamaBlack"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  // دالة لتحديد الألوان حسب وجود الأحداث
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });

    if (dayEvents.length > 0) {
      return 'has-events';
    }
    return '';
  };

  return (
    <div dir="rtl" className="calendar-ar relative">
      <Calendar
        onChange={onChange}
        value={value}
        locale="ar"
        className="custom-calendar"
        tileContent={tileContent}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) {
            fetchMonthEvents(activeStartDate);
          }
        }}
      />
      
      {/* مؤشر التحميل */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-16 z-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lamaSky"></div>
        </div>
      )}

      <style jsx global>{`
        /* تصميم احترافي للتقويم */
        .custom-calendar {
          width: 100% !important;
          max-width: 100% !important;
          background: #FCFAF8 !important;
          border: 2px solid #D2B48C !important;
          border-radius: 16px !important;
          padding: 16px !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          box-shadow: 0 8px 32px rgba(210, 180, 140, 0.15) !important;
          position: relative !important;
        }

        /* رأس التقويم */
        .react-calendar__navigation {
          background: linear-gradient(135deg, #D2B48C, #B8956A) !important;
          border-radius: 12px !important;
          margin-bottom: 16px !important;
          padding: 8px !important;
        }

        .react-calendar__navigation button {
          background: transparent !important;
          border: none !important;
          color: #FCFAF8 !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }

        .react-calendar__navigation button:hover {
          background: rgba(252, 250, 248, 0.2) !important;
          transform: translateY(-1px) !important;
        }

        .react-calendar__navigation button:disabled {
          opacity: 0.6 !important;
        }

        /* أسماء الأيام */
        .react-calendar__month-view__weekdays {
          margin-bottom: 12px !important;
        }

        .react-calendar__month-view__weekdays__weekday {
          padding: 8px 4px !important;
          text-align: center !important;
          font-weight: 600 !important;
          color: #B8956A !important;
          font-size: 14px !important;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
          border-bottom: 2px solid #E2D5C7 !important;
          padding-bottom: 2px !important;
        }

        /* أيام الشهر */
        .react-calendar__month-view__days__day {
          padding: 8px !important;
          margin: 2px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          position: relative !important;
        }

        .react-calendar__month-view__days__day:hover {
          background: #F0E6D6 !important;
          transform: scale(1.05) !important;
          box-shadow: 0 4px 12px rgba(210, 180, 140, 0.2) !important;
        }

        .react-calendar__month-view__days__day--neighboringMonth {
          color: #E2D5C7 !important;
        }

        .react-calendar__month-view__days__day--today {
          background: linear-gradient(135deg, #B8956A, #D2B48C) !important;
          color: #FCFAF8 !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 12px rgba(184, 149, 106, 0.3) !important;
        }

        .react-calendar__month-view__days__day--selected {
          background: linear-gradient(135deg, #D2B48C, #F0E6D6) !important;
          color: #B8956A !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 16px rgba(210, 180, 140, 0.4) !important;
        }

        /* أيام تحتوي على أحداث */
        .react-calendar__tile.has-events {
          background: linear-gradient(135deg, #F0E6D6, #E2D5C7) !important;
          border: 2px solid #D2B48C !important;
          font-weight: 600 !important;
        }

        .react-calendar__tile.has-events:hover {
          background: linear-gradient(135deg, #E2D5C7, #D2B48C) !important;
          transform: scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(210, 180, 140, 0.3) !important;
        }

        /* أزرار التنقل */
        .react-calendar__navigation__prev-button,
        .react-calendar__navigation__next-button {
          background: rgba(252, 250, 248, 0.1) !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .react-calendar__navigation__prev-button:hover,
        .react-calendar__navigation__next-button:hover {
          background: rgba(252, 250, 248, 0.3) !important;
        }

        /* عنوان الشهر */
        .react-calendar__navigation__label {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: #FCFAF8 !important;
        }

        /* تعديل اتجاه التقويم للنصوص والخلية */
        .react-calendar {
          direction: rtl !important;
          text-align: right !important;
        }
        
        .react-calendar__month-view__days__day abbr {
          cursor: pointer !important;
        }

        /* تحسين المظهر العام */
        .react-calendar__tile {
          border: none !important;
          background: transparent !important;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: #F0E6D6 !important;
          border-radius: 8px !important;
        }

        /* تأثيرات إضافية */
        .custom-calendar::before {
          content: '' !important;
          position: absolute !important;
          top: -2px !important;
          left: -2px !important;
          right: -2px !important;
          bottom: -2px !important;
          background: linear-gradient(45deg, #D2B48C, #B8956A, #E2D5C7) !important;
          border-radius: 18px !important;
          z-index: -1 !important;
          opacity: 0.3 !important;
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
