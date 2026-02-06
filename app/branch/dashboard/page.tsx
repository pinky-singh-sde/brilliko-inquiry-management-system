
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Users,
//   UserPlus,
//   ListChecks,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Activity, ShieldCheck, MapPin 
// } from "lucide-react";
// import { supabase } from "@/lib/supabaseClient";

// /* ---------------- TYPES ---------------- */

// type Counts = {
//   total: number;
//   NEW: number;
//   ASSIGNED: number;
//   FOLLOW_UP: number;
//   ADMISSION_CONFIRMED: number;
//   NOT_INTERESTED: number;
// };

// export default function BranchDashboard() {
//   const [counts, setCounts] = useState<Counts>({
//     total: 0,
//     NEW: 0,
//     ASSIGNED: 0,
//     FOLLOW_UP: 0,
//     ADMISSION_CONFIRMED: 0,
//     NOT_INTERESTED: 0,
//   });

//   const [branchName, setBranchName] = useState<string>("Branch");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadCounts();
//   }, []);

//   const loadCounts = async () => {
//     setLoading(true);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("branch_id, branches(name)")
//       .eq("id", user.id)
//       .single();

//     if (!profile?.branch_id) return;

//     setBranchName(profile.branches?.name || "Branch");

//     const branchId = profile.branch_id;

//     const count = (status?: string) =>
//       supabase
//         .from("inquiries")
//         .select("*", { count: "exact", head: true })
//         .eq("branch_id", branchId)
//         .eq(status ? "status" : "branch_id", status ?? branchId);

//     const [
//       total,
//       NEW,
//       ASSIGNED,
//       FOLLOW_UP,
//       ADMISSION_CONFIRMED,
//       NOT_INTERESTED,
//     ] = await Promise.all([
//       count(),
//       count("NEW"),
//       count("ASSIGNED"),
//       count("FOLLOW_UP"),
//       count("ADMISSION_CONFIRMED"),
//       count("NOT_INTERESTED"),
//     ]);

//     setCounts({
//       total: total.count || 0,
//       NEW: NEW.count || 0,
//       ASSIGNED: ASSIGNED.count || 0,
//       FOLLOW_UP: FOLLOW_UP.count || 0,
//       ADMISSION_CONFIRMED: ADMISSION_CONFIRMED.count || 0,
//       NOT_INTERESTED: NOT_INTERESTED.count || 0,
//     });

//     setLoading(false);
//   };

//   /* ---------------- LOADING ---------------- */

//   if (loading) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center">
//         <div className="rounded-xl bg-white px-6 py-4 text-gray-600 shadow">
//           Loading dashboard…
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* 🔷 Header */}
//       <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 p-4 sm:p-6 text-white shadow-lg">
//         <h1 className="text-xl sm:text-2xl font-semibold">
//           {branchName}
//         </h1>
//         <p className="mt-1 text-sm text-orange-100">
//           Inquiry overview for your branch
//         </p>
//       </div>

//       {/* 📊 Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         <StatCard title="Total" value={counts.total} icon={Users} />
//         <StatCard title="New" value={counts.NEW} icon={UserPlus} />
//         <StatCard title="Assigned" value={counts.ASSIGNED} icon={ListChecks} />
//         <StatCard title="Follow Ups" value={counts.FOLLOW_UP} icon={Clock} />
//         <StatCard
//           title="Admissions"
//           value={counts.ADMISSION_CONFIRMED}
//           icon={CheckCircle}
//         />
//         <StatCard
//           title="Not Interested"
//           value={counts.NOT_INTERESTED}
//           icon={XCircle}
//         />
//       </div>

//       {/* ⚡ Actions */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <Link
//           href="/branch/inquiries"
//           className="flex justify-center rounded-lg bg-orange-600 px-6 py-3 text-white font-medium shadow hover:bg-orange-700 transition"
//         >
//           View Inquiries
//         </Link>

//         <Link
//           href="/branch/staff"
//           className="flex justify-center rounded-lg bg-gray-900 px-6 py-3 text-white font-medium shadow hover:bg-gray-800 transition"
//         >
//           Manage Staff
//         </Link>
//       </div>
//     </div>
//   );
// }

