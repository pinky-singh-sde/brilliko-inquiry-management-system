"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Eye, ClipboardList } from "lucide-react";

type Inquiry = {
  id: string;
  student_name: string;
  mobile_primary: string;
  course_interested: string | null;
  status: string;
  created_at: string;
};

export default function ReceptionInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
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

    const { data, error } = await supabase
      .from("inquiries")
      .select(`
        id,
        student_name,
        mobile_primary,
        course_interested,
        status,
        created_at
      `)
      .eq("branch_id", profile.branch_id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setInquiries(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <ClipboardList size={18} />
        Loading inquiries...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList size={22} />
            Reception Inquiries
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            All student inquiries for your branch
          </p>
        </div>

        <Link
          href="/reception/inquiries/new"
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition shadow-sm"
        >
          <Plus size={16} />
          New Inquiry
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left font-medium">Student</th>
              <th className="p-4 text-center font-medium">Mobile</th>
              <th className="p-4 text-center font-medium">Course</th>
              <th className="p-4 text-center font-medium">Status</th>
              <th className="p-4 text-center font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">
                  {inq.student_name}
                </td>

                <td className="p-4 text-center text-gray-700">
                  {inq.mobile_primary}
                </td>

                <td className="p-4 text-center text-gray-700">
                  {inq.course_interested ?? "-"}
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      inq.status === "NEW"
                        ? "bg-blue-100 text-blue-700"
                        : inq.status === "ASSIGNED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {inq.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <Link
                    href={`/reception/inquiries/${inq.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {inquiries.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-500"
                >
                  No inquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
