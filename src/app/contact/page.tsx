"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, Building, Globe } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال الرسالة
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // إعادة تعيين النموذج
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "الهاتف",
      details: ["+966 50 123 4567", "+966 50 987 6543"],
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      details: ["info@islamicinstitute.edu.sa", "support@islamicinstitute.edu.sa"],
      color: "bg-green-50 text-green-600"
    },
    {
      icon: MapPin,
      title: "العنوان",
      details: ["جزيرة سوق الثلاثاء بالقرب من مركز العزل", "ليبيا - طرابلس"],
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      details: ["الأحد - الخميس: 8:00 ص - 4:00 م", "الجمعة - السبت: مغلق"],
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurpleLight via-white to-lamaSkyLight">
      {/* Navbar */}
      <Navbar />
      
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lamaSky/20 to-lamaPurple/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full mb-6 shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-tajawal">
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-tajawal">
              نحن هنا لمساعدتك في أي استفسار أو استشارة تحتاجها. لا تتردد في التواصل معنا
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-tajawal">أرسل لنا رسالة</h2>
              <p className="text-gray-600 font-tajawal">سنقوم بالرد عليك في أقرب وقت ممكن</p>
            </div>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-tajawal">
                  تم إرسال رسالتك بنجاح!
                </h3>
                <p className="text-green-600 font-tajawal">
                  شكراً لك، سنقوم بالرد عليك قريباً
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-tajawal">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lamaSky focus:border-lamaSky transition-all duration-300 font-tajawal"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-tajawal">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lamaSky focus:border-lamaSky transition-all duration-300 font-tajawal"
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 font-tajawal">
                    الموضوع
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lamaSky focus:border-lamaSky transition-all duration-300 font-tajawal"
                      placeholder="أدخل موضوع الرسالة"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 font-tajawal">
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-lamaSky focus:border-lamaSky transition-all duration-300 resize-none font-tajawal"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-lamaSky to-lamaYellow text-white font-semibold py-4 px-6 rounded-xl hover:from-lamaYellow hover:to-lamaSky transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-tajawal shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" />
                      إرسال الرسالة
                    </div>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 font-tajawal">
                        {item.title}
                      </h3>
                      {item.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600 font-tajawal">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-lamaSkyLight to-lamaPurpleLight rounded-xl p-6 border border-lamaSky/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-lamaSky rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-tajawal">
                  متواجدون على مدار الساعة
                </h3>
                <p className="text-gray-600 font-tajawal">
                  يمكنك التواصل معنا في أي وقت عبر البريد الإلكتروني أو ترك رسالة، وسنقوم بالرد عليك في أقرب وقت ممكن
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-tajawal">موقعنا</h2>
              <p className="text-gray-600 font-tajawal">يمكنك زيارتنا في الموقع التالي</p>
            </div>
            
            <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-tajawal">خريطة تفاعلية ستظهر هنا</p>
                <p className="text-sm text-gray-400 font-tajawal">يمكن إضافة خريطة Google Maps أو أي خدمة خرائط أخرى</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
