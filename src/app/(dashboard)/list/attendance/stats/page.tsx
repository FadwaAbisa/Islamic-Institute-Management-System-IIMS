import { Suspense } from "react";
import AttendanceStats from "../../../../../components/AttendanceStats";

export default function AttendanceStatsPage() {
    return (
        <Suspense fallback={<div>جاري التحميل...</div>}>
            <AttendanceStats />
        </Suspense>
    );
}
