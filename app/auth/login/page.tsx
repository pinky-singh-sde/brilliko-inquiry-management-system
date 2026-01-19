// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { supabase } from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     // if (error) {
//     //   setError(error.message);
//     //   setLoading(false);
//     //   return;
//     // }

//     if (error || !data.user) {
//       setError(error?.message || "Login failed");
//       setLoading(false);
//       return;
//     }

//     // await supabase.auth.getSession();

//     const { data: sessionData } = await supabase.auth.getSession();

//   if (!sessionData.session) {
//     setError("Session not established");
//     setLoading(false);
//     return;
//   }

//     // fetch profile
//     const { data: profile, error: profileError } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", data.user.id)
//       .single();

//     if (profileError || !profile) {
//       setError("User profile not found. Contact Super Admin.");
//       setLoading(false);
//       return;
//     }

//     if (!profile.role) {
//       setError("Role not assigned. Contact Super Admin.");
//       setLoading(false);
//       return;
//     }

   

//     // 🔥 FORCE FULL PAGE RELOAD (REQUIRED)
// window.location.href =
//   profile.role === "SUPER_ADMIN"
//     ? "/admin/dashboard"
//     : profile.role === "BRANCH_ADMIN"
//     ? "/branch/dashboard"
//     : profile.role === "RECEPTIONIST"
//     ? "/reception/inquiries"
//     : profile.role === "COUNSELOR"
//     ? "/counselor/inquiries"
//     : "/unauthorized";


//     setLoading(false);

//   };

//   return (
//     <div className="min-h-screen bg-[#f6f1ee] flex items-center justify-center">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white w-[420px] rounded-xl shadow-lg p-8"
//       >
//         <div className="flex justify-center mb-4">
//           <Image src="/logo.png" alt="logo" width={70} height={70} />
//         </div>

//         <h2 className="text-center text-lg font-semibold mb-6">
//           Admin Login
//         </h2>

//         <label className="text-sm font-medium">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border rounded-md px-3 py-2 mt-1 mb-4"
//           placeholder="admin@brilliko.com"
//           required
//         />

//         <label className="text-sm font-medium">Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border rounded-md px-3 py-2 mt-1 mb-4"
//           placeholder="Enter your password"
//           required
//         />

//         {error && (
//           <p className="text-red-600 text-sm mb-3">{error}</p>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p className="text-xs text-gray-400 text-center mt-6">
//           © 2026 Brilliko Institute
//         </p>
//       </form>
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    // 1️⃣ Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setError(error?.message || "Invalid login credentials");
      setLoading(false);
      return;
    }

    // 2️⃣ Fetch role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile?.role) {
      setError("Role not assigned. Contact Super Admin.");
      setLoading(false);
      return;
    }

    // 3️⃣ FULL reload (required for middleware)
    const roleRedirectMap: Record<string, string> = {
      SUPER_ADMIN: "/admin/dashboard",
      BRANCH_ADMIN: "/branch/dashboard",
      RECEPTIONIST: "/reception/inquiries",
      COUNSELOR: "/counselor/inquiries",
    };

    window.location.href = roleRedirectMap[profile.role] ?? "/unauthorized";
  };

  return (
    <div className="min-h-screen bg-[#f6f1ee] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white w-105 rounded-xl shadow-lg p-8"
      >
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="logo" width={70} height={70} />
        </div>

        <h2 className="text-center text-lg font-semibold mb-6">
          Admin Login
        </h2>

        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mt-1 mb-4"
          placeholder="admin@brilliko.com"
          required
        />

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mt-1 mb-4"
          placeholder="Enter your password"
          required
        />

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 Brilliko Institute
        </p>
      </form>
    </div>
  );
}
