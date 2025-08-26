"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download, X, FileText } from "lucide-react"

interface PDFViewerProps {
    data: any
    onClose: () => void
    type: string
}

export default function PDFViewer({ data, onClose, type }: PDFViewerProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePrint = () => {
        setIsLoading(true)
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(generateHTMLContent(data, type))
            printWindow.document.close()
            printWindow.focus()
            printWindow.print()
            printWindow.close()
        }
        setIsLoading(false)
    }

    const handleDownload = () => {
        setIsLoading(true)
        const htmlContent = generateHTMLContent(data, type)
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${data.title}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setIsLoading(false)
    }

    if (!data) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
                <CardHeader className="bg-lamaYellow text-white">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <FileText className="w-6 h-6" />
                            {data.title}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-white hover:bg-white hover:text-lamaYellow"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[70vh] overflow-auto p-6">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.title}</h1>
                            <p className="text-gray-600">تم إنشاؤه في: {data.generatedAt}</p>
                        </div>

                        {/* Filters Info */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">معلومات التقرير:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">العام الدراسي:</span> {data.filters.academicYear}
                                </div>
                                <div>
                                    <span className="font-medium">المرحلة:</span> {data.filters.stage}
                                </div>
                                <div>
                                    <span className="font-medium">نظام الدراسة:</span> {data.filters.studySystem}
                                </div>
                                {data.filters.month && (
                                    <div>
                                        <span className="font-medium">الشهر:</span> {data.filters.month}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-lamaYellow text-white">
                                        {data.headers.map((header: string, index: number) => (
                                            <th key={index} className="border border-gray-300 px-3 py-2 text-right font-medium">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rows.map((row: any, rowIndex: number) => (
                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            {data.headers.map((header: string, colIndex: number) => {
                                                const key = getKeyFromHeader(header)
                                                const value = row[key] || '-'
                                                return (
                                                    <td key={colIndex} className="border border-gray-300 px-3 py-2 text-right">
                                                        {value}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">ملخص التقرير:</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">إجمالي الطلاب:</span> {data.rows.length}
                                </div>
                                <div>
                                    <span className="font-medium">نوع التقرير:</span> {getTypeName(type)}
                                </div>
                                <div>
                                    <span className="font-medium">تاريخ الإنشاء:</span> {data.generatedAt}
                                </div>
                                <div>
                                    <span className="font-medium">الحالة:</span> جاهز للطباعة
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t p-4 bg-gray-50 flex justify-center gap-4">
                        <Button
                            onClick={handlePrint}
                            disabled={isLoading}
                            className="bg-lamaYellow hover:bg-lamaYellow/90 text-white px-6 py-2"
                        >
                            <Printer className="w-4 h-4 ml-2" />
                            {isLoading ? 'جاري الطباعة...' : 'طباعة'}
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={isLoading}
                            variant="outline"
                            className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white px-6 py-2"
                        >
                            <Download className="w-4 h-4 ml-2" />
                            {isLoading ? 'جاري التحميل...' : 'تحميل'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function getKeyFromHeader(header: string): string {
    const headerMap: { [key: string]: string } = {
        'الرقم': 'number',
        'اسم الطالب': 'studentName',
        'الرقم القومي': 'nationalId',
        'المرحلة': 'studyLevel',
        'نظام الدراسة': 'studyMode',
        'الشهر الأول': 'month1',
        'الشهر الثاني': 'month2',
        'الشهر الثالث': 'month3',
        'الامتحان النهائي': 'finalExam',
        'المجموع': 'total',
        'مجموع الأعمال': 'workTotal',
        'مجموع الفترة': 'periodTotal',
        'مجموع الفترة الأولى': 'period1Total',
        'مجموع الفترة الثانية': 'period2Total',
        'المجموع النهائي': 'finalTotal',
        'الحالة': 'status'
    }
    return headerMap[header] || header
}

function getTypeName(type: string): string {
    const typeNames: { [key: string]: string } = {
        monthly: 'كشف شهري',
        period1: 'كشف الفترة الأولى',
        period2: 'كشف الفترة الثانية',
        total: 'مجموع الفترتين',
        transcript: 'نموذج الصحيفة'
    }
    return typeNames[type] || type
}

function generateHTMLContent(data: any, type: string): string {
    return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
            body { 
                font-family: 'Arial', sans-serif; 
                margin: 20px; 
                direction: rtl; 
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #333; 
                padding-bottom: 20px; 
            }
            .filters { 
                background: #f5f5f5; 
                padding: 15px; 
                margin-bottom: 20px; 
                border-radius: 5px; 
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px; 
            }
            th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: right; 
            }
            th { 
                background-color: #f2f2f2; 
                font-weight: bold; 
            }
            .summary { 
                background: #f9f9f9; 
                padding: 15px; 
                border-radius: 5px; 
            }
            @media print {
                body { margin: 0; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${data.title}</h1>
            <p>تم إنشاؤه في: ${data.generatedAt}</p>
        </div>
        
        <div class="filters">
            <h3>معلومات التقرير:</h3>
            <p><strong>العام الدراسي:</strong> ${data.filters.academicYear}</p>
            <p><strong>المرحلة:</strong> ${data.filters.stage}</p>
            <p><strong>نظام الدراسة:</strong> ${data.filters.studySystem}</p>
            ${data.filters.month ? `<p><strong>الشهر:</strong> ${data.filters.month}</p>` : ''}
        </div>
        
        <table>
            <thead>
                <tr>
                    ${data.headers.map((header: string) => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.rows.map((row: any) => `
                    <tr>
                        ${data.headers.map((header: string) => {
        const key = getKeyFromHeader(header)
        const value = row[key] || '-'
        return `<td>${value}</td>`
    }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="summary">
            <h3>ملخص التقرير:</h3>
            <p><strong>إجمالي الطلاب:</strong> ${data.rows.length}</p>
            <p><strong>نوع التقرير:</strong> ${getTypeName(type)}</p>
            <p><strong>تاريخ الإنشاء:</strong> ${data.generatedAt}</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
                طباعة
            </button>
        </div>
    </body>
    </html>
  `
}
