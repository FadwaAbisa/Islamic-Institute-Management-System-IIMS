"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface ViewTeacherButtonProps {
  teacherId: string
  teacherName?: string
}

export default function ViewTeacherButton({ teacherId, teacherName = "المعلم" }: ViewTeacherButtonProps) {
  return (
    <Link href={`/list/teachers/${teacherId}`}>
      <Button 
        size="sm" 
        variant="outline" 
        className="text-lamaSky hover:text-lamaYellow hover:bg-lamaSkyLight border-lamaSky rounded-lg transition-all duration-300 group hover:scale-105 transform"
        title={`عرض بيانات ${teacherName}`}
      >
        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
      </Button>
    </Link>
  )
}
