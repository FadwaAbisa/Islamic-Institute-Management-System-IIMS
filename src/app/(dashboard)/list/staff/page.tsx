"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

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

const StaffListPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadStaffData();
    }
  }, [isLoaded, user]);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/staff');
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الموظفين');
      }
      
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('خطأ في تحميل بيانات الموظفين:', error);
      setError('حدث خطأ في تحميل بيانات الموظفين');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      setDeleteLoading(staffId);
      setError(null);

      const response = await fetch(`/api/staff/${staffId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في حذف الموظف');
      }

      // إزالة الموظف من القائمة
      setStaff(prevStaff => prevStaff.filter(s => s.id !== staffId));
      
      // إظهار رسالة نجاح
      alert('تم حذف الموظف بنجاح');
    } catch (error) {
      console.error('خطأ في حذف الموظف:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ في حذف الموظف');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nationalId.includes(searchTerm) ||
                         member.phone1.includes(searchTerm);
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "hasAppointment" && member.appointmentDate) ||
                         (filterStatus === "noAppointment" && !member.appointmentDate);
    
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-lamaYellow to-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="mr-4">
                <h1 className="text-2xl font-bold text-gray-900">الموظفين الإداريين</h1>
                <p className="text-sm text-gray-500">إدارة الموظفين الإداريين في المعهد</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/list/staff/add')}
              className="bg-gradient-to-r from-lamaYellow to-orange-500 hover:from-orange-500 hover:to-lamaYellow text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              إضافة موظف جديد
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث بالاسم أو الرقم الوطني أو الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border-2 border-lamaSkyLight rounded-lg focus:ring-2 focus:ring-lamaYellow focus:border-lamaYellow transition-all duration-200"
              >
                <option value="all">جميع الموظفين</option>
                <option value="hasAppointment">لديهم تاريخ تعيين</option>
                <option value="noAppointment">ليس لديهم تاريخ تعيين</option>
              </select>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-lamaYellow border-t-orange-500 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد موظفين</h3>
              <p className="text-gray-500">لم يتم العثور على موظفين يطابقون معايير البحث</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-lamaSkyLight/20 border-b border-lamaSkyLight/30">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      الموظف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      معلومات الاتصال
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      المؤهل العلمي
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      الحالة الاجتماعية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      تاريخ التعيين
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-lamaSkyLight/20">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-lamaSkyLight/10 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-lamaSkyLight/30 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-lamaYellow" />
                          </div>
                          <div className="mr-3">
                            <div className="text-sm font-medium text-gray-900">{member.fullName}</div>
                            <div className="text-sm text-gray-500">الرقم الوطني: {member.nationalId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {member.phone1}
                          </div>
                          {member.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">{member.address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.academicQualification ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-lamaYellow" />
                                {member.academicQualification}
                              </div>
                              {member.educationalInstitution && (
                                <div className="text-xs text-gray-500 mr-6">
                                  {member.educationalInstitution}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">غير محدد</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaritalStatusColor(member.maritalStatus || '')}`}>
                          {getMaritalStatusText(member.maritalStatus || '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.appointmentDate ? new Date(member.appointmentDate).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/list/staff/${member.id}`)}
                            className="text-lamaYellow hover:text-orange-600 p-1 rounded hover:bg-lamaSkyLight/20 transition-colors duration-200"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/list/staff/${member.id}/edit`)}
                            className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            disabled={deleteLoading === member.id}
                            className={`text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors duration-200 ${
                              deleteLoading === member.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title="حذف"
                          >
                            {deleteLoading === member.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredStaff.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border-2 border-lamaSkyLight p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                إجمالي الموظفين: <span className="font-semibold text-gray-900">{filteredStaff.length}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>لديهم تعيين: <span className="font-semibold text-green-600">{filteredStaff.filter(s => s.appointmentDate).length}</span></span>
                <span>بدون تعيين: <span className="font-semibold text-yellow-600">{filteredStaff.filter(s => !s.appointmentDate).length}</span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffListPage;
