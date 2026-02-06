

// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import {
//   Menu,
//   X,
//   LayoutDashboard,
//   Users,
//   CircleUserRound,
//   LogOut,
// } from "lucide-react";
// import { supabase } from "@/lib/supabaseClient";

// type Branch = {
//   id: string;
//   name: string;
// };

// type Profile = {
//   full_name: string;
//   role: string;
//   branches: Branch | null;
// };

// export default function BranchLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);
//   const [profile, setProfile] = useState<Profile | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data } = await supabase
//         .from("profiles")
//         .select("full_name, role, branches(name)")
//         .eq("id", user.id)
//         .single();

//       setProfile(data);
//     };

//     fetchProfile();
//   }, []);

//   const logout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = "/auth/login";
//   };

//   const NavItem = ({
//     href,
//     label,
//     icon: Icon,
//   }: {
//     href: string;
//     label: string;
//     icon: React.ElementType;
//   }) => {
//     const active = pathname === href;

//     return (
//       <Link
//         href={href}
//         onClick={() => setOpen(false)}
//         className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition
//           ${
//             active
//               ? "bg-orange-100 text-orange-600"
//               : "text-gray-600 hover:bg-gray-100 hover:text-orange-600"
//           }`}
//       >
//         <Icon size={18} />
//         {label}
//       </Link>
//     );
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Mobile overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
//         transform transition-transform duration-300
//         lg:static lg:translate-x-0
//         ${open ? "translate-x-0" : "-translate-x-full"}`}
//       >
//         {/* Logo */}
//         <div className="flex items-center justify-between border-b px-5 py-4">
//           <Image src="/logo.png" alt="Brilliko" width={60} height={60} />
//           <button
//             className="lg:hidden text-gray-600"
//             onClick={() => setOpen(false)}
//           >
//             <X />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-1">
//           <NavItem
//             href="/branch/dashboard"
//             label="Dashboard"
//             icon={LayoutDashboard}
//           />
//           <NavItem
//             href="/branch/inquiries"
//             label="Inquiries"
//             icon={Users}
//           />
//           <NavItem
//             href="/branch/staff"
//             label="Staff"
//             icon={CircleUserRound}
//           />
//         </nav>
//       </aside>

//       {/* Main */}
//       <div className="flex flex-1 flex-col">
//         {/* Header */}
//         <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
//           <div className="flex items-center gap-3">
//             <button
//               className="lg:hidden rounded-md p-1 text-gray-700 hover:bg-gray-100"
//               onClick={() => setOpen(true)}
//             >
//               <Menu />
//             </button>

//             <div>
//               <h1 className="text-sm font-semibold text-gray-800">
//                 {profile?.branches?.name || "Branch"}
//               </h1>
//               <p className="text-xs text-gray-500 capitalize">
//                 {profile?.role?.replace("_", " ")}
//               </p>
//             </div>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center gap-4">
//             <span className="hidden sm:block text-sm text-gray-600">
//               {profile?.full_name}
//             </span>

//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
//               <CircleUserRound size={18} />
//             </div>

//             <button
//               onClick={logout}
//               className="rounded-md p-2 text-red-600 hover:bg-red-50"
//               title="Logout"
//             >
//               <LogOut size={18} />
//             </button>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-1 p-4 sm:p-6">{children}</main>
//       </div>
//     </div>
//   );
// }


"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  CircleUserRound,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/* ---------------- TYPES ---------------- */

type Branch = {
  id: string;
  name: string;
};

type Profile = {
  full_name: string;
  role: string;
  branches: Branch | null;
};

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  pathname: string;
  onClick: () => void;
};

/* ---------------- NAV ITEM (OUTSIDE) ---------------- */

function NavItem({
  href,
  label,
  icon: Icon,
  pathname,
  onClick,
}: NavItemProps) {
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
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
}

/* ---------------- LAYOUT ---------------- */

export default function BranchLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role, branches(name)")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
        transform transition-transform duration-300
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Image src="/logo.png" alt="Brilliko" width={60} height={60} />
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
            pathname={pathname}
            onClick={() => setOpen(false)}
          />

          <NavItem
            href="/branch/inquiries"
            label="Inquiries"
            icon={Users}
            pathname={pathname}
            onClick={() => setOpen(false)}
          />

          <NavItem
            href="/branch/staff"
            label="Staff"
            icon={CircleUserRound}
            pathname={pathname}
            onClick={() => setOpen(false)}
          />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded-md p-1 text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>

            <div>
              <h1 className="text-sm font-semibold text-gray-800">
                {profile?.branches?.name || "Branch"}
              </h1>
              <p className="text-xs text-gray-500 capitalize">
                {profile?.role?.replace("_", " ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-600">
              {profile?.full_name}
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CircleUserRound size={18} />
            </div>

            <button
              onClick={logout}
              className="rounded-md p-2 text-gray-600 hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
