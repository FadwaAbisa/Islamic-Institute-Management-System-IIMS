import AcademicChart from "./AcademicChart";

// بيانات تجريبية في حالة عدم توفر بيانات حقيقية
const fallbackData = [
  {
    name: "السنة الأولى",
    "الفترة الأولى": 78,
    "الفترة الثانية": 82,
    "الفترة الثالثة": 85,
  },
  {
    name: "السنة الثانية",
    "الفترة الأولى": 73,
    "الفترة الثانية": 79,
    "الفترة الثالثة": 81,
  },
  {
    name: "السنة الثالثة",
    "الفترة الأولى": 69,
    "الفترة الثانية": 75,
    "الفترة الثالثة": 77,
  },
];

const fallbackStats = {
  totalStudents: 450,
  overallSuccessRate: 78,
};

async function fetchAcademicData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/academic-stats`, {
      cache: 'no-store', // للحصول على أحدث البيانات
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch academic data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching academic data:', error);
    // إرجاع البيانات التجريبية في حالة الخطأ
    return {
      chartData: fallbackData,
      totalStats: fallbackStats,
    };
  }
}

const AcademicChartContainer = async () => {
  const { chartData, totalStats } = await fetchAcademicData();

  // التأكد من وجود البيانات
  const dataToUse = chartData && chartData.length > 0 ? chartData : fallbackData;
  const statsToUse = totalStats || fallbackStats;

  return <AcademicChart data={dataToUse} totalStats={statsToUse} />;
};

export default AcademicChartContainer;
