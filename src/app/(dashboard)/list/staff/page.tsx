"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
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
  AlertCircle,
  Download,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

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
      case "SINGLE": return "bg-blue-100 text-blue-800 border-blue-200";
      case "MARRIED": return "bg-green-100 text-green-800 border-green-200";
      case "DIVORCED": return "bg-red-100 text-red-800 border-red-200";
      case "WIDOWED": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight via-lamaPurple to-lamaSkyLight" dir="rtl">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-lamaSky via-lamaYellow to-lamaYellowLight">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative container mx-auto px-6 py-12">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 font-tajawal">قائمة الموظفين الإداريين</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              إدارة شاملة لجميع الموظفين الإداريين في المعهد مع إمكانية البحث والتصفية والتعديل
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-lamaPurpleLight mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8 relative z-10">
        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight border-b border-lamaPurple/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-lamaYellow font-tajawal">إدارة الموظفين الإداريين</CardTitle>
                  <p className="text-slate-600 text-sm mt-1">عرض وإدارة جميع الموظفين الإداريين المسجلين</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير البيانات
                </Button>
                <Link href="/list/staff/add">
                  <Button className="bg-gradient-to-r from-lamaYellow to-lamaYellowLight hover:from-lamaYellowLight hover:to-lamaYellow text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 border-0">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة موظف إداري جديد
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search & Filters Section */}
            <div className="mb-8 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-lamaYellow" />
                </div>
                <Input
                  placeholder="البحث عن موظف إداري بالاسم أو رقم الهوية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-12 py-4 text-lg border-2 border-lamaPurple rounded-xl focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Filters */}
              <div className="bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight p-6 rounded-2xl border border-lamaPurple/50">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-lamaYellow" />
                  <h3 className="text-lg font-semibold text-slate-800">تصفية النتائج</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الحالة الوظيفية</label>
                    <select
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="hasAppointment">لديهم تاريخ تعيين</option>
                      <option value="noAppointment">ليس لديهم تاريخ تعيين</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الحالة الاجتماعية</label>
                    <select
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      defaultValue="الكل"
                    >
                      <option value="الكل">جميع الحالات</option>
                      <option value="SINGLE">أعزب</option>
                      <option value="MARRIED">متزوج</option>
                      <option value="DIVORCED">مطلق</option>
                      <option value="WIDOWED">أرمل</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">عدد النتائج</label>
                    <select
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      defaultValue="20"
                    >
                      <option value="10">10 نتائج</option>
                      <option value="20">20 نتيجة</option>
                      <option value="50">50 نتيجة</option>
                      <option value="100">100 نتيجة</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ترتيب النتائج</label>
                    <select
                      className="w-full border-2 border-lamaPurple rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-lamaSky focus:ring-4 focus:ring-lamaSkyLight transition-all duration-300 bg-white/80"
                      defaultValue="name"
                    >
                      <option value="name">حسب الاسم</option>
                      <option value="date">حسب تاريخ التعيين</option>
                      <option value="status">حسب الحالة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-lamaSky to-lamaYellow p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm">إجمالي الموظفين</p>
                    <p className="text-3xl font-bold">{filteredStaff.length}</p>
                  </div>
                  <Users className="w-12 h-12 text-white/80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm">لديهم تعيين</p>
                    <p className="text-3xl font-bold">{filteredStaff.filter(s => s.appointmentDate).length}</p>
                  </div>
                  <GraduationCap className="w-12 h-12 text-emerald-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-lamaYellow to-lamaYellowLight p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm">بدون تعيين</p>
                    <p className="text-3xl font-bold">{filteredStaff.filter(s => !s.appointmentDate).length}</p>
                  </div>
                  <Users className="w-12 h-12 text-white/80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-lamaSkyLight to-lamaPurple p-6 rounded-2xl text-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">موظفين جدد</p>
                    <p className="text-3xl font-bold">{filteredStaff.filter(s => {
                      const createdAt = new Date(s.createdAt);
                      const now = new Date();
                      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 30;
                    }).length}</p>
                  </div>
                  <Users className="w-12 h-12 text-lamaYellow" />
                </div>
              </div>
            </div>

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

            {/* Staff Table */}
            <div className="bg-white rounded-2xl border border-lamaPurple/50 overflow-hidden shadow-lg">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 border-4 border-lamaYellow border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
                </div>
              ) : filteredStaff.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <div className="w-24 h-24 bg-lamaPurpleLight rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-lamaYellow" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">لا يوجد موظفين إداريين حالياً</h3>
                  <p className="text-slate-500 mb-6">ابدأ بإضافة موظف إداري جديد لبناء فريق إداري قوي</p>
                  <Link href="/list/staff/add">
                    <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white px-6 py-3 rounded-xl">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة أول موظف إداري
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight border-0">
                        <TableHead className="text-right py-4 px-6 font-bold text-slate-800">الموظف</TableHead>
                        <TableHead className="text-right py-4 px-6 font-bold text-slate-800">رقم الهوية</TableHead>
                        <TableHead className="text-right py-4 px-6 font-bold text-slate-800">الحالة الوظيفية</TableHead>
                        <TableHead className="text-right py-4 px-6 font-bold text-slate-800">المؤهل العلمي</TableHead>
                        <TableHead className="text-right py-4 px-6 font-bold text-slate-800">الحالة الاجتماعية</TableHead>
                        <TableHead className="text-right py-4 px-6 font-bold text-slate-800">رقم الهاتف</TableHead>
                        <TableHead className="text-right py-4 px-6 font-bold text-slate-800">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((member, index) => (
                        <TableRow
                          key={member.id}
                          className={`hover:bg-gradient-to-r hover:from-lamaPurpleLight hover:to-lamaSkyLight transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-lamaPurpleLight/30'
                            }`}
                        >
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {member.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{member.fullName}</p>
                                <p className="text-xs text-slate-500">موظف إداري</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <code className="bg-lamaPurpleLight text-slate-700 px-3 py-1 rounded-lg text-sm font-mono">
                              {member.nationalId}
                            </code>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge className={`${member.appointmentDate ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-lamaPurpleLight text-slate-700 border-lamaPurple'} px-3 py-1 rounded-full text-sm font-medium border-2`}>
                              {member.appointmentDate ? 'لديه تعيين' : 'بدون تعيين'}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex flex-wrap gap-2">
                              {member.academicQualification ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-lamaSkyLight text-lamaYellow border-lamaSky px-2 py-1 rounded-lg"
                                >
                                  {member.academicQualification}
                                </Badge>
                              ) : (
                                <span className="text-gray-400 text-sm">غير محدد</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge className={`${getMaritalStatusColor(member.maritalStatus || '')} px-3 py-1 rounded-full text-sm font-medium border-2`}>
                              {getMaritalStatusText(member.maritalStatus || '')}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-600">{member.phone1}</span>
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                متاح
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffListPage;
