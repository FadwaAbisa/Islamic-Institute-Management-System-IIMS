"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, MapPin, Shield, Edit, Camera, Save, X, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  permissions: string[];
  additionalInfo?: any;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    if (isLoaded && user) {
      loadUserProfile();
    }
  }, [isLoaded, user]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const role = user?.publicMetadata?.role as string;
      
      // بناء الملف الشخصي حسب الدور
      const userProfile: UserProfile = {
        id: user?.id || '',
        fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'مستخدم',
        email: user?.emailAddresses?.[0]?.emailAddress || '',
        phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
        role: role || 'ضيف',
        avatar: user?.imageUrl || '',
        joinDate: new Date(user?.createdAt || Date.now()).toLocaleDateString('ar-SA'),
        lastLogin: new Date().toLocaleDateString('ar-SA'),
        permissions: getRolePermissions(role),
        additionalInfo: await getAdditionalInfo(role, user?.id)
      };

      setProfile(userProfile);
      setEditForm({
        fullName: userProfile.fullName,
        phone: userProfile.phone || '',
        email: userProfile.email
      });
    } catch (error) {
      console.error('خطأ في تحميل الملف الشخصي:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRolePermissions = (role: string): string[] => {
    const permissions: { [key: string]: string[] } = {
      admin: [
        'إدارة النظام بالكامل',
        'إدارة المستخدمين',
        'إدارة الإعدادات',
        'عرض التقارير',
        'إدارة المحتوى'
      ],
      staff: [
        'إدارة الطلاب',
        'إدارة المعلمين',
        'إدارة الحضور',
        'عرض التقارير',
        'إدارة الإعلانات'
      ],
      teacher: [
        'إدارة الفصول',
        'تسجيل الحضور',
        'إدخال الدرجات',
        'إرسال الرسائل',
        'عرض التقارير'
      ],
      student: [
        'عرض الجدول الدراسي',
        'عرض الدرجات',
        'عرض الحضور',
        'إرسال الرسائل',
        'عرض الإعلانات'
      ],
      parent: [
        'عرض درجات الطالب',
        'عرض الحضور',
        'إرسال الرسائل',
        'عرض الإعلانات',
        'متابعة التقدم'
      ]
    };

    return permissions[role] || ['صلاحيات محدودة'];
  };

  const getAdditionalInfo = async (role: string, userId: string) => {
    try {
      // يمكن إضافة طلبات API لجلب معلومات إضافية حسب الدور
      switch (role) {
        case 'student':
          return { studyLevel: 'السنة الأولى', specialization: 'الدراسات الإسلامية' };
        case 'teacher':
          return { subjects: ['الفقه', 'التفسير'], experience: '5 سنوات' };
        case 'staff':
          return { department: 'الشؤون الإدارية', position: 'موظف إداري' };
        default:
          return {};
      }
    } catch (error) {
      console.error('خطأ في جلب المعلومات الإضافية:', error);
      return {};
    }
  };

  const handleSave = async () => {
    try {
      // هنا يمكن إضافة منطق حفظ التغييرات
      setIsEditing(false);
      // تحديث الملف الشخصي
      if (profile) {
        setProfile({
          ...profile,
          ...editForm
        });
      }
    } catch (error) {
      console.error('خطأ في حفظ التغييرات:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // إعادة تعيين النموذج
    if (profile) {
      setEditForm({
        fullName: profile.fullName,
        phone: profile.phone || '',
        email: profile.email
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lama-sky mx-auto mb-4"></div>
          <p className="text-lama-yellow text-lg">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">لم يتم العثور على الملف الشخصي</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight to-lamaPurple p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lama-yellow mb-2">الملف الشخصي</h1>
          <p className="text-lama-sky text-lg">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* البطاقة الرئيسية */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-lama-sky/20">
              {/* صورة الملف الشخصي */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-lama-sky shadow-lg">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt="صورة الملف الشخصي"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-lama-sky to-lama-yellow flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-lama-sky rounded-full flex items-center justify-center shadow-lg hover:bg-lama-yellow transition-colors duration-300">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mt-4">{profile.fullName}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-full text-sm font-medium mt-2">
                  <Shield className="w-4 h-4" />
                  {profile.role === 'admin' ? 'مدير النظام' :
                   profile.role === 'staff' ? 'موظف إداري' :
                   profile.role === 'teacher' ? 'معلم' :
                   profile.role === 'student' ? 'طالب' :
                   profile.role === 'parent' ? 'ولي أمر' : 'مستخدم'}
                </div>
              </div>

              {/* معلومات أساسية */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-lama-sky" />
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium text-gray-800">{profile.email}</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-lama-sky" />
                    <div>
                      <p className="text-sm text-gray-500">رقم الهاتف</p>
                      <p className="font-medium text-gray-800">{profile.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-lama-sky" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                    <p className="font-medium text-gray-800">{profile.joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-lama-sky" />
                  <div>
                    <p className="text-sm text-gray-500">آخر تسجيل دخول</p>
                    <p className="font-medium text-gray-800">{profile.lastLogin}</p>
                  </div>
                </div>
              </div>

              {/* زر التعديل */}
              <div className="mt-6">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Edit className="w-5 h-5" />
                    تعديل الملف الشخصي
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all duration-300"
                    >
                      <Save className="w-5 h-5" />
                      حفظ
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              {/* خط فاصل */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-lama-sky to-transparent my-4 opacity-50"></div>

              {/* زر تسجيل الخروج */}
              <Link
                href="/logout"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-pink-700"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </Link>
            </div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            {/* معلومات إضافية حسب الدور */}
            {profile.additionalInfo && Object.keys(profile.additionalInfo).length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-lama-sky/20">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-lama-sky" />
                  معلومات إضافية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profile.additionalInfo).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 capitalize">{key}</p>
                      <p className="font-medium text-gray-800">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الصلاحيات */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-lama-sky/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-lama-sky" />
                الصلاحيات والصلاحيات
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-800 font-medium">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-lama-sky/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-lama-sky" />
                إحصائيات سريعة
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-blue-800">رسائل جديدة</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-green-800">إشعارات</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-800">مهام</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-orange-800">أنشطة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
