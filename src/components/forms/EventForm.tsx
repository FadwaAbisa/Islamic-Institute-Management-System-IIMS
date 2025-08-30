"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Event Form Schema
interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location?: string;
    eventType?: string;
    priority?: string;
    isAllDay?: boolean;
}

const EventForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<EventFormData>({
        mode: "onChange"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeError, setTimeError] = useState("");
    const router = useRouter();

    // مراقبة تغييرات التواريخ للتحقق منها
    const startTime = watch("startTime");
    const endTime = watch("endTime");

    useEffect(() => {
        if (startTime && endTime) {
            const start = new Date(startTime);
            const end = new Date(endTime);

            if (start >= end) {
                setTimeError("وقت البداية يجب أن يكون قبل وقت النهاية");
            } else {
                setTimeError("");
            }
        }
    }, [startTime, endTime]);

    const onSubmit = async (formData: EventFormData) => {
        console.log("🚀 بدء عملية إنشاء الحدث...");
        setIsSubmitting(true);
        try {
            // التحقق من صحة التواريخ قبل الإرسال
            const startTime = new Date(formData.startTime);
            const endTime = new Date(formData.endTime);

            if (startTime >= endTime) {
                toast.error("❌ وقت البداية يجب أن يكون قبل وقت النهاية");
                setIsSubmitting(false);
                return;
            }

            console.log("✅ التواريخ صحيحة، جاري إرسال البيانات...");

            const url = type === "create" ? "/api/events" : `/api/events/${data?.id}`;
            const method = type === "create" ? "POST" : "PUT";

            const payload = {
                title: formData.title,
                description: formData.description || "",
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location || "",
                eventType: formData.eventType || "ACADEMIC",
                priority: formData.priority || "MEDIUM",
                isAllDay: formData.isAllDay || false,
            };

            console.log("Sending event data:", payload);

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "حدث خطأ أثناء حفظ الحدث");
            }

            const result = await response.json();
            console.log("✅ تم إنشاء الحدث بنجاح:", result);

            // رسالة نجاح أولى - إشعار سريع
            toast.success("✅ تم إضافة الحدث بنجاح!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                style: {
                    backgroundColor: "#10B981",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textAlign: "center",
                    border: "2px solid #059669",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
                }
            });

            // رسالة نجاح ثانية - تفاصيل كاملة
            setTimeout(() => {
                toast.info(
                    `📝 تفاصيل الحدث المضاف:\n\n` +
                    `🎯 العنوان: ${payload.title}\n` +
                    `📍 المكان: ${payload.location || "غير محدد"}\n` +
                    `📅 التاريخ: ${new Date(payload.startTime).toLocaleDateString("ar-EG")}\n` +
                    `⏰ من ${new Date(payload.startTime).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })} إلى ${new Date(payload.endTime).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}\n` +
                    `🗂️ النوع: ${payload.eventType === 'ACADEMIC' ? 'أكاديمي' : payload.eventType}\n` +
                    `⭐ الأولوية: ${payload.priority === 'MEDIUM' ? 'متوسطة' : payload.priority}\n\n` +
                    `💾 تم حفظ الحدث في قاعدة البيانات برقم ID: ${result.event?.id || 'غير محدد'}`,
                    {
                        position: "top-right",
                        autoClose: 10000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        style: {
                            fontSize: "13px",
                            lineHeight: "1.6",
                            whiteSpace: "pre-line",
                            backgroundColor: "#3B82F6",
                            color: "white",
                            border: "2px solid #2563EB",
                            borderRadius: "10px",
                            maxWidth: "400px"
                        }
                    }
                );
            }, 1000);

            // رسالة تأكيد إضافية (alert)
            setTimeout(() => {
                alert(`🎉 تهانينا! 🎉\n\n✅ تم إضافة الحدث "${payload.title}" بنجاح!\n\n📊 معلومات الحدث:\n📅 التاريخ: ${new Date(payload.startTime).toLocaleDateString("ar-EG")}\n⏰ الوقت: ${new Date(payload.startTime).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}\n📍 المكان: ${payload.location || "غير محدد"}\n\n💾 تم حفظ الحدث في قاعدة البيانات بنجاح!\n🔄 ستتم إعادة تحميل الصفحة لإظهار الحدث الجديد.`);
            }, 2000);

            setOpen(false);
            router.refresh();
        } catch (error: any) {
            console.error("Error submitting event:", error);
            toast.error(error.message || "حدث خطأ أثناء حفظ الحدث");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "إنشاء حدث جديد" : "تحديث الحدث"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="عنوان الحدث"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                    inputProps={{ required: true }}
                />

                <InputField
                    label="الوصف"
                    name="description"
                    defaultValue={data?.description}
                    register={register}
                    error={errors?.description}
                    type="textarea"
                />

                <InputField
                    label="المكان"
                    name="location"
                    defaultValue={data?.location}
                    register={register}
                    error={errors?.location}
                />

                <InputField
                    label="وقت البداية"
                    name="startTime"
                    defaultValue={data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : ""}
                    register={register}
                    error={errors?.startTime}
                    type="datetime-local"
                    inputProps={{ required: true }}
                />

                <InputField
                    label="وقت النهاية"
                    name="endTime"
                    defaultValue={data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : ""}
                    register={register}
                    error={errors?.endTime}
                    type="datetime-local"
                    inputProps={{ required: true }}
                />

                {timeError && (
                    <div className="w-full">
                        <p className="text-red-500 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                            ⚠️ {timeError}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">نوع الحدث</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("eventType")}
                        defaultValue={data?.eventType || "ACADEMIC"}
                    >
                        <option value="ACADEMIC">أكاديمي</option>
                        <option value="SOCIAL">اجتماعي</option>
                        <option value="CULTURAL">ثقافي</option>
                        <option value="SPORTS">رياضي</option>
                        <option value="OTHER">أخرى</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">الأولوية</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("priority")}
                        defaultValue={data?.priority || "MEDIUM"}
                    >
                        <option value="LOW">منخفضة</option>
                        <option value="MEDIUM">متوسطة</option>
                        <option value="HIGH">عالية</option>
                        <option value="URGENT">عاجلة</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-1/4">
                    <input
                        type="checkbox"
                        {...register("isAllDay")}
                        defaultChecked={data?.isAllDay || false}
                        className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">حدث لليوم كامل</label>
                </div>

                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={undefined}
                        hidden
                    />
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !!timeError}
                className="bg-blue-400 text-white p-2 rounded-md disabled:bg-gray-400"
            >
                {isSubmitting
                    ? "جاري الحفظ..."
                    : (type === "create" ? "إنشاء الحدث" : "تحديث الحدث")
                }
            </button>
        </form>
    );
};

export default EventForm;
