"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Inquiry = {
  id: string;
  student_name: string;
  mobile_primary: string;
  course_interested: string | null;
  lead_source: string | null;
  status: string;
  created_at: string;
};

export default function BranchInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInquiries = async () => {
      // 1️⃣ Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 2️⃣ Get branch_id from profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("branch_id")
        .eq("id", user.id)
        .single();

      if (error || !profile?.branch_id) return;

      // 3️⃣ Fetch inquiries of that branch
      const { data } = await supabase
        .from("inquiries")
        .select(`
          id,
          student_name,
          mobile_primary,
          course_interested,
          lead_source,
          status,
          created_at
        `)
        .eq("branch_id", profile.branch_id)
        .order("created_at", { ascending: false });

      setInquiries(data || []);
      setLoading(false);
    };

    loadInquiries();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Inquiries</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Course</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && inquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No inquiries found
                </td>
              </tr>
            )}

            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-t">
                <td className="p-3">
                  <Link
                    href={`/branch/inquiries/${inq.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {inq.student_name}
                  </Link>
                </td>
                <td className="p-3 text-center">
                  {inq.mobile_primary}
                </td>
                <td className="p-3 text-center">
                  {inq.course_interested || "-"}
                </td>
                <td className="p-3 text-center">
                  {inq.lead_source || "-"}
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100">
                    {inq.status}
                  </span>
                </td>
                <td className="p-3 text-center text-xs">
                  {new Date(inq.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
