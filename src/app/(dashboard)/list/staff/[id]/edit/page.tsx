"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { 
  Users, 
  ArrowRight, 
  Save,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface StaffMember {
  id: string;
  fullName: string;
  nationalId: string;
  birthday: string;
  phone1: string;
  address?: string;
  academicQualification?: string;
  appointmentDate?: string;
  serviceStartDate?: string;
  maritalStatus?: string;
  educationalInstitution?: string;
  majorSpecialization?: string;
  graduationYear?: string;
  createdAt: string;
}

const EditStaffPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const staffId = params.id as string;
  
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    birthday: "",
    phone1: "",
    address: "",
    academicQualification: "",
    appointmentDate: "",
    serviceStartDate: "",
    maritalStatus: "",
    educationalInstitution: "",
    majorSpecialization: "",
    graduationYear: ""
  });

  useEffect(() => {
    if (isLoaded && user && staffId) {
      loadStaffData();
    }
  }, [isLoaded, user, staffId]);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/staff/${staffId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('الموظف غير موجود');
        }
        throw new Error('فشل في جلب بيانات الموظف');
      }
      
      const data = await response.json();
      setStaff(data.staff);
      
      // تعبئة النموذج بالبيانات الحالية
      setFormData({
        fullName: data.staff.fullName || "",
        nationalId: data.staff.nationalId || "",
        birthday: data.staff.birthday ? new Date(data.staff.birthday).toISOString().split('T')[0] : "",
        phone1: data.staff.phone1 || "",
        address: data.staff.address || "",
        academicQualification: data.staff.academicQualification || "",
        appointmentDate: data.staff.appointmentDate ? new Date(data.staff.appointmentDate).toISOString().split('T')[0] : "",
        serviceStartDate: data.staff.serviceStartDate ? new Date(data.staff.serviceStartDate).toISOString().split('T')[0] : "",
        maritalStatus: data.staff.maritalStatus || "",
        educationalInstitution: data.staff.educationalInstitution || "",
        majorSpecialization: data.staff.majorSpecialization || "",
        graduationYear: data.staff.graduationYear || ""
      });
    } catch (error) {
      console.error('خطأ في تحميل بيانات الموظف:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ في تحميل بيانات الموظف');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحديث بيانات الموظف');
      }

      setSuccess('تم تحديث بيانات الموظف بنجاح');
      
      // إعادة تحميل البيانات
      await loadStaffData();
      
      // العودة لقائمة الموظفين بعد ثانيتين
      setTimeout(() => {
        router.push('/list/staff');
      }, 2000);
      
    } catch (error) {
      console.error('خطأ في تحديث بيانات الموظف:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ في تحديث بيانات الموظف');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lamaYellow border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات الموظف...</p>
        </div>
      </div>
    );
  }

  if (error && !staff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">حدث خطأ</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.push('/list/staff')}
            className="bg-lamaYellow text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            العودة لقائمة الموظفين
          </button>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">الموظف غير موجود</h3>
          <button
            onClick={() => router.push('/list/staff')}
            className="bg-lamaYellow text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            العودة لقائمة الموظفين
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push(`/list/staff/${staffId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="w-5 h-5 ml-2 rotate-180" />
                العودة لتفاصيل الموظف
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-lamaYellow to-orange-500 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تعديل بيانات الموظف</h1>
                <p className="text-sm text-gray-500">{staff.fullName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mr-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرقم الوطني <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الميلاد <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة الاجتماعية
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                >
                  <option value="">اختر الحالة الاجتماعية</option>
                  <option value="SINGLE">أعزب</option>
                  <option value="MARRIED">متزوج</option>
                  <option value="DIVORCED">مطلق</option>
                  <option value="WIDOWED">أرمل</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات الاتصال</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المؤهل العلمي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المؤهل العلمي</label>
                <input
                  type="text"
                  name="academicQualification"
                  value={formData.academicQualification}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المؤسسة التعليمية</label>
                <input
                  type="text"
                  name="educationalInstitution"
                  value={formData.educationalInstitution}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التخصص الرئيسي</label>
                <input
                  type="text"
                  name="majorSpecialization"
                  value={formData.majorSpecialization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">سنة التخرج</label>
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  placeholder="مثال: 2020"
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات التوظيف</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ التعيين</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ بدء الخدمة</label>
                <input
                  type="date"
                  name="serviceStartDate"
                  value={formData.serviceStartDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`/list/staff/${staffId}`)}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 bg-lamaYellow text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffPage;