// /* ---------------- STAT CARD ---------------- */

// function StatCard({
//   title,
//   value,
//   icon: Icon,
// }: {
//   title: string;
//   value: number;
//   icon: React.ElementType;
// }) {
//   return (
//     <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white opacity-0 group-hover:opacity-100 transition" />
//       <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-600" />

//       <div className="relative flex items-center justify-between">
//         <div>
//           <p className="text-xs sm:text-sm font-medium text-gray-500">
//             {title}
//           </p>
//           <p className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900">
//             {value}
//           </p>
//         </div>

//         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
//           <Icon size={22} />
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ListChecks,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  ShieldCheck,
  MapPin,
  ArrowRight,
  UsersRound,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/* ---------------- TYPES ---------------- */

type Counts = {
  total: number;
  NEW: number;
  ASSIGNED: number;
  FOLLOW_UP: number;
  ADMISSION_CONFIRMED: number;
  NOT_INTERESTED: number;
};

/* ---------------- META CHIP ---------------- */

function MetaChip({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm backdrop-blur-md">
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function BranchDashboard() {
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    NEW: 0,
    ASSIGNED: 0,
    FOLLOW_UP: 0,
    ADMISSION_CONFIRMED: 0,
    NOT_INTERESTED: 0,
  });

  const [branchName, setBranchName] = useState("Branch");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("branch_id, branches(name)")
      .eq("id", user.id)
      .single();

    if (!profile?.branch_id) return;

    const branchId = profile.branch_id;
    setBranchName(profile.branches?.name || "Branch");

    const getCount = async (status?: string) => {
      let query = supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("branch_id", branchId);

      if (status) query = query.eq("status", status);

      const { count } = await query;
      return count || 0;
    };

    const [
      total,
      NEW,
      ASSIGNED,
      FOLLOW_UP,
      ADMISSION_CONFIRMED,
      NOT_INTERESTED,
    ] = await Promise.all([
      getCount(),
      getCount("NEW"),
      getCount("ASSIGNED"),
      getCount("FOLLOW_UP"),
      getCount("ADMISSION_CONFIRMED"),
      getCount("NOT_INTERESTED"),
    ]);

    setCounts({
      total,
      NEW,
      ASSIGNED,
      FOLLOW_UP,
      ADMISSION_CONFIRMED,
      NOT_INTERESTED,
    });

    setLoading(false);
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="rounded-xl bg-white px-6 py-4 text-gray-600 shadow">
          Loading dashboard…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 🔥 HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-black/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-100 text-sm">
              <MapPin className="h-4 w-4" />
              Active Branch
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {branchName}
            </h1>

            <p className="max-w-md text-sm sm:text-base text-orange-100/90">
              Track inquiries, follow-ups, and admissions in real time
            </p>
          </div>

          <div className="flex gap-3">
            <MetaChip icon={Activity} label="Live Stats" />
            <MetaChip icon={ShieldCheck} label="Branch Admin" />
          </div>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total" value={counts.total} icon={Users} />
        <StatCard title="New" value={counts.NEW} icon={UserPlus} />
        <StatCard title="Assigned" value={counts.ASSIGNED} icon={ListChecks} />
        <StatCard title="Follow Ups" value={counts.FOLLOW_UP} icon={Clock} />
        <StatCard
          title="Admissions"
          value={counts.ADMISSION_CONFIRMED}
          icon={CheckCircle}
        />
        <StatCard
          title="Not Interested"
          value={counts.NOT_INTERESTED}
          icon={XCircle}
        />
      </div>

      {/* ⚡ ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/branch/inquiries"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-medium text-white shadow hover:bg-orange-700 transition"
        >
          View Inquiries
          <ArrowRight size={18} />
        </Link>

        <Link
          href="/branch/staff"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-800 shadow-sm hover:bg-gray-50 transition"
        >
          <UsersRound size={18} />
          Manage Staff
        </Link>
      </div>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
