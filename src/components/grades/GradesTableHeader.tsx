"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface GradesTableHeaderProps {
    visibleColumns: {
        studentNumber: boolean
        studentName: boolean
        academicYear: boolean
        studyLevel: boolean
        studyMode: boolean
        specialization: boolean
        firstMonth: boolean
        secondMonth: boolean
        thirdMonth: boolean
        average: boolean
        workTotal: boolean
        finalExam: boolean
        periodTotal: boolean
        status: boolean
        actions: boolean
    }
    toggleColumn: (column: keyof GradesTableHeaderProps['visibleColumns']) => void
    subjectName: string
    isThirdPeriod: boolean
}

export function GradesTableHeader({
    visibleColumns,
    toggleColumn,
    subjectName,
    isThirdPeriod
}: GradesTableHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    جدول درجات {subjectName}
                </h2>
                <Badge variant={isThirdPeriod ? "default" : "secondary"}>
                    {isThirdPeriod ? "الفترة الثالثة" : "الفترة الأولى/الثانية"}
                </Badge>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        إعدادات الأعمدة
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>إعدادات عرض الأعمدة</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(visibleColumns).map(([key, visible]) => (
                            <label key={key} className="flex items-center space-x-2 space-x-reverse">
                                <input
                                    type="checkbox"
                                    checked={visible}
                                    onChange={() => toggleColumn(key as keyof typeof visibleColumns)}
                                    className="rounded"
                                />
                                <span className="text-sm">
                                    {getColumnLabel(key)}
                                </span>
                            </label>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function getColumnLabel(column: string): string {
    const labels: Record<string, string> = {
        studentNumber: "رقم الطالب",
        studentName: "اسم الطالب",
        academicYear: "العام الدراسي",
        studyLevel: "المرحلة الدراسية",
        studyMode: "نظام الدراسة",
        specialization: "الشعبة",
        firstMonth: "الشهر الأول/الفترة الأولى",
        secondMonth: "الشهر الثاني/الفترة الثانية",
        thirdMonth: "الشهر الثالث",
        average: "المتوسط",
        workTotal: "مجموع الأعمال",
        finalExam: "الامتحان النهائي",
        periodTotal: "مجموع الفترة",
        status: "الحالة",
        actions: "الإجراءات"
    }
    return labels[column] || column
}
