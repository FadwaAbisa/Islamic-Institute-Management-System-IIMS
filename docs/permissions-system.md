# نظام إدارة الصلاحيات - Islamic Institute Management System

## نظرة عامة
نظام إدارة الصلاحيات الشامل لنظام إدارة المعهد الإسلامي، يوفر تحكماً دقيقاً في الوصول للموارد والوظائف بناءً على دور المستخدم.

## الأدوار المتاحة

### 1. مدير النظام (Admin)
**الصلاحيات:** جميع الصلاحيات (13 وظيفة)
**المسؤوليات:**
- إدارة كاملة لجميع جوانب النظام
- إدارة المستخدمين والمعلمين والطلاب
- إعدادات النظام والصلاحيات
- التقارير والإحصائيات الشاملة

**المسارات المسموحة:**
- `/admin/*` - لوحة تحكم المدير
- `/list/*` - جميع القوائم
- `/grades/*` - إدارة الدرجات
- `/settings` - إعدادات النظام

### 2. الموظف الإداري (Staff)
**الصلاحيات:** 7 وظائف إدارية
**المسؤوليات:**
- إدارة الطلاب
- إدارة الحضور
- إدارة الدرجات
- إدارة الواجبات
- إدارة الأحداث
- إدارة التقارير

**المسارات المسموحة:**
- `/staff/*` - لوحة تحكم الموظف
- `/list/students/*` - إدارة الطلاب
- `/list/attendance/*` - إدارة الحضور
- `/grades/*` - إدارة الدرجات
- `/list/assignments/*` - إدارة الواجبات
- `/list/events/*` - إدارة الأحداث

**المسارات المقيدة:**
- `/admin/*` - لوحة تحكم المدير
- `/list/teachers/*` - إدارة المعلمين
- `/list/subjects/*` - إدارة المواد
- `/list/classes/*` - إدارة الفصول
- `/list/lessons/*` - إدارة الدروس

### 3. المعلم (Teacher)
**الصلاحيات:** 6 وظائف تعليمية
**المسؤوليات:**
- إدارة الحضور
- إدارة الدرجات
- إدارة الواجبات
- إدارة الأحداث
- عرض التقارير

**المسارات المسموحة:**
- `/teacher/*` - لوحة تحكم المعلم
- `/list/attendance/*` - إدارة الحضور
- `/grades/*` - إدارة الدرجات
- `/list/assignments/*` - إدارة الواجبات
- `/list/events/*` - إدارة الأحداث
- `/list/announcements/*` - عرض الإعلانات

**المسارات المقيدة:**
- `/admin/*` - لوحة تحكم المدير
- `/staff/*` - لوحة تحكم الموظف
- `/list/teachers/*` - إدارة المعلمين
- `/list/students/*` - إدارة الطلاب
- `/list/parents/*` - إدارة أولياء الأمور
- `/list/subjects/*` - إدارة المواد
- `/list/classes/*` - إدارة الفصول
- `/list/lessons/*` - إدارة الدروس

### 4. الطالب (Student)
**الصلاحيات:** 5 وظائف محدودة
**المسؤوليات:**
- عرض الحضور
- عرض الدرجات
- عرض الواجبات
- عرض الأحداث
- عرض الإعلانات

**المسارات المسموحة:**
- `/student/*` - لوحة تحكم الطالب
- `/list/attendance` - عرض الحضور
- `/grades` - عرض الدرجات
- `/list/assignments` - عرض الواجبات
- `/list/events` - عرض الأحداث
- `/list/announcements` - عرض الإعلانات

**المسارات المقيدة:**
- `/admin/*` - لوحة تحكم المدير
- `/staff/*` - لوحة تحكم الموظف
- `/teacher/*` - لوحة تحكم المعلم
- `/list/teachers/*` - إدارة المعلمين
- `/list/students/*` - إدارة الطلاب
- `/list/parents/*` - إدارة أولياء الأمور
- `/list/subjects/*` - إدارة المواد
- `/list/classes/*` - إدارة الفصول
- `/list/lessons/*` - إدارة الدروس
- `/list/exams/*` - إدارة الامتحانات

### 5. ولي الأمر (Parent)
**الصلاحيات:** 5 وظائف محدودة
**المسؤوليات:**
- عرض حضور الأبناء
- عرض درجات الأبناء
- عرض واجبات الأبناء
- عرض الأحداث المدرسية
- عرض الإعلانات

**المسارات المسموحة:**
- `/parent/*` - لوحة تحكم ولي الأمر
- `/list/attendance` - عرض الحضور
- `/grades` - عرض الدرجات
- `/list/assignments` - عرض الواجبات
- `/list/events` - عرض الأحداث
- `/list/announcements` - عرض الإعلانات

**المسارات المقيدة:**
- `/admin/*` - لوحة تحكم المدير
- `/staff/*` - لوحة تحكم الموظف
- `/teacher/*` - لوحة تحكم المعلم
- `/student/*` - لوحة تحكم الطالب
- جميع مسارات الإدارة

## الصلاحيات المتاحة

### الصلاحيات الأساسية
- `login` - تسجيل دخول
- `dashboard_access` - الوصول للوحة التحكم

### إدارة المستخدمين
- `manage_students` - إدارة الطلاب
- `manage_teachers` - إدارة المعلمين
- `manage_parents` - إدارة أولياء الأمور
- `manage_staff` - إدارة الموظفين

