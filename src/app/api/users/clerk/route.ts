import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

// GET - جلب المستخدمين من Clerk حسب الأدوار
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const url = new URL(request.url);
    const userType = url.searchParams.get("userType");
    const search = url.searchParams.get("search") || "";

    if (!userType) {
      return NextResponse.json({ error: "نوع المستخدم مطلوب" }, { status: 400 });
    }

    let availableUsers: any[] = [];

    // منطق تحديد المستخدمين المتاحين للمراسلة حسب نوع المستخدم
    // القواعد الجديدة:
    // - ADMIN: يرسل للـ STAFF فقط
    // - STAFF: يرسل ويستقبل من ADMIN و TEACHER
    // - TEACHER: يرسل ويستقبل من STUDENT و STAFF  
    // - STUDENT: يرسل ويستقبل من TEACHER فقط
    
    const allUsers = await clerkClient.users.getUserList({
      limit: 200,
    });
    
    console.log(`🌐 Clerk API responded with ${allUsers.data.length} users`);

    if (userType === "ADMIN") {
      // مدير النظام: يرسل للموظفين الإداريين فقط
      availableUsers = allUsers.data
        .filter(user => {
          const role = user.publicMetadata?.role as string;
          const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          return role === "staff" && 
                 (name.toLowerCase().includes(search.toLowerCase()) ||
                  user.username?.toLowerCase().includes(search.toLowerCase()));
        })
        .map(user => ({
          id: user.id,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'مستخدم مجهول',
          type: "STAFF",
          avatar: user.imageUrl,
          username: user.username,
        }));

    } else if (userType === "STAFF") {
      // الموظف الإداري: يرسل ويستقبل من مدير النظام والمعلمين
      availableUsers = allUsers.data
        .filter(user => {
          const role = user.publicMetadata?.role as string;
          const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          return (role === "admin" || role === "teacher") && 
                 (name.toLowerCase().includes(search.toLowerCase()) ||
                  user.username?.toLowerCase().includes(search.toLowerCase()));
        })
        .map(user => {
          const role = user.publicMetadata?.role as string;
          return {
            id: user.id,
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'مستخدم مجهول',
            type: role?.toUpperCase(),
            avatar: user.imageUrl,
            username: user.username,
          };
        });

    } else if (userType === "TEACHER") {
      // المعلم: يرسل ويستقبل من الطلاب والموظفين الإداريين
      availableUsers = allUsers.data
        .filter(user => {
          const role = user.publicMetadata?.role as string;
          const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          return (role === "student" || role === "staff") && 
                 (name.toLowerCase().includes(search.toLowerCase()) ||
                  user.username?.toLowerCase().includes(search.toLowerCase()));
        })
        .map(user => {
          const role = user.publicMetadata?.role as string;
          return {
            id: user.id,
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'مستخدم مجهول',
            type: role?.toUpperCase(),
            avatar: user.imageUrl,
            username: user.username,
          };
        });

    } else if (userType === "STUDENT") {
      // الطالب: يرسل ويستقبل من المعلمين فقط
      console.log("🎓 STUDENT searching for teachers...");
      console.log(`📊 Total users found: ${allUsers.data.length}`);
      
      // فحص جميع المستخدمين لمعرفة أدوارهم
      const roleStats = allUsers.data.reduce((acc, user) => {
        const role = user.publicMetadata?.role as string;
        acc[role || 'no-role'] = (acc[role || 'no-role'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log("📈 Role statistics:", roleStats);

      availableUsers = allUsers.data
        .filter(user => {
          const role = user.publicMetadata?.role as string;
          const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          const matchesRole = role === "teacher";
          const matchesSearch = search.length === 0 || 
                               name.toLowerCase().includes(search.toLowerCase()) ||
                               user.username?.toLowerCase().includes(search.toLowerCase());
          
          if (matchesRole) {
            console.log(`✅ Found teacher: ${name} (${user.username}) - role: ${role}`);
          }
          
          return matchesRole && matchesSearch;
        })
        .map(user => ({
          id: user.id,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'مستخدم مجهول',
          type: "TEACHER",
          avatar: user.imageUrl,
          username: user.username,
        }));
      
      console.log(`🎯 Final result: ${availableUsers.length} teachers found for student`);
    }

    return NextResponse.json(availableUsers);
  } catch (error) {
    console.error("خطأ في جلب المستخدمين من Clerk:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
