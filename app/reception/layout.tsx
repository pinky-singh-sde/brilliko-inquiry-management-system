// "use client";

// import { ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import Link from "next/link";
// import { LogOut, LayoutDashboard } from "lucide-react";

// export default function ReceptionLayout({ children }: { children: ReactNode }) {
//   const router = useRouter();

//   const logout = async () => {
//     await supabase.auth.signOut();
//     // router.push("/login");
//     window.location.href = "/auth/login";
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           {/* Title */}
//           <Link
//             href="/reception/dashboard"
//             className="flex items-center gap-2 text-gray-800 hover:text-orange-500 transition"
//           >
//             <LayoutDashboard size={20} />
//             <h1 className="text-lg font-semibold">
//               Reception Dashboard
//             </h1>
//           </Link>

//           {/* Logout */}
//           <button
//             onClick={logout}
//             className="flex items-center gap-2 bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm cursor-pointer"
//           >
//             <LogOut size={16} />
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Page content */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }



"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, LayoutDashboard } from "lucide-react";

type Profile = {
  full_name: string;
  role: string;
};

export default function ReceptionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
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

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left: Title */}
          <Link
            href="/reception/dashboard"
            className="flex items-center gap-2 text-gray-800 hover:text-orange-500 transition"
          >
            <LayoutDashboard size={20} />
            <h1 className="text-lg font-semibold">
              Reception Dashboard
            </h1>
          </Link>

          {/* Right: Profile + Logout */}
          <div className="flex items-center gap-4">
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-orange-500 text-white
                           flex items-center justify-center
                           text-sm font-semibold uppercase"
              >
                {profile?.full_name?.charAt(0) ?? "R"}
              </div>

              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-medium">
                  {profile?.full_name ?? "Reception"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role?.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl min-h-[calc(100vh-80px)] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm  p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
