"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function ReceptionLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    // router.push("/login");
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Title */}
          <Link
            href="/reception/dashboard"
            className="flex items-center gap-2 text-gray-800 hover:text-orange-500 transition"
          >
            <LayoutDashboard size={20} />
            <h1 className="text-lg font-semibold">
              Reception Dashboard
            </h1>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
