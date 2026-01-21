"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Inquiry = {
  id: string;
  student_name: string;
  mobile_primary: string;
  status: string;
  created_at: string;
  branch: {
    name: string;
  } | null;
};

type Branch = {
  id: string;
  name: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch branches
  const fetchBranches = async () => {
    const { data } = await supabase
      .from("branches")
      .select("id, name")
      .order("name");

    if (data) setBranches(data);
  };

  // 🔹 Fetch inquiries
  const fetchInquiries = async () => {
    setLoading(true);

    let query = supabase
      .from("inquiries")
      .select(`
        id,
        student_name,
        mobile_primary,
        status,
        created_at,
        branch:branches(name)
      `)
      .order("created_at", { ascending: false });

    if (branchFilter) {
      query = query.eq("branch_id", branchFilter);
    }

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data } = await query;

    if (data) setInquiries(data as Inquiry[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
    fetchInquiries();
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [branchFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Inquiries</h1>

      {/* 🔍 Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex gap-4">
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="NEW">NEW</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="FOLLOW_UP">FOLLOW_UP</option>
          <option value="ADMISSION_CONFIRMED">
            ADMISSION_CONFIRMED
          </option>
          <option value="NOT_INTERESTED">NOT_INTERESTED</option>
        </select>
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Branch</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No inquiries found
                </td>
              </tr>
            )}

            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-t">
                <td className="p-3">
                  <Link
                    href={`/admin/inquiries/${inq.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {inq.student_name}
                  </Link>
                </td>

                <td className="p-3 text-center">
                  {inq.mobile_primary}
                </td>

                <td className="p-3 text-center">
                  {inq.branch?.name ?? "-"}
                </td>

                <td className="p-3 text-center">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100">
                    {inq.status}
                  </span>
                </td>

                <td className="p-3 text-center">
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
