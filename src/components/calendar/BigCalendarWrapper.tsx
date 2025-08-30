"use client"

import { Suspense } from "react"
import BigCalendarWrapper from "../BigCalendarWrapper"

interface BigCalendarWrapperProps {
    type: "teacherId" | "classId"
    id: string | number
}

export default function BigCalendarContainer({ type, id }: BigCalendarWrapperProps) {
    return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <BigCalendarWrapper type={type} id={id} />
        </Suspense>
    )
}
