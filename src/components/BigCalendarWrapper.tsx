"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import BigCalendar from "./BigCalender";

interface Lesson {
  id: number;
  title: string;
  start: Date;
  end: Date;
  className: string;
  subject: string;
}

interface BigCalendarWrapperProps {
  type: "teacherId" | "classId";
  id: string | number;
}

const BigCalendarWrapper = ({ type, id }: BigCalendarWrapperProps) => {
  const { user, isLoaded } = useUser();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/lessons?type=${type}&id=${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // تحويل التواريخ من string إلى Date objects
        const processedLessons = data.lessons.map((lesson: any) => ({
          ...lesson,
          start: new Date(lesson.start),
          end: new Date(lesson.end)
        }));

        setLessons(processedLessons);
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setError(err instanceof Error ? err.message : "خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [type, id, isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الجدول الدراسي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">خطأ في تحميل الجدول</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {lessons.length === 0 ? (
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">لا توجد دروس مجدولة</h3>
            <p className="text-sm">لم يتم العثور على دروس في الجدول الحالي</p>
          </div>
        </div>
      ) : (
        <BigCalendar data={lessons} />
      )}
    </div>
  );
};

export default BigCalendarWrapper;
