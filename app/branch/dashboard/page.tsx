// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function BranchDashboard() {
//   const [branch, setBranch] = useState<any>(null);

//   useEffect(() => {
//     const load = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("branch_id, branches(name)")
//         .eq("id", user.id)
//         .single();

//       setBranch(profile?.branches);
//     };

//     load();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">
//         Branch Dashboard
//       </h1>

//       {branch ? (
//         <div className="bg-white p-4 rounded shadow">
//           <p className="text-gray-600">Branch Name</p>
//           <p className="text-xl font-medium">{branch.name}</p>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

    // 1️⃣ Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // 2️⃣ Get branch_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("branch_id")
      .eq("id", user.id)
      .single();

    if (!profile?.branch_id) return;

    const branchId = profile.branch_id;

    // 3️⃣ Total inquiries
    const { count: total } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("branch_id", branchId);

    // 4️⃣ Status counts helper
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
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Branch Dashboard</h1>

      {/* 📊 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total Inquiries" value={counts.total} />
        <StatCard title="New" value={counts.NEW} />
        <StatCard title="Assigned" value={counts.ASSIGNED} />
        <StatCard title="Follow Ups" value={counts.FOLLOW_UP} />
        <StatCard
          title="Admissions"
          value={counts.ADMISSION_CONFIRMED}
        />
        <StatCard
          title="Not Interested"
          value={counts.NOT_INTERESTED}
        />
      </div>

      {/* ⚡ Actions */}
      <div className="flex gap-4">
        <Link
          href="/branch/inquiries"
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          View Inquiries
        </Link>

        <Link
          href="/branch/staff"
          className="bg-gray-800 text-white px-4 py-2 rounded"
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
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

