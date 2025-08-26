// MenuWrapper.tsx - استخدم هذا المكون بدلاً من Menu مباشرة
import { currentUser } from "@clerk/nextjs/server";
import Menu from "./Menu"; // استورد المكون المحسن من الأعلى

const MenuWrapper = async () => {
  const user = await currentUser();
  
  // ✅ تنظيف البيانات - تمرير البيانات البسيطة فقط
  const userData = user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    publicMetadata: {
      role: user.publicMetadata?.role || 'student'
    }
  } : null;
  
  return <Menu initialUser={userData} />;
};

export default MenuWrapper;