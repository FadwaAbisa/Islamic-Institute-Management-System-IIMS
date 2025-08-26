
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Widget } from "@uploadcare/react-widget";
import Image from "next/image";

const TeacherForm = ({
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
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const [img, setImg] = useState<any>(null);

  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    { success: false, error: false }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, img: img?.cdnUrl });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`تم ${type === "create" ? "إنشاء" : "تحديث"} المعلمة بنجاح!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-right">
        {type === "create" ? "إضافة معلمة جديدة" : "تحديث بيانات المعلمة"}
      </h1>

      {/* البيانات الأساسية */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-right border-b pb-2">البيانات الأساسية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="الاسم الكامل *"
            name="fullName"
            defaultValue={data?.fullName}
            register={register}
            error={errors?.fullName}
          />

          <InputField
            label="الرقم الوطني/الجواز *"
            name="nationalId"
            defaultValue={data?.nationalId}
            register={register}
            error={errors?.nationalId}
          />

          <InputField
            label="تاريخ الميلاد *"
            name="birthday"
            type="date"
            defaultValue={data?.birthday?.toISOString().split("T")[0]}
            register={register}
            error={errors?.birthday}
          />

          <InputField
            label="الجنسية"
            name="nationality"
            defaultValue={data?.nationality}
            register={register}
            error={errors?.nationality}
          />
        </div>
      </div>

      {/* البيانات الشخصية */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-right border-b pb-2">البيانات الشخصية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-right">الحالة الاجتماعية</label>
            <select
              {...register("maritalStatus")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={data?.maritalStatus}
            >
              <option value="">اختر الحالة الاجتماعية</option>
              <option value="SINGLE">أعزب/عزباء</option>
              <option value="MARRIED">متزوج/ة</option>
              <option value="DIVORCED">مطلق/ة</option>
              <option value="WIDOWED">أرمل/ة</option>
            </select>
          </div>

          <InputField
            label="عنوان السكن"
            name="address"
            defaultValue={data?.address}
            register={register}
            error={errors?.address}
          />

          <InputField
            label="هاتف أول *"
            name="phone1"
            defaultValue={data?.phone1}
            register={register}
            error={errors?.phone1}
          />

          <InputField
            label="هاتف ثاني"
            name="phone2"
            defaultValue={data?.phone2}
            register={register}
            error={errors?.phone2}
          />
        </div>
      </div>

      {/* جهة الاتصال للطوارئ */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-right border-b pb-2">جهة الاتصال للطوارئ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="اسم جهة الاتصال"
            name="emergencyContactName"
            defaultValue={data?.emergencyContactName}
            register={register}
            error={errors?.emergencyContactName}
          />

          <InputField
            label="صلة القرابة"
            name="emergencyContactRelation"
            defaultValue={data?.emergencyContactRelation}
            register={register}
            error={errors?.emergencyContactRelation}
          />
        </div>
      </div>

      {/* الحالة الوظيفية */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-right border-b pb-2">الحالة الوظيفية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-right">الحالة</label>
            <select
              {...register("employmentStatus")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={data?.employmentStatus}
            >
              <option value="">اختر الحالة</option>
              <option value="APPOINTMENT">تعيين</option>
              <option value="CONTRACT">عقد</option>
              <option value="SECONDMENT">ندب</option>
            </select>
          </div>

          <InputField
            label="تاريخ التعيين"
            name="appointmentDate"
            type="date"
            defaultValue={data?.appointmentDate?.toISOString().split("T")[0]}
            register={register}
            error={errors?.appointmentDate}
          />

          <InputField
            label="تاريخ مباشرة العمل"
            name="serviceStartDate"
            type="date"
            defaultValue={data?.serviceStartDate?.toISOString().split("T")[0]}
            register={register}
            error={errors?.serviceStartDate}
          />

          <InputField
            label="تاريخ نهاية العقد"
            name="contractEndDate"
            type="date"
            defaultValue={data?.contractEndDate?.toISOString().split("T")[0]}
            register={register}
            error={errors?.contractEndDate}
          />
        </div>
      </div>

      {/* المؤهلات العلمية */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-right border-b pb-2">المؤهلات العلمية</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="المؤهل العلمي"
            name="academicQualification"
            defaultValue={data?.academicQualification}
            register={register}
            error={errors?.academicQualification}
          />

          <InputField
            label="المؤسسة التعليمية"
            name="educationalInstitution"
            defaultValue={data?.educationalInstitution}
            register={register}
            error={errors?.educationalInstitution}
          />

          <InputField
            label="التخصص الرئيسي"
            name="majorSpecialization"
            defaultValue={data?.majorSpecialization}
            register={register}
            error={errors?.majorSpecialization}
          />

          <InputField
            label="التخصص الفرعي"
            name="minorSpecialization"
            defaultValue={data?.minorSpecialization}
            register={register}
            error={errors?.minorSpecialization}
          />

          <InputField
            label="سنة التخرج"
            name="graduationYear"
            defaultValue={data?.graduationYear}
            register={register}
            error={errors?.graduationYear}
          />
        </div>
      </div>

      {/* رفع الصورة */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-right border-b pb-2">الصورة الشخصية</h2>

        <div className="flex items-center gap-4">
          {img?.cdnUrl && (
            <div className="relative w-20 h-20">
              <Image
                src={img.cdnUrl}
                alt="صورة المعلمة"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}

          <Widget
            publicKey="your-uploadcare-public-key"
            onFileSelect={(fileInfo) => setImg(fileInfo)}
          />
        </div>
      </div>

      {/* أزرار الإرسال */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          إلغاء
        </button>

        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {type === "create" ? "إضافة المعلمة" : "تحديث البيانات"}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
