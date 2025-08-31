"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

const AcademicCalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // الحصول على تفاصيل الشهر
    const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    // الحصول على أول يوم في الشهر
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    // التنقل بين الشهور
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // التحقق من اليوم الحالي
    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && 
               today.getMonth() === currentDate.getMonth() && 
               today.getFullYear() === currentDate.getFullYear();
    };

    // التحقق من التاريخ المحدد
    const isSelected = (day: number) => {
        return selectedDate.getDate() === day && 
               selectedDate.getMonth() === currentDate.getMonth() && 
               selectedDate.getFullYear() === currentDate.getFullYear();
    };

    // تحديد التاريخ المحدد
    const selectDate = (day: number) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    };

    // إنشاء مصفوفة الأيام
    const renderCalendarDays = () => {
        const days = [];
        
        // إضافة الأيام الفارغة من الشهر السابق
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-16 lg:h-20"></div>
            );
        }

        // إضافة أيام الشهر الحالي
        for (let day = 1; day <= daysInMonth; day++) {
            const isCurrentDay = isToday(day);
            const isSelectedDay = isSelected(day);
            
            days.push(
                <div
                    key={day}
                    onClick={() => selectDate(day)}
                    className={`h-16 lg:h-20 flex items-center justify-center text-lg lg:text-xl font-semibold cursor-pointer transition-all duration-300 rounded-xl border-2 ${
                        isCurrentDay
                            ? 'bg-gradient-to-br from-lama-sky to-lama-yellow text-white border-lama-sky shadow-lg'
                            : isSelectedDay
                            ? 'bg-lama-sky-light border-lama-sky text-lama-sky'
                            : 'hover:bg-lama-purple-light border-transparent hover:border-lama-sky/30'
                    }`}
                    style={{ 
                        color: isCurrentDay ? 'white' : isSelectedDay ? '#B8956A' : '#371E13'
                    }}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-lama-sky-light to-lama-yellow-light overflow-hidden">
            <Navbar />
            
            {/* المحتوى الرئيسي */}
            <div className="pt-24 pb-8 px-6 h-screen flex flex-col">
                <div className="container mx-auto flex-1 flex flex-col">
                    {/* العنوان */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#371E13' }}>
                            التقويم الدراسي
                        </h1>
                        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-lama-sky to-lama-yellow rounded-full"></div>
                    </div>

                    {/* التقويم */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 w-full max-w-4xl">
                            {/* رأس التقويم */}
                            <div className="flex items-center justify-between mb-6 lg:mb-8">
                                <button
                                    onClick={goToPreviousMonth}
                                    className="p-3 lg:p-4 rounded-full hover:bg-lama-sky-light transition-all duration-300 hover:scale-110"
                                    style={{ color: '#371E13' }}
                                >
                                    <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="text-center">
                                    <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: '#371E13' }}>
                                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </h2>
                                </div>

                                <button
                                    onClick={goToNextMonth}
                                    className="p-3 lg:p-4 rounded-full hover:bg-lama-sky-light transition-all duration-300 hover:scale-110"
                                    style={{ color: '#371E13' }}
                                >
                                    <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* أسماء الأيام */}
                            <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4">
                                {dayNames.map((day) => (
                                    <div
                                        key={day}
                                        className="h-12 lg:h-16 flex items-center justify-center text-lg lg:text-xl font-bold rounded-xl"
                                        style={{ 
                                            backgroundColor: '#F0E6D6',
                                            color: '#371E13'
                                        }}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* الأيام */}
                            <div className="grid grid-cols-7 gap-2 lg:gap-4">
                                {renderCalendarDays()}
                            </div>

                            {/* معلومات إضافية */}
                            <div className="mt-6 lg:mt-8 flex flex-wrap justify-center gap-4 text-sm lg:text-base">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-gradient-to-br from-lama-sky to-lama-yellow"></div>
                                    <span style={{ color: '#371E13' }}>اليوم الحالي</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-lama-sky-light border-2 border-lama-sky"></div>
                                    <span style={{ color: '#371E13' }}>التاريخ المحدد</span>
                                </div>
                            </div>

                            {/* التاريخ المحدد */}
                            {selectedDate && (
                                <div className="mt-6 text-center p-4 bg-lama-purple-light rounded-xl">
                                    <p className="text-lg lg:text-xl font-semibold" style={{ color: '#371E13' }}>
                                        التاريخ المحدد: {dayNames[selectedDate.getDay()]} {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendarPage;
