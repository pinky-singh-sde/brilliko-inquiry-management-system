
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Inquiry = {
  id: string;
  student_name: string;
  mobile_primary: string;
  course_interested: string | null;
  status: string;
  updated_at: string;
};

const STATUSES = [
  "ASSIGNED",
  "FOLLOW_UP",
  "ADMISSION_CONFIRMED",
  "NOT_INTERESTED",
];

export default function CounselorInquiriesPage() {
  const [activeStatus, setActiveStatus] = useState("ASSIGNED");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadInquiries() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("inquiries")
      .select(
        "id, student_name, mobile_primary, course_interested, status, updated_at"
      )
      .eq("assigned_counselor_id", user.id)
      .eq("status", activeStatus)
      .order("updated_at", { ascending: false });

    setInquiries(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadInquiries();
  }, [activeStatus]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">My Inquiries</h1>

      {/* STATUS TABS */}
      <div className="flex gap-2 overflow-x-auto border-b pb-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition
              ${
                activeStatus === s
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* LOADING / EMPTY */}
      {loading && (
        <p className="text-center text-gray-500 py-10">
          Loading inquiries...
        </p>
      )}

      {!loading && inquiries.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No inquiries found
        </p>
      )}

      {/* DESKTOP TABLE */}
      {!loading && inquiries.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-center">Mobile</th>
                <th className="p-4 text-center">Course</th>
                <th className="p-4 text-center">Last Update</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">
                    <Link
                      href={`/counselor/inquiries/${inq.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {inq.student_name}
                    </Link>
                  </td>

                  <td className="p-4 text-center">
                    {inq.mobile_primary}
                  </td>

                  <td className="p-4 text-center">
                    {inq.course_interested ?? "-"}
                  </td>

                  <td className="p-4 text-center text-gray-500">
                    {new Date(inq.updated_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">
                    <Link
                      href={`/counselor/inquiries/${inq.id}`}
                      className="text-orange-600 font-medium hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARDS */}
      {!loading && inquiries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {inquiries.map((inq) => (
            <Link
              key={inq.id}
              href={`/counselor/inquiries/${inq.id}`}
              className="bg-white rounded-xl shadow-sm p-4 space-y-2
                         hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">
                  {inq.student_name}
                </h3>

                <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                  {inq.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                 {inq.mobile_primary}
              </p>

              <p className="text-sm text-gray-600">
                 {inq.course_interested ?? "-"}
              </p>

              <p className="text-xs text-gray-400">
                Updated: {new Date(inq.updated_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
