"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="bg-white w-105 rounded-xl shadow-lg p-8 text-center">
        <Image
          src="/logo.png"
          alt="Brilliko Institute"
          width={70}
          height={70}
          className="mx-auto mb-4"
        />

        <h1 className="text-xl font-semibold">Brilliko Institute</h1>
        <p className="text-sm text-gray-500 mb-6">
          Inquiry & Admission Management System
        </p>

        <button
          onClick={() => router.push("/inquiry/new")}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium mb-3"
        >
          New Student Inquiry
        </button>

        <button
          onClick={() => router.push("/auth/login")}
          className="w-full border border-gray-300 py-3 rounded-md font-medium"
        >
          Staff Login
        </button>

        <p className="text-xs text-gray-400 mt-6">
          © 2026 Brilliko Institute
        </p>
      </div>
    </div>
  );
}
