"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Student = {
    id: string;
    fullName: string;
    class: { name: string };
};

type Class = {
    id: number;
    name: string;
    students: Student[];
};

const WEEKDAYS = [
    { value: "MONDAY", label: "الإثنين" },
    { value: "TUESDAY", label: "الثلاثاء" },
    { value: "WEDNESDAY", label: "الأربعاء" },
    { value: "THURSDAY", label: "الخميس" },
    { value: "FRIDAY", label: "الجمعة" },
];

const MarkAttendancePage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const router = useRouter();

    // تحديد اليوم الحالي تلقائياً
    useEffect(() => {
        const today = new Date();
        const dayIndex = today.getDay();
        // تحويل أرقام الأيام (0=الأحد, 1=الإثنين...) إلى أسماء الأيام
        const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const currentDay = dayNames[dayIndex];

        // إذا كان اليوم الحالي من أيام الدراسة، استخدمه
        if (WEEKDAYS.some(day => day.value === currentDay)) {
            setSelectedDay(currentDay);
        } else {
            // وإلا استخدم الإثنين كافتراضي
            setSelectedDay("MONDAY");
        }
    }, []);

    // جلب الفصول المتاحة
    useEffect(() => {
        fetchClasses();
    }, []);

    // جلب الطلاب عند تحديد الفصل
    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            const response = await fetch('/api/classes');
            if (response.ok) {
            const data = await response.json();
                setClasses(Array.isArray(data) ? data : []);
            } else {
                throw new Error('فشل في جلب الفصول');
            }
        } catch (error) {
            console.error('خطأ في جلب الفصول:', error);
            toast.error('خطأ في جلب الفصول');
            setClasses([]);
        }
    };

    const fetchStudents = async () => {
        if (!selectedClass) return;

        try {
            const response = await fetch(`/api/classes/${selectedClass}/students`);
            if (response.ok) {
            const data = await response.json();
                setStudents(Array.isArray(data) ? data : []);

            // تهيئة حالة الحضور
            const initialAttendance: { [key: string]: boolean } = {};
                (Array.isArray(data) ? data : []).forEach((student: Student) => {
                initialAttendance[student.id] = true; // افتراضياً جميع الطلاب حاضرون
            });
            setAttendance(initialAttendance);
            } else {
                throw new Error('فشل في جلب الطلاب');
            }
        } catch (error) {
            console.error('خطأ في جلب الطلاب:', error);
            toast.error('خطأ في جلب الطلاب');
            setStudents([]);
        }
    };

    const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: isPresent
        }));
    };

    const handleSubmit = async () => {
        if (!selectedClass) {
            toast.error('يجب اختيار الفصل أولاً');
            return;
        }

        if (!selectedDay) {
            toast.error('يجب اختيار اليوم أولاً');
            return;
        }

        setLoading(true);
        try {
            const attendanceData = Object.entries(attendance).map(([studentId, present]) => ({
                studentId,
                classId: selectedClass,
                day: selectedDay,
                date: new Date(date),
                present
            }));

            const response = await fetch('/api/attendance/daily', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attendanceRecords: attendanceData }),
            });

            if (response.ok) {
                toast.success('تم حفظ الحضور بنجاح');
                router.push('/list/attendance');
            } else {
                throw new Error('فشل في حفظ الحضور');
            }
        } catch (error) {
            console.error('خطأ في حفظ الحضور:', error);
            toast.error('خطأ في حفظ الحضور');
        } finally {
            setLoading(false);
        }
    };

    const selectedClassInfo = classes.find(c => c.id === selectedClass);
    const selectedDayInfo = WEEKDAYS.find(day => day.value === selectedDay);

    return (
        <div className="bg-white p-6 rounded-md flex-1 m-4 mt-0">
            {/* العنوان */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">تسجيل الحضور اليومي</h1>
                <p className="text-gray-600">اختر الفصل واليوم والتاريخ وسجل حضور الطلاب</p>
            </div>

            {/* خيارات التحديد */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* اختيار الفصل */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        اختيار الفصل
                    </label>
                    <select
                        value={selectedClass || ''}
                        onChange={(e) => setSelectedClass(Number(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">اختر الفصل</option>
                        {classes.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* اختيار اليوم */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        اليوم
                    </label>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">اختر اليوم</option>
                        {WEEKDAYS.map((day) => (
                            <option key={day.value} value={day.value}>
                                {day.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* اختيار التاريخ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        التاريخ
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* معلومات التحديد */}
            {selectedClassInfo && selectedDayInfo && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-blue-800">
                        الفصل: {selectedClassInfo.name} - يوم {selectedDayInfo.label}
                    </h3>
                    <p className="text-blue-600 text-sm">
                        التاريخ: {new Date(date).toLocaleDateString('ar-SA')}
                    </p>
                </div>
            )}

            {/* قائمة الطلاب */}
            {students.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        قائمة الطلاب ({students.length} طالب)
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 p-3 text-right">اسم الطالب</th>
                                    <th className="border border-gray-300 p-3 text-center">الحالة</th>
                                    <th className="border border-gray-300 p-3 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-3">
                                            <div>
                                                <div className="font-medium">{student.fullName}</div>
                                                <div className="text-sm text-gray-500">{student.class.name}</div>
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${attendance[student.id]
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {attendance[student.id] ? "حاضر" : "غائب"}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleAttendanceChange(student.id, true)}
                                                    className={`px-3 py-1 rounded text-xs font-medium ${attendance[student.id]
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-200 text-gray-700"
                                                        }`}
                                                >
                                                    حاضر
                                                </button>
                                                <button
                                                    onClick={() => handleAttendanceChange(student.id, false)}
                                                    className={`px-3 py-1 rounded text-xs font-medium ${!attendance[student.id]
                                                            ? "bg-red-500 text-white"
                                                            : "bg-gray-200 text-gray-700"
                                                        }`}
                                                >
                                                    غائب
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* أزرار الحفظ */}
            {students.length > 0 && (
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "جاري الحفظ..." : "حفظ الحضور"}
                    </button>
                </div>
            )}

            {/* رسالة في حالة عدم وجود طلاب */}
            {selectedClass && students.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">لا يوجد طلاب في هذا الفصل</p>
                </div>
            )}
        </div>
    );
};

export default MarkAttendancePage;