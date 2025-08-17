// import type React from "react"
// import type { Metadata } from "next"
// import { Cairo, Tajawal, Almarai } from "next/font/google"
// import "./globals.css"

// // تحميل الخطوط العربية
// const cairo = Cairo({
//   subsets: ["arabic", "latin"],
//   weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
//   variable: "--font-cairo",
//   display: "swap",
// })

// const tajawal = Tajawal({
//   subsets: ["arabic", "latin"],
//   weight: ["200", "300", "400", "500", "700", "800", "900"],
//   variable: "--font-tajawal",
//   display: "swap",
// })

// const almarai = Almarai({
//   subsets: ["arabic"],
//   weight: ["300", "400", "700", "800"],
//   variable: "--font-almarai",
//   display: "swap",
// })

// export const metadata: Metadata = {
//   title: "نظام إدارة الطلاب",
//   description: "المعهد المتوسط للدراسات الإسلامية",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="ar" dir="rtl">
//       <body className={`${cairo.variable} ${tajawal.variable} ${almarai.variable} font-cairo antialiased`}>
//         {children}
//       </body>
//     </html>
//   )
// }
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev School Management Dashboard",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body className={inter.className}>
          {children} <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
