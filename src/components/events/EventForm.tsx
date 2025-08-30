"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

interface EventFormProps {
    formData: EventFormData;
    setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
    onSubmit: () => void;
    submitText: string;
    onCancel?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
    formData,
    setFormData,
    onSubmit,
    submitText,
    onCancel
}) => {
    const handleInputChange = (field: keyof EventFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTagsChange = (value: string) => {
        const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleAttendeesChange = (value: string) => {
        const attendees = value.split(",").map(attendee => attendee.trim()).filter(attendee => attendee);
        setFormData(prev => ({ ...prev, attendees }));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="title" className="text-lama-yellow font-semibold">عنوان الحدث *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="أدخل عنوان الحدث"
                        className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    />
                </div>

                <div>
                    <Label htmlFor="eventType" className="text-lama-yellow font-semibold">نوع الحدث</Label>
                    <Select value={formData.eventType} onValueChange={(value) => handleInputChange("eventType", value)}>
                        <SelectTrigger className="mt-2 border-lama-sky-light focus:border-lama-yellow">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACADEMIC">أكاديمي</SelectItem>
                            <SelectItem value="SOCIAL">اجتماعي</SelectItem>
                            <SelectItem value="RELIGIOUS">ديني</SelectItem>
                            <SelectItem value="ADMINISTRATIVE">إداري</SelectItem>
                            <SelectItem value="SPORTS">رياضي</SelectItem>
                            <SelectItem value="CULTURAL">ثقافي</SelectItem>
                            <SelectItem value="OTHER">أخرى</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label htmlFor="description" className="text-lama-yellow font-semibold">وصف الحدث</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="أدخل وصف الحدث"
                    className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startTime" className="text-lama-yellow font-semibold">وقت البداية *</Label>
                    <Input
                        id="startTime"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    />
                </div>

                <div>
                    <Label htmlFor="endTime" className="text-lama-yellow font-semibold">وقت النهاية *</Label>
                    <Input
                        id="endTime"
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="location" className="text-lama-yellow font-semibold">الموقع</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="أدخل موقع الحدث"
                        className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    />
                </div>

                <div>
                    <Label htmlFor="priority" className="text-lama-yellow font-semibold">الأولوية</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="mt-2 border-lama-sky-light focus:border-lama-yellow">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">منخفض</SelectItem>
                            <SelectItem value="MEDIUM">متوسط</SelectItem>
                            <SelectItem value="HIGH">عالي</SelectItem>
                            <SelectItem value="URGENT">عاجل</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="status" className="text-lama-yellow font-semibold">الحالة</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger className="mt-2 border-lama-sky-light focus:border-lama-yellow">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">نشط</SelectItem>
                            <SelectItem value="DRAFT">مسودة</SelectItem>
                            <SelectItem value="POSTPONED">مؤجل</SelectItem>
                            <SelectItem value="CANCELLED">ملغي</SelectItem>
                            <SelectItem value="COMPLETED">مكتمل</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="color" className="text-lama-yellow font-semibold">لون الحدث</Label>
                    <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => handleInputChange("color", e.target.value)}
                        className="mt-2 h-12 border-lama-sky-light focus:border-lama-yellow"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="recurrence" className="text-lama-yellow font-semibold">التكرار</Label>
                    <Select value={formData.recurrence} onValueChange={(value) => handleInputChange("recurrence", value)}>
                        <SelectTrigger className="mt-2 border-lama-sky-light focus:border-lama-yellow">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NONE">بدون تكرار</SelectItem>
                            <SelectItem value="DAILY">يومي</SelectItem>
                            <SelectItem value="WEEKLY">أسبوعي</SelectItem>
                            <SelectItem value="MONTHLY">شهري</SelectItem>
                            <SelectItem value="YEARLY">سنوي</SelectItem>
                            <SelectItem value="CUSTOM">مخصص</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {formData.recurrence !== "NONE" && (
                    <div>
                        <Label htmlFor="recurrenceEndDate" className="text-lama-yellow font-semibold">تاريخ انتهاء التكرار</Label>
                        <Input
                            id="recurrenceEndDate"
                            type="datetime-local"
                            value={formData.recurrenceEndDate}
                            onChange={(e) => handleInputChange("recurrenceEndDate", e.target.value)}
                            className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="tags" className="text-lama-yellow font-semibold">العلامات (مفصولة بفواصل)</Label>
                    <Input
                        id="tags"
                        value={formData.tags.join(", ")}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="أدخل العلامات مفصولة بفواصل"
                        className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    />
                </div>

                <div>
                    <Label htmlFor="attendees" className="text-lama-yellow font-semibold">المشاركون (مفصولون بفواصل)</Label>
                    <Input
                        id="attendees"
                        value={formData.attendees.join(", ")}
                        onChange={(e) => handleAttendeesChange(e.target.value)}
                        placeholder="أدخل المشاركين مفصولين بفواصل"
                        className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="notes" className="text-lama-yellow font-semibold">ملاحظات إضافية</Label>
                <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="أدخل ملاحظات إضافية"
                    className="mt-2 border-lama-sky-light focus:border-lama-yellow"
                    rows={3}
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isAllDay"
                    checked={formData.isAllDay}
                    onCheckedChange={(checked) => handleInputChange("isAllDay", checked)}
                    className="text-lama-yellow focus:ring-lama-yellow border-lama-sky-light rounded"
                />
                <Label htmlFor="isAllDay" className="text-lama-yellow font-semibold">حدث طوال اليوم</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="border-lama-sky-light text-lama-yellow hover:bg-lama-sky-light"
                    >
                        إلغاء
                    </Button>
                )}
                <Button
                    type="button"
                    onClick={onSubmit}
                    className="bg-lama-yellow hover:bg-lama-yellow/90 text-white px-6 py-2 rounded-xl"
                >
                    {submitText}
                </Button>
            </div>
        </div>
    );
};

export default EventForm;
