"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";

interface Event {
    id: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    eventType: string;
    priority: string;
    status: string;
    color?: string;
    isAllDay: boolean;
}

const UpcomingEventsWidget: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    const fetchUpcomingEvents = async () => {
        try {
            const now = new Date();
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + 7);

            const response = await fetch(`/api/events?startDate=${now.toISOString()}&endDate=${endOfWeek.toISOString()}&status=ACTIVE`);
            if (response.ok) {
                const data = await response.json();
                const eventsWithDates = data.map((event: any) => ({
                    ...event,
                    startTime: new Date(event.startTime),
                    endTime: new Date(event.endTime),
                }));

                // ترتيب الأحداث حسب التاريخ
                const sortedEvents = eventsWithDates
                    .sort((a: Event, b: Event) => a.startTime.getTime() - b.startTime.getTime())
                    .slice(0, 5); // عرض أول 5 أحداث فقط

                setEvents(sortedEvents);
            }
        } catch (error) {
            console.error("Error fetching upcoming events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getEventTypeLabel = (type: string) => {
        const types: { [key: string]: string } = {
            ACADEMIC: "أكاديمي",
            SOCIAL: "اجتماعي",
            RELIGIOUS: "ديني",
            ADMINISTRATIVE: "إداري",
            SPORTS: "رياضي",
            CULTURAL: "ثقافي",
            OTHER: "أخرى",
        };
        return types[type] || type;
    };

    const getPriorityColor = (priority: string) => {
        const colors: { [key: string]: string } = {
            LOW: "bg-green-100 text-green-800",
            MEDIUM: "bg-yellow-100 text-yellow-800",
            HIGH: "bg-orange-100 text-orange-800",
            URGENT: "bg-red-100 text-red-800",
        };
        return colors[priority] || "bg-gray-100 text-gray-800";
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ar-EG", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isTomorrow = (date: Date) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.toDateString() === tomorrow.toDateString();
    };

    const getRelativeDate = (date: Date) => {
        if (isToday(date)) return "اليوم";
        if (isTomorrow(date)) return "غداً";
        return formatDate(date);
    };

    if (isLoading) {
        return (
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white rounded-t-2xl">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        الأحداث القادمة
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="h-4 bg-lama-sky-light rounded w-3/4"></div>
                                <div className="h-4 bg-lama-sky-light rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white rounded-t-2xl">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    الأحداث القادمة
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {events.length === 0 ? (
                    <div className="text-center py-6">
                        <CalendarIcon className="h-12 w-12 text-lama-sky-light mx-auto mb-3" />
                        <p className="text-lama-sky text-sm">لا توجد أحداث قادمة هذا الأسبوع</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="p-3 rounded-lg border border-lama-sky-light hover:border-lama-yellow transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-gray-800 group-hover:text-lama-yellow transition-colors line-clamp-1">
                                        {event.title}
                                    </h4>
                                    <Badge className={getPriorityColor(event.priority)}>
                                        {event.priority === "URGENT" ? "عاجل" : event.priority}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="border-lama-yellow text-lama-yellow text-xs">
                                        {getEventTypeLabel(event.eventType)}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4 text-lama-yellow" />
                                        <span className="font-medium">{getRelativeDate(event.startTime)}</span>
                                        <span>•</span>
                                        <span>{formatTime(event.startTime)}</span>
                                        {!event.isAllDay && (
                                            <>
                                                <span>-</span>
                                                <span>{formatTime(event.endTime)}</span>
                                            </>
                                        )}
                                    </div>

                                    {event.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon className="h-4 w-4 text-lama-yellow" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    )}
                                </div>

                                {event.description && (
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                        {event.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {events.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-lama-sky-light">
                        <Button
                            className="w-full border border-lama-yellow text-lama-yellow bg-lamaPurple hover:bg-lama-yellow hover:text-white transition-colors"
                            onClick={() => window.location.href = "/events/view"}
                        >
                            عرض جميع الأحداث
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UpcomingEventsWidget;
