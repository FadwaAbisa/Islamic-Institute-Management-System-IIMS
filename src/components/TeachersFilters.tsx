"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function TeachersFilters({
  subjects,
  stages,
}: {
  subjects: string[];
  stages: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const current = {
    subject: params.get("subject") || "",
    stage: params.get("stage") || "",
  };

  const updateParam = (key: string, value: string) => {
    const qs = new URLSearchParams(params.toString());
    if (value) qs.set(key, value);
    else qs.delete(key);
    qs.delete("page");
    router.push(`${window.location.pathname}?${qs.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      <div>
        <Label className="mb-1 block">المادة</Label>
        <Select value={current.subject} onValueChange={(v) => updateParam("subject", v)}>
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="">الكل</SelectItem>
            {subjects.filter(Boolean).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">المرحلة الدراسية</Label>
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
    </div>
  );
}






