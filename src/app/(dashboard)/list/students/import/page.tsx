'use client';

import { useState } from 'react';
import { Upload, Download, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ImportStudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('يرجى اختيار ملف Excel صحيح (.xlsx أو .xls)');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('يرجى اختيار ملف أولاً');
      return;
    }

    setUploading(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/students/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'حدث خطأ أثناء رفع الملف');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('خطأ في الرفع:', err);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'الاسم الرباعي (مطلوب)',
      'تاريخ الميلاد (YYYY-MM-DD)',
      'الجنس (مطلوب: ذكر/أنثى)',
      'الجنسية',
      'الرقم الوطني (فريد)',
      'مكان الميلاد',
      'العنوان',
      'هاتف الطالب',
      'هاتف ولي الأمر',
      'اسم ولي الأمر',
      'صلة القرابة',
      'الفرع',
      'حالة الطالب',
      'النظام الدراسي',
      'الصفة القيد',
      'العام الدراسي',
      'المرحلة الدراسية',
      'الشعبة التخصصية'
    ];

    const sampleData = [
      'أحمد محمد علي حسن',
      '2005-01-15',
      'ذكر',
      'سعودي',
      '1234567890',
      'الرياض',
      'حي الملز، الرياض',
      '0501234567',
      '0509876543',
      'محمد علي حسن',
      'الأب',
      'الصف الأول الثانوي',
      'مستمر',
      'نظامي',
      'مستجد',
      '2024-2025',
      '1',
      'العلوم الطبيعية'
    ];

    let csvContent = '\\uFEFF' + headers.join(',') + '\\n'; // BOM للدعم العربي
    csvContent += sampleData.join(',') + '\\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'نموذج_بيانات_الطلاب.csv';
    link.click();
  };

  const resetForm = () => {
    setFile(null);
    setResults(null);
    setError('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-7 w-7 text-blue-600" />
          استيراد بيانات الطلاب
        </h1>
        <p className="text-gray-600 mt-2">
          رفع ملف Excel يحتوي على بيانات الطلاب لإضافتهم للنظام دفعة واحدة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                تعليمات مهمة
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• الملف يجب أن يكون بصيغة Excel (.xlsx أو .xls)</li>
                <li>• الصف الأول يحتوي على عناوين الأعمدة</li>
                <li>• الحقول المطلوبة: الاسم، تاريخ الميلاد، الجنس، المرحلة</li>
                <li>• تنسيق التاريخ: YYYY-MM-DD</li>
                <li>• الجنس: ذكر أو أنثى فقط</li>
              </ul>
            </div>

            {/* Template Download */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">تحميل النموذج</h3>
              <p className="text-sm text-green-700 mb-3">
                قم بتحميل نموذج ملف Excel لمعرفة التنسيق المطلوب
              </p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="h-4 w-4" />
                تحميل النموذج
              </button>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                رفع ملف Excel
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  اختيار ملف
                </label>
                
                <p className="mt-2 text-sm text-gray-500">
                  أو اسحب الملف هنا
                </p>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <Upload className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetForm}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  !file || uploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'جاري الرفع...' : 'رفع الملف'}
              </button>
              
              {results && (
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  رفع ملف جديد
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats & Results Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          {results && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">إحصائيات العملية</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700">إجمالي الصفوف</span>
                  <span className="font-semibold text-blue-900">{results.total}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">تم بنجاح</span>
                  <span className="font-semibold text-green-900">{results.successCount}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-red-700">فشل</span>
                  <span className="font-semibold text-red-900">{results.errorCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Format Example */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">مثال على التنسيق</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-medium text-gray-700">الاسم:</span>
                <span className="text-gray-600 mr-2">أحمد محمد علي</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">التاريخ:</span>
                <span className="text-gray-600 mr-2">2005-01-15</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">الجنس:</span>
                <span className="text-gray-600 mr-2">ذكر</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">المرحلة:</span>
                <span className="text-gray-600 mr-2">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">نتائج العملية</h2>
          </div>

          {/* Success Message */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{results.message}</p>
          </div>

          {/* Successful Students */}
          {results.results && results.results.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-green-700 mb-3">
                الطلاب الذين تم إضافتهم ({results.results.length})
              </h3>
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-right">الصف</th>
                      <th className="px-4 py-2 text-right">الاسم</th>
                      <th className="px-4 py-2 text-right">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((result: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{result.row}</td>
                        <td className="px-4 py-2">{result.name}</td>
                        <td className="px-4 py-2 text-green-600">{result.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Errors */}
          {results.errors && results.errors.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 mb-3">
                الأخطاء ({results.errors.length})
              </h3>
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-right">الصف</th>
                      <th className="px-4 py-2 text-right">الاسم</th>
                      <th className="px-4 py-2 text-right">الخطأ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.errors.map((error: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{error.row}</td>
                        <td className="px-4 py-2">{error.data?.name || 'غير محدد'}</td>
                        <td className="px-4 py-2 text-red-600 text-xs">{error.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}