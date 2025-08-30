"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Option = { value: string; label: string };

export default function StudentsFilters({
  years,
  stages,
}: {
  years: string[];
  stages: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const current = {
    academicYear: params.get("academicYear") || "",
    stage: params.get("stage") || "",
    gender: params.get("gender") || "",
    status: params.get("status") || "",
  };

  const genderOptions: Option[] = [
    { value: "", label: "الكل" },
    { value: "ذكر", label: "ذكر" },
    { value: "أنثى", label: "أنثى" },
  ];

  const statusOptions: Option[] = [
    { value: "", label: "الكل" },
    { value: "ACTIVE", label: "مستمر" },
    { value: "DROPPED", label: "منقطع" },
    { value: "SUSPENDED", label: "موقوف" },
    { value: "EXPELLED", label: "مطرود" },
    { value: "PAUSED", label: "إيقاف قيد" },
  ];

  const updateParam = (key: string, value: string) => {
    const qs = new URLSearchParams(params.toString());
    if (value) qs.set(key, value);
    else qs.delete(key);
    qs.delete("page"); // إعادة ضبط الصفحة عند تغيير المرشحات
    router.push(`${window.location.pathname}?${qs.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      <div>
        <Label className="mb-1 block">العام الدراسي</Label>
        <Select value={current.academicYear} onValueChange={(v) => updateParam("academicYear", v)}>
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="">الكل</SelectItem>
            {years.filter(Boolean).map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">المرحلة</Label>
        <Select value={current.stage} onValueChange={(v) => updateParam("stage", v)}>
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="">الكل</SelectItem>
            {stages.filter(Boolean).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">الجنس</Label>
        <Select value={current.gender} onValueChange={(v) => updateParam("gender", v)}>
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            {genderOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">الحالة</Label>
        <Select value={current.status} onValueChange={(v) => updateParam("status", v)}>
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            {statusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


