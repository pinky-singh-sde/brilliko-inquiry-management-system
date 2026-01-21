"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";


export default function BranchLayout({ children }: { children: ReactNode }) {


    const logout = async () => {
      await supabase.auth.signOut();
      window.location.href = "/auth/login";
    };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow">
        <div className=" border-b">
        <Image
                 src="/logo.png"
                 alt="Brilliko Institute"
                 width={90}
                 height={90}
                 className="mx-10 mb-4 transition-transform duration-300 hover:scale-110"
               />
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/branch/dashboard" className="block hover:text-orange-600">
            Dashboard
          </Link>
          <Link href="/branch/inquiries" className="block hover:text-orange-600">
            Inquiries
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="bg-white p-4 shadow flex justify-between">
          <span>Branch Panel</span>
          <span className="text-red-600 cursor-pointer"  onClick={logout}>Logout</span>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
