import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdsProvider } from "@/contexts/AdsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "نظام إدارة المعهد المتوسط للدراسات الإسلامية",
  description: "نظام إدارة شامل المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان",
  generator: 'Next.js',
  icons: {
    icon: '/icons/logo.png',
    shortcut: '/icons/logo.png',
    apple: '/icons/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/"
    >
      <html lang="ar" dir="rtl">
        <body className={inter.className}>
          <AdsProvider>
            {children}
            <ToastContainer position="bottom-right" theme="dark" />
          </AdsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}