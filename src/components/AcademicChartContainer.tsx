import AcademicChart from "./AcademicChart";
import prisma from "@/lib/prisma";

const AcademicChartContainer = async () => {
  try {
    console.log('Fetching academic data directly from database...');
    
    // جلب عدد الطلاب الحقيقي من قاعدة البيانات
    const totalStudentsInDB = await prisma.student.count();
    console.log(`Total students in database: ${totalStudentsInDB}`);
    
    // جلب البيانات مباشرة من قاعدة البيانات
    const academicStats = await prisma.subjectGrade.findMany({
      include: {
        Student: {
          select: {
            studyLevel: true,
            academicYear: true,
          },
        },
      },
      where: {
        // التأكد من وجود بيانات صحيحة
        Student: {
          studyLevel: {
            not: null
          }
        }
      }
    });

    console.log(`Found ${academicStats.length} grade records`);
    console.log('Sample academic stats:', academicStats.slice(0, 3));

    // تجميع البيانات حسب المرحلة والفترة
    const statsMap = new Map();

    academicStats.forEach((grade) => {
      const studyLevel = grade.Student?.studyLevel;
      const period = grade.period;
      
      if (!studyLevel || !period) return;

      const key = `${studyLevel}-${period}`;
      
      if (!statsMap.has(key)) {
        statsMap.set(key, {
          studyLevel,
          period,
          total: 0,
          passed: 0,
        });
      }

      const stat = statsMap.get(key);
      stat.total++;
      
      // اعتبار الطالب ناجح إذا كان مجموع الفترة أكبر من أو يساوي 50
      if (grade.periodTotal >= 50) {
        stat.passed++;
      }
    });

    // تحويل البيانات إلى تنسيق مناسب للرسم البياني
    const chartData = [
      { name: "السنة الأولى", "الفترة الأولى": 0, "الفترة الثانية": 0, "الفترة الثالثة": 0 },
      { name: "السنة الثانية", "الفترة الأولى": 0, "الفترة الثانية": 0, "الفترة الثالثة": 0 },
      { name: "السنة الثالثة", "الفترة الأولى": 0, "الفترة الثانية": 0, "الفترة الثالثة": 0 },
    ];

    // حساب معدلات النجاح لكل مرحلة وفترة
    ["FIRST_YEAR", "SECOND_YEAR", "THIRD_YEAR"].forEach((level, index) => {
      ["FIRST", "SECOND", "THIRD"].forEach((period) => {
        const key = `${level}-${period}`;
        const stat = statsMap.get(key);
        
        let successRate = 0;
        if (stat && stat.total > 0) {
          successRate = Math.round((stat.passed / stat.total) * 100);
        }

        const periodName = period === "FIRST" ? "الفترة الأولى" : 
                          period === "SECOND" ? "الفترة الثانية" : "الفترة الثالثة";
        
        chartData[index][periodName] = successRate;
        
        console.log(`${level}-${period}: ${stat ? `${stat.passed}/${stat.total} = ${successRate}%` : 'No data'}`);
      });
    });
    
    console.log('Final chart data:', chartData);

    // إضافة إحصائيات إجمالية
    const totalStats = {
      totalStudents: totalStudentsInDB, // استخدام العدد الحقيقي من قاعدة البيانات
      totalGrades: academicStats.length,
      overallSuccessRate: 0,
    };

    const totalPassed = academicStats.filter(g => g.periodTotal >= 50).length;
    if (academicStats.length > 0) {
      totalStats.overallSuccessRate = Math.round((totalPassed / academicStats.length) * 100);
    }

    console.log('Real database data:', {
      totalStudents: totalStats.totalStudents,
      totalGrades: totalStats.totalGrades,
      overallSuccessRate: totalStats.overallSuccessRate,
      hasGrades: academicStats.length > 0
    });

    // إضافة رسالة توضيحية إذا لم توجد درجات
    if (academicStats.length === 0) {
      console.log('No grades found in database - showing empty chart');
    }

    return <AcademicChart data={chartData} totalStats={totalStats} />;

  } catch (error) {
    console.error('Error fetching academic data from database:', error);
    
    // محاولة جلب عدد الطلاب على الأقل
    let totalStudentsInDB = 0;
    try {
      totalStudentsInDB = await prisma.student.count();
      console.log(`Fallback: Total students in database: ${totalStudentsInDB}`);
    } catch (dbError) {
      console.error('Error fetching student count:', dbError);
    }
    
    // في حالة الخطأ، إرجاع بيانات فارغة مع العدد الحقيقي للطلاب
    const emptyData = [
      { name: "السنة الأولى", "الفترة الأولى": 0, "الفترة الثانية": 0, "الفترة الثالثة": 0 },
      { name: "السنة الثانية", "الفترة الأولى": 0, "الفترة الثانية": 0, "الفترة الثالثة": 0 },
      { name: "السنة الثالثة", "الفترة الأولى": 0, "الفترة الثانية": 0, "الفترة الثالثة": 0 },
    ];

    const emptyStats = {
      totalStudents: totalStudentsInDB, // استخدام العدد الحقيقي حتى في حالة الخطأ
      totalGrades: 0,
      overallSuccessRate: 0,
    };

    return <AcademicChart data={emptyData} totalStats={emptyStats} />;
  }
};

export default AcademicChartContainer;
