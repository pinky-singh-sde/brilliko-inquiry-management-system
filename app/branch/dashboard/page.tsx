// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";

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

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadCounts();
//   }, []);

//   const loadCounts = async () => {
//     setLoading(true);

//     // 1️⃣ Get current user
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     // 2️⃣ Get branch_id
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("branch_id")
//       .eq("id", user.id)
//       .single();

//     if (!profile?.branch_id) return;

//     const branchId = profile.branch_id;

//     // 3️⃣ Total inquiries
//     const { count: total } = await supabase
//       .from("inquiries")
//       .select("*", { count: "exact", head: true })
//       .eq("branch_id", branchId);

//     // 4️⃣ Status counts helper
//     const countByStatus = async (status: string) => {
//       const { count } = await supabase
//         .from("inquiries")
//         .select("*", { count: "exact", head: true })
//         .eq("branch_id", branchId)
//         .eq("status", status);

//       return count || 0;
//     };

//     setCounts({
//       total: total || 0,
//       NEW: await countByStatus("NEW"),
//       ASSIGNED: await countByStatus("ASSIGNED"),
//       FOLLOW_UP: await countByStatus("FOLLOW_UP"),
//       ADMISSION_CONFIRMED: await countByStatus("ADMISSION_CONFIRMED"),
//       NOT_INTERESTED: await countByStatus("NOT_INTERESTED"),
//     });

//     setLoading(false);
//   };

//   if (loading) {
//     return <p className="text-gray-500">Loading dashboard...</p>;
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold">Branch Dashboard</h1>

//       {/* 📊 Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         <StatCard title="Total Inquiries" value={counts.total} />
//         <StatCard title="New" value={counts.NEW} />
//         <StatCard title="Assigned" value={counts.ASSIGNED} />
//         <StatCard title="Follow Ups" value={counts.FOLLOW_UP} />
//         <StatCard
//           title="Admissions"
//           value={counts.ADMISSION_CONFIRMED}
//         />
//         <StatCard
//           title="Not Interested"
//           value={counts.NOT_INTERESTED}
//         />
//       </div>

//       {/* ⚡ Actions */}
//       <div className="flex gap-4">
//         <Link
//           href="/branch/inquiries"
//           className="bg-orange-600 text-white px-4 py-2 rounded"
//         >
//           View Inquiries
//         </Link>

//         <Link
//           href="/branch/staff"
//           className="bg-gray-800 text-white px-4 py-2 rounded"
//         >
//           Manage Staff
//         </Link>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: number;
// }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-2xl font-semibold">{value}</p>
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
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type Counts = {
  total: number;
  NEW: number;
  ASSIGNED: number;
  FOLLOW_UP: number;
  ADMISSION_CONFIRMED: number;
  NOT_INTERESTED: number;
};

export default function BranchDashboard() {
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    NEW: 0,
    ASSIGNED: 0,
    FOLLOW_UP: 0,
    ADMISSION_CONFIRMED: 0,
    NOT_INTERESTED: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("branch_id")
      .eq("id", user.id)
      .single();

    if (!profile?.branch_id) return;
    const branchId = profile.branch_id;

    const { count: total } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("branch_id", branchId);

    const countByStatus = async (status: string) => {
      const { count } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("branch_id", branchId)
        .eq("status", status);
      return count || 0;
    };

    setCounts({
      total: total || 0,
      NEW: await countByStatus("NEW"),
      ASSIGNED: await countByStatus("ASSIGNED"),
      FOLLOW_UP: await countByStatus("FOLLOW_UP"),
      ADMISSION_CONFIRMED: await countByStatus("ADMISSION_CONFIRMED"),
      NOT_INTERESTED: await countByStatus("NOT_INTERESTED"),
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 🔷 Header */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 p-2 sm:p-3 text-white shadow-lg">
        <h1 className="text-xl font-semibold">
          Branch Dashboard
        </h1>
        <p className="text-sm text-orange-100 mt-1">
          Real-time inquiry overview
        </p>
      </div>

      {/* 📊 Responsive Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Inquiries" value={counts.total} icon={Users} />
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

      {/* ⚡ Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/branch/inquiries"
          className="flex justify-center rounded-lg bg-orange-600 px-6 py-3 text-white font-medium shadow hover:bg-orange-700 transition"
        >
          View Inquiries
        </Link>

        <Link
          href="/branch/staff"
          className="flex justify-center rounded-lg bg-gray-900 px-6 py-3 text-white font-medium shadow hover:bg-gray-800 transition"
        >
          Manage Staff
        </Link>
      </div>
    </div>
  );
}



function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* Accent Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white opacity-0 group-hover:opacity-100 transition" />

      {/* Left Accent Bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-600" />

      <div className="relative flex items-center justify-between">
        {/* Text */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            {title}
          </p>
          <p className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        {/* Icon */}
        <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-inner">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
