"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, User, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface AddStudentFormProps {
  onBack: () => void
}

export default function AddStudentForm({ onBack }: AddStudentFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    nationalId: "",
    nationality: "",
    birthDate: "",
    phoneNumber: "",
    address: "",

    // Step 2: Academic Registration
    branch: "",
    academicYear: "",
    academicLevel: "",
    academicSystem: "",
    specialization: "",
    studentStatus: "",

    // Step 3: Additional Info
    previousEducation: "",
    previousGrades: "",
    specialNeeds: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",

    // Step 4: Documents
    birthCertificate: null,
    academicTranscript: null,
    nationalIdCopy: null,
    photos: null,
    otherDocuments: null,
  })

  const steps = [
    { number: 1, title: "البيانات الشخصية والتواصل" },
    { number: 2, title: "بيانات التسجيل الأكاديمي" },
    { number: 3, title: "بيانات إضافية" },
    { number: 4, title: "رفع المستندات" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          البيانات الشخصية والتواصل
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="firstName">الاسم الأول</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="أدخل الاسم الأول"
            />
          </div>
          <div>
            <Label htmlFor="lastName">اسم العائلة</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="أدخل اسم العائلة"
            />
          </div>
          <div>
            <Label htmlFor="nationalId">رقم الهوية / رقم الوطني</Label>
            <Input
              id="nationalId"
              value={formData.nationalId}
              onChange={(e) => handleInputChange("nationalId", e.target.value)}
              placeholder="أدخل رقم الهوية"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="nationality">الجنسية</Label>
            <Select onValueChange={(value) => handleInputChange("nationality", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الجنسية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saudi">سعودي</SelectItem>
                <SelectItem value="egyptian">مصري</SelectItem>
                <SelectItem value="jordanian">أردني</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="birthDate">تاريخ الميلاد</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="أدخل رقم الهاتف"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">العنوان</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="أدخل العنوان الكامل"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>بيانات التسجيل الأكاديمي</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="branch">الفرع</Label>
            <Input
              id="branch"
              value={formData.branch}
              onChange={(e) => handleInputChange("branch", e.target.value)}
              placeholder="عثمان بن عفان"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="academicYear">العام الدراسي</Label>
            <Select onValueChange={(value) => handleInputChange("academicYear", value)}>
              <SelectTrigger>
                <SelectValue placeholder="2028-2029" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2028-2029">2028-2029</SelectItem>
                <SelectItem value="2029-2030">2029-2030</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="academicLevel">المرحلة الدراسية</Label>
            <Select onValueChange={(value) => handleInputChange("academicLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المرحلة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">الأولى</SelectItem>
                <SelectItem value="second">الثانية</SelectItem>
                <SelectItem value="third">الثالثة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="academicSystem">النظام الدراسي</Label>
            <Select onValueChange={(value) => handleInputChange("academicSystem", value)}>
              <SelectTrigger>
                <SelectValue placeholder="نظامي" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">نظامي</SelectItem>
                <SelectItem value="distance">عن بعد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="specialization">التخصص</Label>
            <Select onValueChange={(value) => handleInputChange("specialization", value)}>
              <SelectTrigger>
                <SelectValue placeholder="الدراسات الإسلامية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="islamic-studies">الدراسات الإسلامية</SelectItem>
                <SelectItem value="arabic">اللغة العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="studentStatus">حالة الطالب</Label>
            <Select onValueChange={(value) => handleInputChange("studentStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="مستمر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="continuing">مستمر</SelectItem>
                <SelectItem value="new">جديد</SelectItem>
                <SelectItem value="transferred">محول</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>بيانات إضافية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="previousEducation">المؤهل السابق</Label>
            <Input
              id="previousEducation"
              value={formData.previousEducation}
              onChange={(e) => handleInputChange("previousEducation", e.target.value)}
              placeholder="أدخل المؤهل السابق"
            />
          </div>
          <div>
            <Label htmlFor="previousGrades">الدرجات السابقة</Label>
            <Input
              id="previousGrades"
              value={formData.previousGrades}
              onChange={(e) => handleInputChange("previousGrades", e.target.value)}
              placeholder="أدخل الدرجات"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContact">جهة الاتصال للطوارئ</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
              placeholder="اسم جهة الاتصال للطوارئ"
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone">هاتف جهة الاتصال للطوارئ</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
              placeholder="رقم الهاتف"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="specialNeeds">الاحتياجات الخاصة</Label>
          <Textarea
            id="specialNeeds"
            value={formData.specialNeeds}
            onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
            placeholder="أدخل أي احتياجات خاصة"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="notes">ملاحظات إضافية</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="أدخل أي ملاحظات إضافية"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          رفع المستندات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm font-medium mb-2">شهادة الميلاد</div>
            <Button variant="outline" size="sm">
              اختيار ملف
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm font-medium mb-2">صورة الهوية / إقامة الوطني (JPG/PNG)</div>
            <Button variant="outline" size="sm">
              اختيار ملف
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm font-medium mb-2">صورة الطالب الشخصية (JPG/PNG)</div>
            <Button variant="outline" size="sm">
              اختيار ملف
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm font-medium mb-2">كشف درجات آخر (اختياري)</div>
            <Button variant="outline" size="sm">
              اختيار ملفات
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm font-medium mb-2">كشف الاعتماد (JPG/PNG)</div>
            <Button variant="outline" size="sm">
              اختيار ملف
            </Button>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <div className="text-sm font-medium mb-2">استمارة التعليم</div>
          <Button variant="outline" size="sm">
            اختيار ملف
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-amber-600 text-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-amber-700">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Button>
          <div className="text-sm">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-amber-600 mb-2 flex items-center justify-center gap-2">
            <User className="w-6 h-6" />
            إضافة طالب جديد
          </h1>
        </div>

        {renderStepIndicator()}

        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowRight className="w-4 h-4" />
            السابق
          </Button>

          {currentStep < 4 ? (
            <Button onClick={nextStep} className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2">
              التالي
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700">✓ حفظ بيانات الطالب</Button>
          )}
        </div>
      </div>
    </div>
  )
}
