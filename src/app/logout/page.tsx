"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function LogoutPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignOutButton>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          تسجيل الخروج
        </button>
      </SignOutButton>
    </div>
  );
}
