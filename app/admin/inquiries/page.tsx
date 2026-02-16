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


  useEffect(() => {
    const fetchBranches = async () => {
      const { data } = await supabase
        .from("branches")
        .select("id, name")
        .order("name");
  
      if (data) setBranches(data);
    };
    fetchBranches();
    // fetchInquiries();
  }, []);

  useEffect(() => {
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
  
      const { data , error} = await query;
  
      // if (data) setInquiries(data as Inquiry[]);
      if (error) {
        console.error("Error fetching inquiries:", error);
      } else if (data) {
        setInquiries(data as Inquiry[]);
      }
      setLoading(false);
    };
    fetchInquiries();
  }, [branchFilter, statusFilter]);

 





  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Inquiries Overview
        </h1>
        <p className="text-sm text-gray-500">
          Monitor inquiries across all branches in real time
        </p>
      </div>
  
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Total", value: inquiries.length },
          { label: "New", value: inquiries.filter(i => i.status === "NEW").length },
          { label: "Assigned", value: inquiries.filter(i => i.status === "ASSIGNED").length },
          { label: "Follow Up", value: inquiries.filter(i => i.status === "FOLLOW_UP").length },
          { label: "Confirmed", value: inquiries.filter(i => i.status === "ADMISSION_CONFIRMED").length },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border p-4"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="text-2xl font-semibold mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div> */}


<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
  {[
    { label: "Total", value: inquiries.length, color: "bg-orange-50 text-orange-700" },
    { label: "New", value: inquiries.filter(i => i.status === "NEW").length, color: "bg-blue-50 text-blue-700" },
    { label: "Assigned", value: inquiries.filter(i => i.status === "ASSIGNED").length, color: "bg-yellow-50 text-yellow-700" },
    { label: "Follow Up", value: inquiries.filter(i => i.status === "FOLLOW_UP").length, color: "bg-purple-50 text-purple-700" },
    { label: "Confirmed", value: inquiries.filter(i => i.status === "ADMISSION_CONFIRMED").length, color: "bg-green-50 text-green-700" },
  ].map((item, idx) => (
    <div
      key={idx}
      className={`${item.color} rounded-2xl shadow-lg border p-4 flex flex-col justify-center items-center`}
    >
      <p className="text-xs uppercase tracking-wide font-medium">{item.label}</p>
      <p className="text-2xl font-bold mt-1">{item.value}</p>
    </div>
  ))}
</div>
  
      {/* Filters */}
      <div className="sticky top-4 z-10 bg-white/80 backdrop-blur rounded-2xl shadow  p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="rounded-xl  px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
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
            className="rounded-xl  px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="NEW">New</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="ADMISSION_CONFIRMED">Confirmed</option>
            <option value="NOT_INTERESTED">Not Interested</option>
          </select>
        </div>
      </div>
  
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="bg-white rounded-3xl shadow-sm  overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-5 text-left">Student</th>
                <th className="p-5 text-center">Mobile</th>
                <th className="p-5 text-center">Branch</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-center">Created</th>
              </tr>
            </thead>
  
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Loading inquiries…
                  </td>
                </tr>
              )}
  
              {!loading && inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No inquiries found
                  </td>
                </tr>
              )}
  
              {inquiries.map((inq) => (
                <tr
                  key={inq.id}
                  className="border-t hover:bg-orange-50/40 transition"
                >
                  <td className="p-5 font-medium">
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="hover:underline text-gray-900"
                    >
                      {inq.student_name}
                    </Link>
                  </td>
  
                  <td className="p-5 text-center">
                    {inq.mobile_primary}
                  </td>
  
                  <td className="p-5 text-center text-gray-600">
                    {inq.branch?.name || "-"}
                  </td>
  
                  <td className="p-5 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                        inq.status === "NEW"
                          ? "bg-blue-100 text-blue-700"
                          : inq.status === "ASSIGNED"
                          ? "bg-yellow-100 text-yellow-700"
                          : inq.status === "FOLLOW_UP"
                          ? "bg-purple-100 text-purple-700"
                          : inq.status === "ADMISSION_CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {inq.status.replace("_", " ")}
                    </span>
                  </td>
  
                  <td className="p-5 text-center text-gray-500">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {inquiries.map((inq) => (
          <Link
            key={inq.id}
            href={`/admin/inquiries/${inq.id}`}
            className="bg-white rounded-2xl shadow-sm border p-4 space-y-3 active:scale-[0.98] transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{inq.student_name}</p>
                <p className="text-xs text-gray-500">
                  {inq.branch?.name || "-"}
                </p>
              </div>
  
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  inq.status === "NEW"
                    ? "bg-blue-100 text-blue-700"
                    : inq.status === "ASSIGNED"
                    ? "bg-yellow-100 text-yellow-700"
                    : inq.status === "FOLLOW_UP"
                    ? "bg-purple-100 text-purple-700"
                    : inq.status === "ADMISSION_CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {inq.status.replace("_", " ")}
              </span>
            </div>
  
            <div className="flex justify-between text-sm text-gray-600">
              <span>{inq.mobile_primary}</span>
              <span>
                {new Date(inq.created_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
  
}

