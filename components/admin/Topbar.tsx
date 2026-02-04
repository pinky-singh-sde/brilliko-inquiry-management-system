// "use client";

// import { supabase } from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function Topbar() {
//   // const router = useRouter();

//   const logout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = "/auth/login";
//   };

//   return (
//     <header className="h-14 bg-white border-b flex items-center justify-between px-6">
//       <h1 className="font-semibold text-orange-600">
//         Super Admin Panel
//       </h1>

//       <button
//         onClick={logout}
//         className="text-sm text-orange-800 hover:underline"
//       >
//         Logout
//       </button>
//     </header>
//   );
// }



"use client";

import { supabase } from "@/lib/supabaseClient";
import { LogOut, ShieldCheck } from "lucide-react";

export default function Topbar() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3 pl-10 md:pl-0">
        <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-orange-600" />
        </div>

        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-gray-900">
            Super Admin Panel
          </h1>
          <p className="text-xs text-gray-500">
            Institute Management System
          </p>
        </div>
      </div>

      {/* Right */}
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
