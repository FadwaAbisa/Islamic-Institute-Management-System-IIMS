import prisma from "@/lib/prisma";
import Image from "next/image";

interface UserCardProps {
  type: "admin" | "teacher" | "student" | "parent";
}

const UserCard = async ({ type }: UserCardProps) => {
  // خريطة النماذج مع معالجة أفضل للأخطاء
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  // الحصول على البيانات مع معالجة الأخطاء
  let data = 0;
  try {
    data = await modelMap[type].count();
  } catch (error) {
    console.error(`Error fetching ${type} count:`, error);
  }

  // تسميات محسنة للأنواع
  const typeLabels: Record<typeof type, string> = {
    admin: "المسؤولين",
    teacher: "المعلمين", 
    student: "الطلاب",
    parent: "أولياء الأمور",
  };

  // ألوان مخصصة للكروت - الأولى مع الثالثة، الثانية مع الرابعة
  const cardColors: Record<typeof type, string> = {
    admin: "bg-gradient-to-br from-[#D2B48C] to-[#B8956A]",
    teacher: "bg-gradient-to-br from-[#F0E6D6] to-[#E2D5C7] text-[#B8956A]", 
    student: "bg-gradient-to-br from-[#D2B48C] to-[#B8956A]",
    parent: "bg-gradient-to-br from-[#F0E6D6] to-[#E2D5C7] text-[#B8956A]",
  };

  // ألوان الأيقونات
  const iconColors: Record<typeof type, string> = {
    admin: "bg-white/30",
    teacher: "bg-[#B8956A]/20",
    student: "bg-white/30", 
    parent: "bg-[#B8956A]/20",
  };

  return (
    <div
      className={`
        rounded-2xl p-6 flex-1 min-w-[180px] 
        ${cardColors[type]} 
        ${type === 'teacher' || type === 'parent' ? 'text-[#B8956A]' : 'text-white'} 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:-translate-y-1
        relative overflow-hidden
      `}
      dir="rtl"
    >
      {/* خلفية ديكورية */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
      
      {/* الهيدر */}
      <div className="flex justify-between items-center mb-4">
        <div className={`${iconColors[type]} rounded-full p-3 backdrop-blur-sm`}>
          <Image
            src={`/icons/${type}.png`}
            alt={type}
            width={28}
            height={28}
            className={`object-contain ${type === 'teacher' || type === 'parent' ? 'opacity-80' : 'filter brightness-0 invert'}`}
          />
        </div>
        
        <div className="cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors duration-200">
          <Image 
            src="/more.png" 
            alt="المزيد" 
            width={18} 
            height={18} 
            className={`${type === 'teacher' || type === 'parent' ? 'opacity-60 hover:opacity-80' : 'filter brightness-0 invert opacity-70 hover:opacity-100'}`}
          />
        </div>
      </div>

      {/* العدد */}
      <div className="mb-3">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">
          {data.toLocaleString('ar-EG')}
        </h1>
        <div className={`w-12 h-1 ${type === 'teacher' || type === 'parent' ? 'bg-[#B8956A]/30' : 'bg-white/30'} rounded-full`}></div>
      </div>

      {/* التسمية */}
      <h2 className={`text-sm font-medium ${type === 'teacher' || type === 'parent' ? 'text-[#B8956A]/80' : 'text-white/90'} leading-relaxed`}>
        {typeLabels[type]}
      </h2>
    </div>
  );
};

export default UserCard;