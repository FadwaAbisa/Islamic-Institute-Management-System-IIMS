"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import EventForm from "./EventForm";

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

interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    eventType: string;
    priority: string;
    status: string;
    color: string;
    isAllDay: boolean;
    recurrence: string;
    recurrenceEndDate: string;
    attendees: string[];
    image: string;
    tags: string[];
    notes: string;
}

const EventsManagement: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [view, setView] = useState<View>(Views.MONTH);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<EventFormData>({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        eventType: "ACADEMIC",
        priority: "MEDIUM",
        status: "ACTIVE",
        color: "#b8956a",
        isAllDay: false,
        recurrence: "NONE",
        recurrenceEndDate: "",
        attendees: [],
        image: "",
        tags: [],
        notes: "",
    });

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
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
            toast.error("فشل في جلب الأحداث");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = async () => {
        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("تم إنشاء الحدث بنجاح");
                setIsCreateDialogOpen(false);
                resetForm();
                fetchEvents();
            } else {
                const error = await response.json();
                toast.error(error.error || "فشل في إنشاء الحدث");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("فشل في إنشاء الحدث");
        }
    };

    const handleUpdateEvent = async () => {
        if (!selectedEvent) return;

        try {
            const response = await fetch(`/api/events/${selectedEvent.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("تم تحديث الحدث بنجاح");
                setIsEditDialogOpen(false);
                resetForm();
                fetchEvents();
            } else {
                const error = await response.json();
                toast.error(error.error || "فشل في تحديث الحدث");
            }
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("فشل في تحديث الحدث");
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا الحدث؟")) return;

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("تم حذف الحدث بنجاح");
                fetchEvents();
            } else {
                const error = await response.json();
                toast.error(error.error || "فشل في حذف الحدث");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("فشل في حذف الحدث");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            location: "",
            eventType: "ACADEMIC",
            priority: "MEDIUM",
            status: "ACTIVE",
            color: "#b8956a",
            isAllDay: false,
            recurrence: "NONE",
            recurrenceEndDate: "",
            attendees: [],
            image: "",
            tags: [],
            notes: "",
        });
    };

    const openEditDialog = (event: Event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            startTime: event.startTime.toISOString().slice(0, 16),
            endTime: event.endTime.toISOString().slice(0, 16),
            location: event.location || "",
            eventType: event.eventType,
            priority: event.priority,
            status: event.status,
            color: event.color || "#b8956a",
            isAllDay: event.isAllDay,
            recurrence: event.recurrence || "NONE",
            recurrenceEndDate: event.recurrenceEndDate ? event.recurrenceEndDate.toISOString().slice(0, 16) : "",
            attendees: event.attendees,
            image: event.image || "",
            tags: event.tags,
            notes: event.notes || "",
        });
        setIsEditDialogOpen(true);
    };

    const handleEventClick = (event: any) => {
        const foundEvent = events.find(e => e.id === event.id);
        if (foundEvent) {
            openEditDialog(foundEvent);
        }
    };

    const calendarEvents = events.map(event => ({
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

    return (
        <div className="p-6 bg-lama-purple-light min-h-screen" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-lama-yellow mb-2">إدارة الأحداث</h1>
                        <p className="text-lama-sky text-lg">نظام متكامل لإدارة وتنظيم جميع الأحداث</p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-lama-yellow hover:bg-lama-yellow/90 text-white px-6 py-3 rounded-xl shadow-lg">
                                <PlusIcon className="ml-2 h-5 w-5" />
                                إضافة حدث جديد
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-lama-yellow">إضافة حدث جديد</DialogTitle>
                            </DialogHeader>
                            <EventForm
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={handleCreateEvent}
                                submitText="إنشاء الحدث"
                                onCancel={() => setIsCreateDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                                    <p className="text-sm text-gray-600">الأحداث النشطة</p>
                                    <p className="text-2xl font-bold text-lama-sky">
                                        {events.filter(e => e.status === "ACTIVE").length}
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
                                    <p className="text-sm text-gray-600">أحداث هذا الشهر</p>
                                    <p className="text-2xl font-bold text-lama-purple">
                                        {events.filter(e => {
                                            const now = new Date();
                                            const eventDate = new Date(e.startTime);
                                            return eventDate.getMonth() === now.getMonth() &&
                                                eventDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                                <div className="h-8 w-8 bg-lama-purple rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-l-4 border-l-lama-yellow-light shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">أحداث عاجلة</p>
                                    <p className="text-2xl font-bold text-lama-yellow-light">
                                        {events.filter(e => e.priority === "URGENT").length}
                                    </p>
                                </div>
                                <div className="h-8 w-8 bg-lama-yellow-light rounded-full"></div>
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

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-lama-yellow">تعديل الحدث</DialogTitle>
                        </DialogHeader>
                        <EventForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleUpdateEvent}
                            submitText="تحديث الحدث"
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default EventsManagement;
