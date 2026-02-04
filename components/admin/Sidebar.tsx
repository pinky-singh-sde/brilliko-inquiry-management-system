// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";

// const menu = [
//   { name: "Dashboard", href: "/admin/dashboard" },
//   { name: "Branches", href: "/admin/branches" },
//   { name: "Users", href: "/admin/users" },
//   { name: "Inquiries", href: "/admin/inquiries" },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="w-64 bg-white border-r">
   
//       <Image
//           src="/logo.png"
//           alt="Brilliko Institute"
//           width={90}
//           height={90}
//           className="mx-10 mb-4 transition-transform duration-300 hover:scale-110"
//         />

//       <nav className="px-4 space-y-2">
//         {menu.map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={`block px-4 py-2 rounded-md text-sm font-medium
//               ${
//                 pathname === item.href
//                   ? "bg-orange-100 text-orange-700"
//                   : "text-gray-600 hover:bg-gray-100"
//               }
//             `}
//           >
//             {item.name}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Branches", href: "/admin/branches" },
  { name: "Users", href: "/admin/users" },
  { name: "Inquiries", href: "/admin/inquiries" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger (controlled from topbar area usually) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white border rounded-lg p-2 shadow"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-screen w-64 bg-white border-r
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Close (mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b">
          <Image
            src="/logo.png"
            alt="Brilliko Institute"
            width={90}
            height={90}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Menu */}
        <nav className="px-4 py-4 space-y-1">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition
                  ${
                    active
                      ? "bg-orange-100 text-orange-700 border-l-4 border-orange-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
