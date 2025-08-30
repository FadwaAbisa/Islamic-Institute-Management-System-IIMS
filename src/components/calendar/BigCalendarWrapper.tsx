"use client"

import { Suspense } from "react"
import BigCalendarContainer from "./BigCalendarContainer"

interface BigCalendarWrapperProps {
    type: "teacherId" | "classId"
    id: string | number
}

export default function BigCalendarWrapper({ type, id }: BigCalendarWrapperProps) {
    return (
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <BigCalendarContainer type={type} id={id} />
        </Suspense>
    )
}
