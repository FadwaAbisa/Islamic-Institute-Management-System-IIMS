"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, TagIcon } from "lucide-react";

const localizer = momentLocalizer(moment);
moment.locale("ar");

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
    recurrence?: string;
    recurrenceEndDate?: Date;
    attendees: string[];
    createdBy?: string;
    image?: string;
    tags: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EventsDisplay: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [view, setView] = useState<View>(Views.MONTH);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/events");
            if (response.ok) {
                const data = await response.json();
                const eventsWithDates = data.map((event: any) => ({
                    ...event,
                    startTime: new Date(event.startTime),
                    endTime: new Date(event.endTime),
                    recurrenceEndDate: event.recurrenceEndDate ? new Date(event.recurrenceEndDate) : null,
                    createdAt: new Date(event.createdAt),
                    updatedAt: new Date(event.updatedAt),
                }));
                setEvents(eventsWithDates);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleEventClick = (event: any) => {
        const foundEvent = events.find(e => e.id === event.id);
        if (foundEvent) {
            setSelectedEvent(foundEvent);
            setIsEventDialogOpen(true);
        }
    };

    const calendarEvents = events
        .filter(event => event.status === "ACTIVE")
        .map(event => ({
            id: event.id,
            title: event.title,
            start: event.startTime,
            end: event.endTime,
            allDay: event.isAllDay,
            resource: event,
        }));

    const getEventColor = (event: any) => {
        const foundEvent = events.find(e => e.id === event.id);
        if (foundEvent?.color) {
            return foundEvent.color;
        }

        switch (foundEvent?.eventType) {
            case "ACADEMIC":
                return "#b8956a";
            case "SOCIAL":
                return "#d2b48c";
            case "RELIGIOUS":
                return "#8b7355";
            case "ADMINISTRATIVE":
                return "#e2d5c7";
            case "SPORTS":
                return "#f0e6d6";
            case "CULTURAL":
                return "#f7f3ee";
            default:
                return "#b8956a";
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

    const getPriorityLabel = (priority: string) => {
        const priorities: { [key: string]: string } = {
            LOW: "منخفض",
            MEDIUM: "متوسط",
            HIGH: "عالي",
            URGENT: "عاجل",
        };
        return priorities[priority] || priority;
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

    return (
        <div className="p-6 bg-lama-purple-light min-h-screen" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-lama-yellow mb-2">تقويم الأحداث</h1>
                    <p className="text-lama-sky text-lg">عرض جميع الأحداث والأنشطة</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-white border-l-4 border-l-lama-yellow shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">إجمالي الأحداث</p>
                                    <p className="text-2xl font-bold text-lama-yellow">{events.length}</p>
                                </div>
                                <CalendarIcon className="h-8 w-8 text-lama-yellow" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-l-4 border-l-lama-sky shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">أحداث هذا الشهر</p>
                                    <p className="text-2xl font-bold text-lama-sky">
                                        {events.filter(e => {
                                            const now = new Date();
                                            const eventDate = new Date(e.startTime);
                                            return eventDate.getMonth() === now.getMonth() &&
                                                eventDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                                <div className="h-8 w-8 bg-lama-sky rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-l-4 border-l-lama-purple shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">أحداث اليوم</p>
                                    <p className="text-2xl font-bold text-lama-purple">
                                        {events.filter(e => {
                                            const now = new Date();
                                            const eventDate = new Date(e.startTime);
                                            return eventDate.toDateString() === now.toDateString();
                                        }).length}
                                    </p>
                                </div>
                                <div className="h-8 w-8 bg-lama-purple rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white">
                        <CardTitle className="text-xl font-bold">تقويم الأحداث</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[600px] p-4">
                            <Calendar
                                localizer={localizer}
                                events={calendarEvents}
                                startAccessor="start"
                                endAccessor="end"
                                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                                view={view}
                                onView={setView}
                                onSelectEvent={handleEventClick}
                                eventPropGetter={(event) => ({
                                    style: {
                                        backgroundColor: getEventColor(event),
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        padding: "4px 8px",
                                        cursor: "pointer",
                                    },
                                })}
                                messages={messages}
                                selectable
                                popup
                                step={15}
                                timeslots={4}
                                className="rtl"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-lama-yellow">
                                {selectedEvent?.title}
                            </DialogTitle>
                        </DialogHeader>
                        {selectedEvent && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-lama-yellow text-lama-yellow">
                                        {getEventTypeLabel(selectedEvent.eventType)}
                                    </Badge>
                                    <Badge className={getPriorityColor(selectedEvent.priority)}>
                                        {getPriorityLabel(selectedEvent.priority)}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-gray-700">{selectedEvent.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-5 w-5 text-lama-yellow" />
                                        <div>
                                            <p className="text-sm text-gray-600">وقت البداية</p>
                                            <p className="font-semibold">
                                                {selectedEvent.startTime.toLocaleString("en-US")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-5 w-5 text-lama-yellow" />
                                        <div>
                                            <p className="text-sm text-gray-600">وقت النهاية</p>
                                            <p className="font-semibold">
                                                {selectedEvent.endTime.toLocaleString("en-US")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedEvent.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-5 w-5 text-lama-yellow" />
                                        <div>
                                            <p className="text-sm text-gray-600">الموقع</p>
                                            <p className="font-semibold">{selectedEvent.location}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedEvent.attendees.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <UsersIcon className="h-5 w-5 text-lama-yellow" />
                                        <div>
                                            <p className="text-sm text-gray-600">المشاركون</p>
                                            <p className="font-semibold">{selectedEvent.attendees.join(", ")}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedEvent.tags.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <TagIcon className="h-5 w-5 text-lama-yellow" />
                                        <div>
                                            <p className="text-sm text-gray-600">العلامات</p>
                                            <div className="flex gap-2 mt-1">
                                                {selectedEvent.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-lama-sky-light text-lama-yellow">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedEvent.notes && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">ملاحظات إضافية</p>
                                        <p className="text-gray-700 bg-lama-purple-light p-3 rounded-lg">
                                            {selectedEvent.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={() => setIsEventDialogOpen(false)}
                                        className="bg-lama-yellow hover:bg-lama-yellow/90 text-white"
                                    >
                                        إغلاق
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default EventsDisplay;


