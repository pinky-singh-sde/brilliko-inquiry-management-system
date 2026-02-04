
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type Profile = {
  full_name: string;
  role: string;
};

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  // 🔹 Load profile
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    };

    loadProfile();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 inset-y-0 left-0
        w-64 bg-white border-r flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b text-center relative">
          <Image
            src="/logo.png"
            alt="Brilliko Institute"
            width={70}
            height={70}
            className="mx-auto"
          />

          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink
            href="/counselor/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            active={pathname === "/counselor/dashboard"}
          />

          <SidebarLink
            href="/counselor/inquiries"
            label="My Inquiries"
            icon={Users}
            active={pathname === "/counselor/inquiries"}
          />

          <SidebarLink
            href="/counselor/admission"
            label="Admissions"
            icon={CheckCircle}
            active={pathname === "/counselor/admission"}
          />
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>

            <h1 className="text-lg font-semibold capitalize">
              {pathname.split("/").pop()?.replace("-", " ")}
            </h1>
          </div>

          {/* 🔹 Profile + Logout */}
          <div className="flex items-center gap-4">
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-blue-600 text-white
                           flex items-center justify-center
                           text-sm font-semibold uppercase"
              >
                {profile?.full_name?.charAt(0) ?? "U"}
              </div>

              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-medium">
                  {profile?.full_name ?? "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role?.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

/* ---------- Sidebar Link ---------- */

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: any;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
        ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}
