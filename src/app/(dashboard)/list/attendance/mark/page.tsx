"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Student = {
    id: string;
    fullName: string;
    studyLevel?: string;
    academicYear?: string;
    specialization?: string;
};

type StudyLevel = {
    id: string;
    name: string;
    description: string;
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
    const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([]);
    const [selectedStudyLevel, setSelectedStudyLevel] = useState<string | null>(null);
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

    // جلب المراحل الدراسية المتاحة
    useEffect(() => {
        fetchStudyLevels();
    }, []);

    // جلب الطلاب عند تحديد المرحلة الدراسية
    useEffect(() => {
        if (selectedStudyLevel) {
            fetchStudents();
        }
    }, [selectedStudyLevel]);

    const fetchStudyLevels = async () => {
        try {
            const response = await fetch('/api/study-levels');
            if (response.ok) {
                const data = await response.json();
                setStudyLevels(Array.isArray(data) ? data : []);
            } else {
                throw new Error('فشل في جلب المراحل الدراسية');
            }
        } catch (error) {
            console.error('خطأ في جلب المراحل الدراسية:', error);
            toast.error('خطأ في جلب المراحل الدراسية');
            setStudyLevels([]);
        }
    };

    const fetchStudents = async () => {
        if (!selectedStudyLevel) return;

        try {
            const response = await fetch(`/api/students?studyLevel=${selectedStudyLevel}&limit=1000`);
            if (response.ok) {
                const data = await response.json();
                const studentsData = data.students || data;
                setStudents(Array.isArray(studentsData) ? studentsData : []);

                // تهيئة حالة الحضور
                const initialAttendance: { [key: string]: boolean } = {};
                (Array.isArray(studentsData) ? studentsData : []).forEach((student: Student) => {
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
        
        // إضافة تأثير بصري للتفاعل
        const studentName = students.find(s => s.id === studentId)?.fullName;
        if (isPresent) {
            toast.success(`تم تسجيل حضور ${studentName}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            toast.warning(`تم تسجيل غياب ${studentName}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleSubmit = async () => {
        if (!selectedStudyLevel) {
            toast.error('يجب اختيار المرحلة الدراسية أولاً');
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
                studyLevel: selectedStudyLevel,
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

    const selectedStudyLevelInfo = studyLevels.find(level => level.id === selectedStudyLevel);
    const selectedDayInfo = WEEKDAYS.find(day => day.value === selectedDay);

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-white to-lama-sky-light">
            {/* Header Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-lama-yellow via-lama-sky to-lama-yellow-light opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4 font-tajawal">
                            تسجيل الحضور اليومي
                        </h1>
                        <p className="text-white/90 text-lg font-tajawal">
                            اختر المرحلة الدراسية واليوم والتاريخ وسجل حضور الطلاب
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="glass-effect rounded-2xl shadow-custom p-8 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-lama-yellow rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute top-1/4 right-0 w-24 h-24 bg-lama-sky rounded-full translate-x-12"></div>
                        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-lama-yellow-light rounded-full translate-y-10"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-lama-sky-light rounded-full"></div>
                    </div>
                    <div className="relative z-10">

                    {/* خيارات التحديد */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* اختيار المرحلة الدراسية */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-800 mb-3 font-tajawal">
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-lama-yellow to-lama-sky rounded-full shadow-sm"></div>
                                    اختيار المرحلة الدراسية
                                </span>
                            </label>
                            <select
                                value={selectedStudyLevel || ''}
                                onChange={(e) => setSelectedStudyLevel(e.target.value)}
                                className="w-full p-4 border-2 border-lama-sky-light rounded-xl focus:ring-2 focus:ring-lama-yellow focus:border-lama-yellow transition-all duration-300 bg-white/80 backdrop-blur-sm font-tajawal text-gray-800 shadow-sm hover:shadow-md"
                            >
                                <option value="">اختر المرحلة الدراسية</option>
                                {studyLevels.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* اختيار اليوم */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-800 mb-3 font-tajawal">
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-lama-sky to-lama-yellow-light rounded-full shadow-sm"></div>
                                    اليوم
                                </span>
                            </label>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full p-4 border-2 border-lama-sky-light rounded-xl focus:ring-2 focus:ring-lama-yellow focus:border-lama-yellow transition-all duration-300 bg-white/80 backdrop-blur-sm font-tajawal text-gray-800 shadow-sm hover:shadow-md"
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
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-800 mb-3 font-tajawal">
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-lama-yellow-light to-lama-sky-light rounded-full shadow-sm"></div>
                                    التاريخ
                                </span>
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-4 border-2 border-lama-sky-light rounded-xl focus:ring-2 focus:ring-lama-yellow focus:border-lama-yellow transition-all duration-300 bg-white/80 backdrop-blur-sm font-tajawal text-gray-800 shadow-sm hover:shadow-md"
                            />
                        </div>
                    </div>

                    {/* معلومات التحديد */}
                    {selectedStudyLevelInfo && selectedDayInfo && (
                        <div className="bg-gradient-to-r from-lama-yellow-light to-lama-sky-light p-6 rounded-2xl mb-8 border border-lama-sky/30 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-lama-yellow to-lama-sky rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg font-tajawal">
                                        المرحلة الدراسية: {selectedStudyLevelInfo.name} - يوم {selectedDayInfo.label}
                                    </h3>
                                    <p className="text-gray-600 font-tajawal">
                                        التاريخ: {new Date(date).toLocaleDateString('ar-SA')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* قائمة الطلاب */}
                    {students.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-lama-yellow to-lama-sky rounded-full flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 font-tajawal">
                                        قائمة الطلاب
                                    </h2>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white px-6 py-3 rounded-full font-bold font-tajawal shadow-lg">
                                        {students.length} طالب
                                    </div>
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold font-tajawal shadow-lg">
                                        {Object.values(attendance).filter(Boolean).length} حاضر
                                    </div>
                                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-bold font-tajawal shadow-lg">
                                        {Object.values(attendance).filter(p => !p).length} غائب
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-custom overflow-hidden border border-lama-sky/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white shadow-lg">
                                                <th className="p-4 text-right font-bold font-tajawal">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        اسم الطالب
                                                    </div>
                                                </th>
                                                <th className="p-4 text-center font-bold font-tajawal">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        المرحلة الدراسية
                                                    </div>
                                                </th>
                                                <th className="p-4 text-center font-bold font-tajawal">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        الحالة
                                                    </div>
                                                </th>
                                                <th className="p-4 text-center font-bold font-tajawal">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        الإجراءات
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, index) => (
                                                <tr key={student.id} className={`hover:bg-lama-sky-light/30 transition-all duration-300 hover:shadow-md ${index % 2 === 0 ? 'bg-white/50' : 'bg-lama-purple-light/30'}`}>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-lama-yellow to-lama-sky rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                                {student.fullName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-800 font-tajawal">{student.fullName}</div>
                                                                <div className="text-sm text-gray-500 font-tajawal">ID: {student.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className="bg-lama-sky-light text-lama-yellow px-3 py-1 rounded-full text-sm font-medium font-tajawal shadow-sm">
                                                            {student.studyLevel || 'غير محدد'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold font-tajawal shadow-sm ${attendance[student.id]
                                                                    ? "bg-green-100 text-green-800 border-2 border-green-200"
                                                                    : "bg-red-100 text-red-800 border-2 border-red-200"
                                                                }`}
                                                        >
                                                            {attendance[student.id] ? "✅ حاضر" : "❌ غائب"}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex justify-center gap-3">
                                                            <button
                                                                onClick={() => handleAttendanceChange(student.id, true)}
                                                                className={`px-4 py-2 rounded-xl text-sm font-bold font-tajawal transition-all duration-300 shadow-sm ${attendance[student.id]
                                                                        ? "bg-green-500 text-white shadow-lg transform scale-105"
                                                                        : "bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-700 hover:shadow-md"
                                                                    }`}
                                                            >
                                                                ✅ حاضر
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(student.id, false)}
                                                                className={`px-4 py-2 rounded-xl text-sm font-bold font-tajawal transition-all duration-300 shadow-sm ${!attendance[student.id]
                                                                        ? "bg-red-500 text-white shadow-lg transform scale-105"
                                                                        : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-700 hover:shadow-md"
                                                                    }`}
                                                            >
                                                                ❌ غائب
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* أزرار الحفظ */}
                    {students.length > 0 && (
                        <div className="flex justify-center gap-6 pt-8 border-t border-lama-sky/20">
                            <button
                                onClick={() => router.back()}
                                className="px-8 py-4 border-2 border-lama-sky text-lama-yellow rounded-2xl hover:bg-lama-sky-light transition-all duration-300 font-bold font-tajawal text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    إلغاء
                                </span>
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-4 bg-gradient-to-r from-lama-yellow to-lama-sky text-white rounded-2xl hover:from-lama-sky hover:to-lama-yellow disabled:opacity-50 transition-all duration-300 font-bold font-tajawal text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        جاري الحفظ...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        حفظ الحضور
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {/* رسالة في حالة عدم وجود طلاب */}
                    {selectedStudyLevel && students.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-lama-sky-light to-lama-yellow-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-12 h-12 text-lama-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3 font-tajawal">لا يوجد طلاب</h3>
                            <p className="text-gray-600 font-tajawal text-lg">لا يوجد طلاب في هذه المرحلة الدراسية</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setSelectedStudyLevel(null)}
                                    className="px-6 py-3 bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-xl hover:from-lama-yellow hover:to-lama-sky transition-all duration-300 font-bold font-tajawal shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    اختر مرحلة أخرى
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendancePage;