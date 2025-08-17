"use client"

import type { SearchOptions } from "../types/student"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Upload, Download, Save } from "lucide-react"

interface SearchAndControlsProps {
  searchOptions: SearchOptions
  setSearchOptions: (options: SearchOptions) => void
}

export function SearchAndControls({ searchOptions, setSearchOptions }: SearchAndControlsProps) {
  const updateSearch = (key: keyof SearchOptions, value: string) => {
    setSearchOptions({ ...searchOptions, [key]: value })
  }

  const handleImportExcel = () => {
    // Simulate Excel import
    alert("سيتم تنفيذ وظيفة استيراد Excel")
  }

  const handleExportResults = () => {
    // Simulate export
    alert("سيتم تصدير النتائج")
  }

  const handleSaveProgress = () => {
    // Simulate save
    alert("تم حفظ التقدم بنجاح")
  }

  return (
    <div className="bg-lamaPurpleLight p-6 rounded-lg shadow-sm border border-lamaSkyLight mb-6">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* قسم البحث */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-lamaBlack mb-4">البحث والتصفية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="searchType" className="text-lamaBlack font-medium">
                نوع البحث
              </Label>
              <Select
                value={searchOptions.searchType}
                onValueChange={(value: any) => updateSearch("searchType", value)}
              >
                <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white" dir="rtl">
                  <SelectItem value="name" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                    البحث بالاسم
                  </SelectItem>
                  <SelectItem value="nationalId" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                    البحث بالرقم الوطني
                  </SelectItem>
                  <SelectItem value="studentId" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                    البحث برقم الطالب
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="searchValue" className="text-lamaBlack font-medium">
                قيمة البحث
              </Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lamaBlackLight h-4 w-4" />
                <Input
                  id="searchValue"
                  value={searchOptions.searchValue}
                  onChange={(e) => updateSearch("searchValue", e.target.value)}
                  placeholder="ادخل قيمة البحث..."
                  className="pr-10 bg-white text-lamaBlack border-lamaSky placeholder:text-lamaBlackLight"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="displayFilter" className="text-lamaBlack font-medium">
                خيارات العرض
              </Label>
              <Select
                value={searchOptions.displayFilter}
                onValueChange={(value: any) => updateSearch("displayFilter", value)}
              >
                <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white" dir="rtl">
                  <SelectItem value="all" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                    الكل
                  </SelectItem>
                  <SelectItem value="complete" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                    مكتملة
                  </SelectItem>
                  <SelectItem value="incomplete" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                    ناقصة
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* قسم التحكم */}
        <div className="lg:w-80">
          <h3 className="text-lg font-semibold text-lamaBlack mb-4">أدوات التحكم</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={handleImportExcel} className="bg-lamaSky hover:bg-lamaYellow text-white">
              <Upload className="ml-2 h-4 w-4" />
              استيراد Excel (أعمال 3 أشهر)
            </Button>
            <Button
              onClick={handleExportResults}
              variant="outline"
              className="border-lamaSky text-lamaBlack hover:bg-lamaSkyLight bg-transparent"
            >
              <Download className="ml-2 h-4 w-4" />
              تصدير النتائج
            </Button>
            <Button onClick={handleSaveProgress} className="bg-lamaYellow hover:bg-lamaSky text-white">
              <Save className="ml-2 h-4 w-4" />
              حفظ التقدم
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
