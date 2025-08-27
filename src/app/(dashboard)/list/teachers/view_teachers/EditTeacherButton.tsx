"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, ExternalLink } from "lucide-react"

interface EditTeacherButtonProps {
  teacherId: string
  teacherName?: string
}

export default function EditTeacherButton({ teacherId, teacherName = "المعلم" }: EditTeacherButtonProps) {
  return (
    <Link href={`/list/teachers/${teacherId}/edit`}>
      <Button 
        size="sm" 
        variant="outline" 
        className="text-lamaYellow hover:text-lamaYellowLight hover:bg-lamaYellowLight/30 border-lamaYellow rounded-lg transition-all duration-300 group hover:scale-105 transform"
        title={`تعديل بيانات ${teacherName}`}
      >
        <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
      </Button>
    </Link>
  )
}
