// ===== المكونات الأساسية =====
// export { default as Navbar } from './core/Navbar'; // مكون خادم - لا يتم تصديره
export { default as Sidebar } from './core/Sidebar';
export { default as Menu } from './core/Menu';
// export { default as MenuWrapper } from './core/MenuWrapper'; // مكون خادم - لا يتم تصديره
export { SearchAndControls } from './core/SearchAndControls';
export { FilterSection } from './core/FilterSection';
export { default as UserCard } from './core/UserCard';
export { default as UserCardsGrid } from './core/UserCardsGrid';
export { default as PDFViewer } from './core/PDFViewer';

// ===== مكونات الطلاب =====
export { default as AddStudentForm } from './students/AddStudentForm';
export { default as StudentsFilters } from './students/StudentsFilters';
export { default as StudentManagementCards } from './students/StudentManagementCards';
export { default as StudentAttendanceCard } from './students/StudentAttendanceCard';

// ===== مكونات المعلمين =====
export { default as TeachersFilters } from './teachers/TeachersFilters';

// ===== مكونات الدرجات =====
export * from './grades';

// ===== مكونات الحضور =====
export { default as AttendanceTable } from './attendance/AttendanceTable';
export { default as AttendanceStats } from './attendance/AttendanceStats';
export { default as AttendanceChart } from './attendance/AttendanceChart';
export { default as AttendanceChartContainer } from './attendance/AttendanceChartContainer';

// ===== مكونات التقويم =====
export { default as EventCalendar } from './calendar/EventCalendar';
export { default as EventCalendarContainer } from './calendar/EventCalendarContainer';
export { default as BigCalendar } from './calendar/BigCalender';
export { default as BigCalendarContainer } from './calendar/BigCalendarContainer';

// ===== مكونات الإحصائيات =====
export { StatsSection } from './stats/StatsSection';
export { default as CountChart } from './stats/CountChart';
export { default as CountChartContainer } from './stats/CountChartContainer';
export { default as FinanceChart } from './stats/FinanceChart';
export { default as Performance } from './stats/Performance';

// ===== مكونات الإعلانات =====
export * from './ads';

// ===== مكونات النماذج =====
export { default as FormContainer } from './forms/FormContainer';
export { default as FormModal } from './forms/FormModal';
export { default as InputField } from './forms/InputField';

// ===== مكونات الجداول =====
export { default as Table } from './tables/Table';
export { default as TableSearch } from './tables/TableSearch';
export { default as Pagination } from './tables/Pagination';

// ===== مكونات الصفحات =====
export { default as ViewStudentsPage } from './pages/view-students-page';
export { default as ViewResultsPage } from './pages/view-results-page';
export { default as ReviewRequestsPage } from './pages/review-requests-page';
export { AdsManagement } from './pages/ads-management';
export { default as AdminDashboardCards } from './pages/admin-dashboard-cards';
