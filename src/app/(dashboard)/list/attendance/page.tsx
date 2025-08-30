import { Suspense } from "react";
import { AttendanceManagement } from "../../../../components/attendance-management";

export default function AttendancePage() {
    return (
        <Suspense fallback={<div>جاري التحميل...</div>}>
            <AttendanceManagement />
        </Suspense>
    );
}
