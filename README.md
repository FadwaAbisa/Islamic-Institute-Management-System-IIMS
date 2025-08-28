# نظام إدارة المعهد الإسلامي (IIMS)

## نظرة عامة
نظام إدارة شامل للمعهد الإسلامي مبني باستخدام Next.js و Prisma، يوفر إدارة للطلاب والمعلمين والموظفين والدرجات والحضور.

## المميزات الرئيسية
- 🎓 إدارة الطلاب والمعلمين والموظفين
- 📊 نظام الدرجات والتقييم
- ✅ نظام الحضور والغياب
- 📅 إدارة الجداول الدراسية
- 💰 إدارة الشؤون المالية
- 📢 نظام الإعلانات
- 🔐 نظام الصلاحيات والأمان

## التقنيات المستخدمة
- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite مع Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Package Manager**: pnpm

## متطلبات النظام
- Node.js 18+
- pnpm
- Git

## التثبيت والتشغيل

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd Islamic-Institute-Management-System-IIMS
```

### 2. تثبيت التبعيات
```bash
pnpm install
```

### 3. إعداد قاعدة البيانات
```bash
# نسخ ملف البيئة
cp .env.example .env

# تشغيل قاعدة البيانات
pnpm prisma db push

# تشغيل البذور (اختياري)
pnpm prisma db seed
```

### 4. تشغيل المشروع
```bash
# وضع التطوير
pnpm dev

# بناء الإنتاج
pnpm build
pnpm start
```

## هيكل المشروع
```
src/
├── app/                 # صفحات Next.js
├── components/          # المكونات القابلة لإعادة الاستخدام
├── contexts/           # سياقات React
├── hooks/              # Hooks مخصصة
├── lib/                # مكتبات مساعدة
└── types/              # تعريفات TypeScript

prisma/
├── schema.prisma       # مخطط قاعدة البيانات
└── migrations/         # ملفات الترحيل
```

## المساهمة
نرحب بالمساهمات! يرجى:
1. عمل Fork للمشروع
2. إنشاء فرع للميزة الجديدة
3. عمل Commit للتغييرات
4. عمل Push للفرع
5. إنشاء Pull Request

## الترخيص
هذا المشروع مرخص تحت رخصة MIT.

## الدعم
للمساعدة والدعم، يرجى فتح issue في GitHub.
