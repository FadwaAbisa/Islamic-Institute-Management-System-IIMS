"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Check, X } from "lucide-react";
import Toast from "./ui/toast";

interface Student {
  id: string;
  fullName: string;
  class?: {
    name: string;
  };
}

interface AttendanceRecord {
  studentId: string;
  present: boolean;
}

interface AttendanceFormProps {
  teacherId: string;
}

const AttendanceForm = ({ teacherId }: AttendanceFormProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [studyYears, setStudyYears] = useState<Array<{ id: string; name: string }>>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // جلب السنوات الدراسية
  useEffect(() => {
    const fetchStudyYears = async () => {
      try {
        const response = await fetch("/api/study-levels");
        if (response.ok) {
          const data = await response.json();
          setStudyYears(data);
        }
      } catch (error) {
        console.error("خطأ في جلب السنوات الدراسية:", error);
      }
    };

    fetchStudyYears();
  }, []);

  // جلب الفصول عند اختيار السنة الدراسية
  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedYear) {
        setClasses([]);
        setSelectedClass("");
        return;
      }

      try {
        const response = await fetch(`/api/classes?studyLevel=${selectedYear}&teacherId=${teacherId}`);
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
          setSelectedClass(""); // إعادة تعيين الفصل المختار
        }
      } catch (error) {
        console.error("خطأ في جلب الفصول:", error);
      }
    };

    if (teacherId) {
      fetchClasses();
    }
  }, [selectedYear, teacherId]);

  // جلب الطلاب عند اختيار الفصل
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/classes/${selectedClass}/students`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
          
          // تهيئة سجلات الحضور
          const initialRecords = data.map((student: Student) => ({
            studentId: student.id,
            present: true, // افتراضي: حاضر
          }));
          setAttendanceRecords(initialRecords);
        }
      } catch (error) {
        console.error("خطأ في جلب الطلاب:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // تغيير حالة الحضور
  const toggleAttendance = (studentId: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, present: !record.present }
          : record
      )
    );
  };

  // حفظ الحضور
  const saveAttendance = async () => {
    if (!selectedClass || !selectedDate || attendanceRecords.length === 0) return;

    setSaving(true);
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceRecords: attendanceRecords.map(record => ({
            ...record,
            lessonId: parseInt(selectedClass), // استخدام classId كـ lessonId مؤقتاً
            date: selectedDate.toISOString(),
          })),
        }),
      });

      if (response.ok) {
        setToast({ message: "تم حفظ الحضور بنجاح!", type: "success" });
      } else {
        const error = await response.json();
        setToast({ message: `خطأ في حفظ الحضور: ${error.error}`, type: "error" });
      }
    } catch (error) {
      console.error("خطأ في حفظ الحضور:", error);
      setToast({ message: "خطأ في حفظ الحضور", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // نسخ الحضور من يوم سابق
  const copyFromPreviousDay = async () => {
    if (!selectedClass || !selectedDate) return;

    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);

    try {
      const response = await fetch(
        `/api/attendance?classId=${selectedClass}&date=${previousDate.toISOString()}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const previousRecords = data.map((record: any) => ({
            studentId: record.studentId,
            present: record.present,
          }));
          setAttendanceRecords(previousRecords);
          setToast({ message: "تم نسخ الحضور من اليوم السابق", type: "success" });
        } else {
          setToast({ message: "لا يوجد حضور مسجل لليوم السابق", type: "info" });
        }
      }
    } catch (error) {
      console.error("خطأ في نسخ الحضور:", error);
      setToast({ message: "خطأ في نسخ الحضور", type: "error" });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-800">
          تسجيل الحضور والغياب
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* اختيار السنة الدراسية والفصل والتاريخ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">السنة الدراسية</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="اختر السنة الدراسية" />
              </SelectTrigger>
              <SelectContent>
                {studyYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">الفصل</label>
            <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!selectedYear}>
              <SelectTrigger>
                <SelectValue placeholder={selectedYear ? "اختر الفصل" : "اختر السنة أولاً"} />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">التاريخ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? selectedDate.toLocaleDateString('ar-SA') : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={copyFromPreviousDay}
            variant="outline"
            disabled={!selectedYear || !selectedClass}
            className="flex items-center gap-2"
          >
            📋 نسخ من يوم سابق
          </Button>
          
          <Button
            onClick={saveAttendance}
            disabled={!selectedYear || !selectedClass || saving || attendanceRecords.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {saving ? "جاري الحفظ..." : "💾 حفظ الحضور"}
          </Button>
        </div>

        {/* قائمة الطلاب */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري تحميل الطلاب...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              قائمة الطلاب - {students.length} طالب
            </h3>
            
            <div className="grid gap-3">
              {students.map((student) => {
                const record = attendanceRecords.find(r => r.studentId === student.id);
                const isPresent = record?.present ?? true;

                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      isPresent 
                        ? "border-green-200 bg-green-50" 
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        isPresent ? "bg-green-500" : "bg-red-500"
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{student.fullName}</h4>
                        <p className="text-sm text-gray-500">
                          {student.class?.name || "غير محدد"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={isPresent ? "default" : "outline"}
                        onClick={() => toggleAttendance(student.id)}
                        className={`${
                          isPresent 
                            ? "bg-green-600 hover:bg-green-700" 
                            : "border-green-300 text-green-700"
                        }`}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        حاضر
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={!isPresent ? "default" : "outline"}
                        onClick={() => toggleAttendance(student.id)}
                        className={`${
                          !isPresent 
                            ? "bg-red-600 hover:bg-red-700" 
                            : "border-red-300 text-red-700"
                        }`}
                      >
                        <X className="w-4 h-4 mr-1" />
                        غائب
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedClass ? (
          <div className="text-center py-8 text-gray-500">
            لا يوجد طلاب في هذا الفصل
          </div>
        ) : selectedYear && !selectedClass ? (
          <div className="text-center py-8 text-gray-500">
            اختر الفصل لعرض قائمة الطلاب
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            اختر السنة الدراسية لعرض الفصول المتاحة
          </div>
        )}
      </CardContent>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Card>
  );
};

export default AttendanceForm;


