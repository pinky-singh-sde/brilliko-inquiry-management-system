"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Users, PhoneCall, CheckCircle } from "lucide-react";

type Stats = {
  total: number;
  followUp: number;
  confirmed: number;
};

export default function CounselorDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    followUp: 0,
    confirmed: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const [totalRes, followUpRes, confirmedRes] = await Promise.all([
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("assigned_counselor_id", user.id),

      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("assigned_counselor_id", user.id)
        .eq("status", "FOLLOW_UP"),

      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("assigned_counselor_id", user.id)
        .eq("status", "ADMISSION_CONFIRMED"),
    ]);

    setStats({
      total: totalRes.count ?? 0,
      followUp: followUpRes.count ?? 0,
      confirmed: confirmedRes.count ?? 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold">
        Counsellor  Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your assigned inquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total Assigned"
          value={stats.total}
          icon={Users}
        />
        <StatCard
          label="Follow Ups"
          value={stats.followUp}
          icon={PhoneCall}
        />
        <StatCard
          label="Admissions"
          value={stats.confirmed}
          icon={CheckCircle}
        />
      </div>
    </div>
  );
}

/* ---------- UI Component ---------- */

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: any;
}) {
  return (
    <div
      className="bg-white p-6 rounded-2xl border
                 shadow-sm hover:shadow-lg
                 transition-all duration-300
                 hover:-translate-y-1
                 flex items-center justify-between"
    >
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold mt-1">
          {value}
        </p>
      </div>

      <div
        className="w-12 h-12 rounded-full
                   bg-blue-50 text-blue-600
                   flex items-center justify-center"
      >
        <Icon size={22} />
      </div>
    </div>
  );
}
