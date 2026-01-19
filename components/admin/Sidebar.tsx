"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menu = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Branches", href: "/admin/branches" },
  { name: "Users", href: "/admin/users" },
  { name: "Inquiries", href: "/admin/inquiries" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r">
      {/* <div className="p-6 font-bold text-xl text-orange-600">
        Brilliko Admin
      </div> */}
      <Image
          src="/logo.png"
          alt="Brilliko Institute"
          width={90}
          height={90}
          className="mx-10 mb-4 transition-transform duration-300 hover:scale-110"
        />

      <nav className="px-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium
              ${
                pathname === item.href
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
