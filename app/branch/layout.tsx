// "use client";

// import { ReactNode } from "react";
// import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
// import Image from "next/image";


// export default function BranchLayout({ children }: { children: ReactNode }) {


//     const logout = async () => {
//       await supabase.auth.signOut();
//       window.location.href = "/auth/login";
//     };
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow">
//         <div className=" border-b">
//         <Image
//                  src="/logo.png"
//                  alt="Brilliko Institute"
//                  width={90}
//                  height={90}
//                  className="mx-10 mb-4 transition-transform duration-300 hover:scale-110"
//                />
//         </div>

//         <nav className="p-4 space-y-2">
//           <Link href="/branch/dashboard" className="block hover:text-orange-600">
//             Dashboard
//           </Link>
//           <Link href="/branch/inquiries" className="block hover:text-orange-600">
//             Inquiries
//           </Link>
//         </nav>
//       </aside>

//       {/* Main */}
//       <main className="flex-1">
//         <header className="bg-white p-4 shadow flex justify-between">
//           <span>Branch Admin Panel</span>
//           <span className="text-red-600 cursor-pointer"  onClick={logout}>Logout</span>
//         </header>

//         <div className="p-6">{children}</div>
//       </main>
//     </div>
//   );
// }


"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Menu, X, LayoutDashboard, Users, CircleUserRound } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BranchLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  const NavItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: any;
  }) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition
          ${
            active
              ? "bg-orange-100 text-orange-600"
              : "text-gray-600 hover:bg-gray-100 hover:text-orange-600"
          }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 📱 Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
          transform transition-transform duration-300
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Image
            src="/logo.png"
            alt="Brilliko Institute"
            width={80}
            height={80}
          />
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <NavItem
            href="/branch/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
          />
          <NavItem
            href="/branch/inquiries"
            label="Inquiries"
            icon={Users}
          />

          <NavItem 
          href="/branch/staff"
          label="Staff"
          icon={CircleUserRound}
          />
        </nav>
      </aside>

      {/* Main wrapper */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
            <span className="font-semibold text-gray-800">
              Branch Admin Panel
            </span>
          </div>

          <button
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
