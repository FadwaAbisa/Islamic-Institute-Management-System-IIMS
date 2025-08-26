
# نظام إدارة المعهد الإسلامي (IIMS)

## نظرة عامة
نظام إدارة شامل للمعهد الإسلامي مبني باستخدام Next.js 14، Prisma، و Clerk للمصادقة. يوفر النظام إدارة كاملة للطلاب والمعلمين والفصول الدراسية مع نظام صلاحيات متقدم.

## الميزات الرئيسية

### 🎯 نظام إدارة الصلاحيات المتقدم
- **5 أدوار مختلفة** مع صلاحيات محددة
- **حماية شاملة** للمسارات والواجهات
- **مرونة في التخصيص** وإضافة صلاحيات جديدة

### 👥 إدارة المستخدمين
- إدارة الطلاب والمعلمين وأولياء الأمور
- نظام تسجيل دخول آمن باستخدام Clerk
- ملفات شخصية قابلة للتخصيص

### 📚 إدارة أكاديمية
- إدارة الفصول والمواد الدراسية
- جدولة الدروس والامتحانات
- نظام درجات شامل

### 📊 تقارير وإحصائيات
- تقارير الحضور والغياب
- إحصائيات الأداء الأكاديمي
- لوحات تحكم تفاعلية

## الأدوار والصلاحيات

### 1. مدير النظام (Admin)
- **الصلاحيات:** جميع الصلاحيات (13 وظيفة)
- **المسؤوليات:** إدارة كاملة لجميع جوانب النظام

### 2. الموظف الإداري (Staff)
- **الصلاحيات:** 7 وظائف إدارية
- **المسؤوليات:** إدارة الطلاب، الحضور، الدرجات، الواجبات، الأحداث، التقارير

### 3. المعلم (Teacher)
- **الصلاحيات:** 6 وظائف تعليمية
- **المسؤوليات:** إدارة الحضور، الدرجات، الواجبات، الأحداث، عرض التقارير

### 4. الطالب (Student)
- **الصلاحيات:** 5 وظائف محدودة
- **المسؤوليات:** عرض الحضور، الدرجات، الواجبات، الأحداث، الإعلانات

### 5. ولي الأمر (Parent)
- **الصلاحيات:** 5 وظائف محدودة
- **المسؤوليات:** عرض حضور ودرجات وواجبات الأبناء، الأحداث المدرسية

## التقنيات المستخدمة

### Frontend
- **Next.js 14** - إطار عمل React مع App Router
- **TypeScript** - تطوير آمن ومتقدم
- **Tailwind CSS** - تصميم سريع ومتجاوب
- **Lucide React** - أيقونات جميلة ومرنة

### Backend
- **Prisma** - ORM متقدم لقواعد البيانات
- **PostgreSQL** - قاعدة بيانات قوية وموثوقة
- **Next.js API Routes** - نقاط نهاية RESTful

### المصادقة والأمان
- **Clerk** - نظام مصادقة متقدم
- **Middleware** - حماية المسارات
- **Role-based Access Control** - نظام صلاحيات متقدم

### قاعدة البيانات
- **PostgreSQL** - قاعدة بيانات علائقية قوية
- **Prisma Migrations** - إدارة تلقائية للتغييرات
- **Seeding** - بيانات تجريبية

## التثبيت والتشغيل

### المتطلبات
- Node.js 18+ 
- PostgreSQL 12+
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/Islamic-Institute-Management-System-IIMS.git
cd Islamic-Institute-Management-System-IIMS
```

2. **تثبيت التبعيات**
```bash
npm install
# أو
yarn install
```

3. **إعداد قاعدة البيانات**
```bash
# إنشاء ملف .env.local
cp .env.example .env.local

# تعديل متغيرات البيئة
DATABASE_URL="postgresql://username:password@localhost:5432/iims_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
CLERK_SECRET_KEY="your_clerk_secret"
```

4. **إعداد قاعدة البيانات**
```bash
# إنشاء قاعدة البيانات
npx prisma db push

# تشغيل الهجرات
npx prisma migrate dev

# إضافة بيانات تجريبية
npm run seed
```

5. **تشغيل المشروع**
```bash
npm run dev
# أو
yarn dev
```

6. **فتح المتصفح**
```
http://localhost:3000
```

## هيكل المشروع

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # صفحات لوحة التحكم
│   │   ├── admin/         # لوحة تحكم المدير
│   │   ├── staff/         # لوحة تحكم الموظف
│   │   ├── teacher/       # لوحة تحكم المعلم
│   │   ├── student/       # لوحة تحكم الطالب
│   │   └── parent/        # لوحة تحكم ولي الأمر
│   ├── api/               # نقاط نهاية API
│   └── globals.css        # الأنماط العامة
├── components/             # مكونات React
│   ├── ui/                # مكونات واجهة المستخدم
│   └── forms/             # نماذج الإدخال
├── lib/                    # مكتبات ووظائف مساعدة
│   ├── permissions.ts      # نظام الصلاحيات
│   ├── routeGuard.ts      # حماية المسارات
│   └── prisma.ts          # إعداد Prisma
├── hooks/                  # React Hooks مخصصة
└── types/                  # تعريفات TypeScript
```

## نظام الصلاحيات

### إضافة صلاحية جديدة
```typescript
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

### استخدام الصلاحيات في المكونات
```typescript
import { PermissionGuard } from '@/components/PermissionGuard';

<PermissionGuard requiredPermission="manage_students">
  <button>إضافة طالب</button>
</PermissionGuard>
```

### حماية API Routes
```typescript
import { protectApiRoute } from '@/lib/routeGuard';

export async function POST(request: NextRequest) {
  const guardResult = await protectApiRoute(request, {
    allowedRoles: ['admin', 'staff']
  });

  if (guardResult) {
    return guardResult;
  }

  // الكود هنا يعمل فقط للمستخدمين المصرح لهم
}
```

## المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع جديد للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للتفاصيل.

## الدعم

للمساعدة أو الإبلاغ عن مشاكل:
- افتح Issue جديد
- تواصل مع فريق التطوير
- راجع الوثائق في مجلد `docs/`

## التطوير المستقبلي

### الميزات المخطط لها
- [ ] نظام رسائل داخلي
- [ ] تطبيق جوال
- [ ] نظام إشعارات متقدم
- [ ] تقارير متقدمة
- [ ] نظام حضور بالبصمة
- [ ] تكامل مع أنظمة خارجية

### التحسينات التقنية
- [ ] اختبارات شاملة
- [ ] تحسين الأداء
- [ ] أمان إضافي
- [ ] وثائق API
- [ ] Docker containerization

---

**ملاحظة:** هذا المشروع في مرحلة التطوير النشط. قد تحدث تغييرات كبيرة في الإصدارات المستقبلية.

