"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function AddStudentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    birthday: "",
    sex: "",
  })

  const steps = [
    { number: 1, title: "البيانات الأساسية" },
    { number: 2, title: "معلومات الاتصال" },
    { number: 3, title: "البيانات الإضافية" },
    { number: 4, title: "المستندات" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("تم إضافة الطالب بنجاح!")
        // Reset form
        setFormData({
          name: "",
          surname: "",
          username: "",
          email: "",
          phone: "",
          address: "",
          bloodType: "",
          birthday: "",
          sex: "",
        })
        setCurrentStep(1)
      }
    } catch (error) {
      console.error("خطأ في إضافة الطالب:", error)
      alert("حدث خطأ أثناء إضافة الطالب")
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8" dir="rtl">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              currentStep >= step.number ? "bg-amber-600" : "bg-gray-300"
            }`}
          >
            {step.number}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-20 h-1 mx-2 ${currentStep > step.number ? "bg-amber-600" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">الاسم الأول</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="أدخل الاسم الأول"
          />
        </div>
        <div>
          <Label htmlFor="surname">اسم العائلة</Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => handleInputChange("surname", e.target.value)}
            placeholder="أدخل اسم العائلة"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username">اسم المستخدم</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="أدخل اسم المستخدم"
          />
        </div>
        <div>
          <Label htmlFor="sex">الجنس</Label>
          <Select onValueChange={(value) => handleInputChange("sex", value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الجنس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">ذكر</SelectItem>
              <SelectItem value="FEMALE">أنثى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="birthday">تاريخ الميلاد</Label>
        <Input
          id="birthday"
          type="date"
          value={formData.birthday}
          onChange={(e) => handleInputChange("birthday", e.target.value)}
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {renderStepIndicator()}

      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {/* يمكنك إضافة باقي الخطوات هنا */}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          السابق
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
          >
            التالي
            <ArrowLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            ✓ حفظ بيانات الطالب
          </Button>
        )}
      </div>
    </div>
  )
}
