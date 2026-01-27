


"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Staff = {
  id: string;
  full_name: string;
  role: "COUNSELOR" | "RECEPTIONIST";
  is_active: boolean;
  branches: {
    name: string;
  } | null;
};

export default function BranchStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStaff = async () => {
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

    const { data } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        is_active,
        branches ( name )
      `)
      .eq("branch_id", profile.branch_id)
      .in("role", ["COUNSELOR", "RECEPTIONIST"])
      .order("created_at");

    setStaff(data || []);
    setLoading(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from("profiles")
      .update({ is_active: !current })
      .eq("id", id);

    loadStaff();
  };

  useEffect(() => {
    loadStaff();
  }, []);

  if (loading) return <p>Loading staff...</p>;

  // return (
  //   <div className="space-y-6 max-w-5xl">
  //     <div className="flex justify-between items-center">
  //       <h2 className="text-2xl font-semibold">Branch Staff</h2>

  //       <Link
  //         href="/branch/create-staff"
  //         className="bg-orange-600 text-white px-4 py-2 rounded"
  //       >
  //         + Add Staff
  //       </Link>
  //     </div>

  //     <div className="bg-white rounded-lg shadow overflow-hidden">
  //       <table className="w-full text-sm">
  //         <thead className="bg-gray-100">
  //           <tr>
  //             <th className="p-3 text-left">Name</th>
  //             <th className="p-3 text-center">Role</th>
  //             <th className="p-3 text-center">Branch</th>
  //             <th className="p-3 text-center">Status</th>
  //             <th className="p-3 text-center">Action</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {staff.map((s) => (
  //             <tr key={s.id} className="border-t">
  //               <td className="p-3">{s.full_name}</td>
  //               <td className="p-3 text-center">{s.role}</td>
  //               <td className="p-3 text-center">
  //                 {s.branches?.name}
  //               </td>
  //               <td className="p-3 text-center">
  //                 {s.is_active ? "Active" : "Inactive"}
  //               </td>
  //               <td className="p-3 text-center space-x-3">
  //                 <Link
  //                   href={`/branch/staff/${s.id}/edit`}
  //                   className="text-blue-600 hover:underline"
  //                 >
  //                   Edit
  //                 </Link>

  //                 <button
  //                   onClick={() =>
  //                     toggleActive(s.id, s.is_active)
  //                   }
  //                   className="text-red-600 hover:underline"
  //                 >
  //                   {s.is_active ? "Deactivate" : "Activate"}
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );









  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Branch Staff
          </h2>
          <p className="text-sm text-gray-500">
            Manage counselors and receptionists for this branch
          </p>
        </div>
  
        <Link
          href="/branch/create-staff"
          className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition"
        >
          + Add Staff
        </Link>
      </div>
  
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Branch</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
  
          <tbody>
            {staff.map((s) => (
              <tr
                key={s.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-800">
                  {s.full_name}
                </td>
  
                <td className="p-4 text-center">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {s.role}
                  </span>
                </td>
  
                <td className="p-4 text-center text-gray-600">
                  {s.branches?.name}
                </td>
  
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      s.is_active
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
  
                <td className="p-4 text-center space-x-4">
                  <Link
                    href={`/branch/staff/${s.id}/edit`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
  
                  <button
                    onClick={() =>
                      toggleActive(s.id, s.is_active)
                    }
                    className="text-sm font-medium text-orange-600 hover:underline"
                  >
                    {s.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {staff.map((s) => (
          <div
            key={s.id}
            className="rounded-xl bg-white shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">
                  {s.full_name}
                </p>
                <p className="text-xs text-gray-500">
                  {s.branches?.name}
                </p>
              </div>
  
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  s.is_active
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {s.is_active ? "Active" : "Inactive"}
              </span>
            </div>
  
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {s.role}
              </span>
  
              <div className="space-x-4">
                <Link
                  href={`/branch/staff/${s.id}/edit`}
                  className="text-sm text-blue-600 font-medium"
                >
                  Edit
                </Link>
  
                <button
                  onClick={() =>
                    toggleActive(s.id, s.is_active)
                  }
                  className="text-sm text-orange-600 font-medium"
                >
                  {s.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}