### إدارة الأكاديمية
- `manage_subjects` - إدارة المواد الدراسية
- `manage_classes` - إدارة الفصول
- `manage_lessons` - إدارة الدروس

### إدارة الحضور
- `manage_attendance` - إدارة الحضور
- `view_attendance` - عرض الحضور

### إدارة الدرجات
- `manage_grades` - إدارة الدرجات
- `view_grades` - عرض الدرجات

### إدارة الواجبات
- `manage_assignments` - إدارة الواجبات
- `view_assignments` - عرض الواجبات

### إدارة الامتحانات
- `manage_exams` - إدارة الامتحانات
- `view_exams` - عرض الامتحانات

### إدارة الأحداث
- `manage_events` - إدارة الأحداث
- `view_events` - عرض الأحداث

### إدارة الإعلانات
- `manage_announcements` - إدارة الإعلانات
- `view_announcements` - عرض الإعلانات

### التقارير والإحصائيات
- `manage_reports` - إدارة التقارير
- `view_reports` - عرض التقارير

### إدارة النظام
- `system_settings` - إعدادات النظام
- `user_management` - إدارة المستخدمين

## كيفية الاستخدام

### 1. في المكونات
```tsx
import { PermissionGuard, RoleGuard } from '@/components/PermissionGuard';

// التحقق من الصلاحية
<PermissionGuard requiredPermission="manage_students">
  <button>إضافة طالب</button>
</PermissionGuard>

// التحقق من الدور
<RoleGuard allowedRoles={['admin', 'staff']}>
  <div>محتوى للمدير والموظف فقط</div>
</RoleGuard>
```

### 2. في Hooks
```tsx
import { usePermission, useRole } from '@/components/PermissionGuard';

const MyComponent = () => {
  const { hasPermission, userRole } = usePermission('manage_students');
  const { hasRole } = useRole(['admin', 'staff']);

  if (hasPermission) {
    return <div>يمكنك إدارة الطلاب</div>;
  }

  return <div>لا تملك صلاحية إدارة الطلاب</div>;
};
```

### 3. في API Routes
```tsx
import { protectApiRoute } from '@/lib/routeGuard';

export async function POST(request: NextRequest) {
  const guardResult = await protectApiRoute(request, {
    allowedRoles: ['admin', 'staff']
  });

  if (guardResult) {
    return guardResult; // إعادة توجيه أو خطأ
  }

  // الكود هنا يعمل فقط للمستخدمين المصرح لهم
}
```

### 4. في Pages
```tsx
import { protectPageRoute } from '@/lib/routeGuard';

export async function GET(request: NextRequest) {
  const guardResult = await protectPageRoute(request, {
    allowedRoles: ['admin']
  });

  if (guardResult) {
    return guardResult; // إعادة توجيه
  }

  // عرض الصفحة
}
```

## إضافة صلاحيات جديدة

### 1. إضافة صلاحية جديدة
```tsx
// في src/lib/permissions.ts
export const ALL_PERMISSIONS: Permission[] = [
  // ... الصلاحيات الموجودة
  {
    id: 'new_permission',
    name: 'New Permission',
    description: 'Description of new permission',
    arabicName: 'صلاحية جديدة',
    arabicDescription: 'وصف الصلاحية الجديدة'
  }
];
```

### 2. إضافة الصلاحية للأدوار
```tsx
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    // ... باقي الإعدادات
    permissions: ALL_PERMISSIONS.filter(p => [
      // ... الصلاحيات الموجودة
      'new_permission'
    ].includes(p.id))
  }
];
```

### 3. إضافة المسارات المسموحة
```tsx
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    // ... باقي الإعدادات
    allowedRoutes: [
      // ... المسارات الموجودة
      '/new-route'
    ]
  }
];
```

## الأمان

### 1. حماية المسارات
- جميع المسارات محمية تلقائياً
- التحقق من الصلاحيات في كل طلب
- إعادة توجيه تلقائية للمستخدمين غير المصرح لهم

### 2. حماية API
- جميع نقاط النهاية محمية
- التحقق من الصلاحيات قبل تنفيذ العمليات
- رسائل خطأ واضحة للمستخدمين

### 3. حماية المكونات
- عرض/إخفاء العناصر بناءً على الصلاحيات
- منع الوصول للمحتوى المقيد
- رسائل خطأ مناسبة

## المراقبة والتتبع

### 1. سجلات الوصول
- تسجيل جميع محاولات الوصول
- تسجيل العمليات المرفوضة
- تتبع استخدام الصلاحيات

### 2. التقارير
- تقارير استخدام الصلاحيات
- تقارير محاولات الوصول المرفوضة
- إحصائيات الأدوار والصلاحيات

## الصيانة والتطوير

### 1. تحديث الصلاحيات
- إضافة صلاحيات جديدة
- تعديل الصلاحيات الموجودة
- إزالة الصلاحيات غير المستخدمة

### 2. تحديث الأدوار
- إضافة أدوار جديدة
- تعديل صلاحيات الأدوار
- إعادة تنظيم الهيكل

### 3. اختبار النظام
- اختبار الصلاحيات
- اختبار حماية المسارات
- اختبار واجهة المستخدم

## الدعم والمساعدة

للمساعدة في استخدام نظام الصلاحيات أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير.

---

**ملاحظة:** هذا النظام مصمم ليكون مرناً وقابلاً للتوسع. يمكن تخصيصه بسهولة لتلبية احتياجات معينة أو إضافة ميزات جديدة.

