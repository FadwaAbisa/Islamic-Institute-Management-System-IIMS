"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { 
  Users, 
  ArrowRight, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  GraduationCap,
  Building,
  User,
  Clock,
  Edit,
  Trash2,
  AlertCircle
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

const StaffDetailPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const staffId = params.id as string;
  
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error) {
      console.error('خطأ في تحميل بيانات الموظف:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ في تحميل بيانات الموظف');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في حذف الموظف');
      }

      alert('تم حذف الموظف بنجاح');
      router.push('/list/staff');
    } catch (error) {
      console.error('خطأ في حذف الموظف:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ في حذف الموظف');
    }
  };

  const getMaritalStatusText = (status: string) => {
    switch (status) {
      case "SINGLE": return "أعزب";
      case "MARRIED": return "متزوج";
      case "DIVORCED": return "مطلق";
      case "WIDOWED": return "أرمل";
      default: return "غير محدد";
    }
  };

  const getMaritalStatusColor = (status: string) => {
    switch (status) {
      case "SINGLE": return "bg-blue-100 text-blue-800";
      case "MARRIED": return "bg-green-100 text-green-800";
      case "DIVORCED": return "bg-red-100 text-red-800";
      case "WIDOWED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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

  if (error) {
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
                onClick={() => router.push('/list/staff')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="w-5 h-5 ml-2 rotate-180" />
                العودة لقائمة الموظفين
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-lamaYellow to-orange-500 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تفاصيل الموظف</h1>
                <p className="text-sm text-gray-500">{staff.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/list/staff/${staffId}/edit`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" />
                تعديل
              </button>
              <button
                onClick={handleDeleteStaff}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-lamaYellow" />
            المعلومات الأساسية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <p className="text-gray-900 font-medium">{staff.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الرقم الوطني</label>
              <p className="text-gray-900">{staff.nationalId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
              <p className="text-gray-900">{new Date(staff.birthday).toLocaleDateString('ar-SA')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحالة الاجتماعية</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaritalStatusColor(staff.maritalStatus || '')}`}>
                {getMaritalStatusText(staff.maritalStatus || '')}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-lamaYellow" />
            معلومات الاتصال
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <p className="text-gray-900">{staff.phone1}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
              <p className="text-gray-900">{staff.address || 'غير محدد'}</p>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-lamaYellow" />
            المؤهل العلمي
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المؤهل العلمي</label>
              <p className="text-gray-900">{staff.academicQualification || 'غير محدد'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المؤسسة التعليمية</label>
              <p className="text-gray-900">{staff.educationalInstitution || 'غير محدد'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التخصص الرئيسي</label>
              <p className="text-gray-900">{staff.majorSpecialization || 'غير محدد'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">سنة التخرج</label>
              <p className="text-gray-900">{staff.graduationYear || 'غير محدد'}</p>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-lamaYellow" />
            معلومات التوظيف
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ التعيين</label>
              <p className="text-gray-900">{staff.appointmentDate ? new Date(staff.appointmentDate).toLocaleDateString('ar-SA') : 'غير محدد'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ بدء الخدمة</label>
              <p className="text-gray-900">{staff.serviceStartDate ? new Date(staff.serviceStartDate).toLocaleDateString('ar-SA') : 'غير محدد'}</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-lamaYellow" />
            معلومات النظام
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الإنشاء</label>
              <p className="text-gray-900">{new Date(staff.createdAt).toLocaleDateString('ar-SA')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">معرف الموظف</label>
              <p className="text-gray-900 font-mono text-sm">{staff.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage;
