"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // if (error) {
    //   setError(error.message);
    //   setLoading(false);
    //   return;
    // }

    if (error || !data.user) {
    setError(error?.message || "Login failed");
    setLoading(false);
    return;
  }

    // fetch profile
    const { data: profile , error: profileError} = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

      if (profileError || !profile) {
    setError("User profile not found. Contact Super Admin.");
    setLoading(false);
    return;
  }


    // role-based redirect
    // if (profile?.role === "SUPER_ADMIN") router.push("/admin/dashboard");
    // else if (profile?.role === "BRANCH_ADMIN") router.push("/branch/dashboard");
    // else if (profile?.role === "RECEPTIONIST")
    //   router.push("/reception/inquiries");
    // else if (profile?.role === "COUNSELOR")
    //   router.push("/counselor/inquiries");
    // else router.push("/unauthorized");



      // role-based redirect
  switch (profile.role) {
    case "SUPER_ADMIN":
      router.push("/admin/dashboard");
      break;
    case "BRANCH_ADMIN":
      router.push("/branch/dashboard");
      break;
    case "RECEPTIONIST":
      router.push("/reception/inquiries");
      break;
    case "COUNSELOR":
      router.push("/counselor/inquiries");
      break;
    default:
      router.push("/unauthorized");
  }


    setLoading(false);

  };

  return (
    <div className="min-h-screen bg-[#f6f1ee] flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white w-[420px] rounded-xl shadow-lg p-8"
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
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium"
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
