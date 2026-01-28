// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
// import { Plus, Eye, ClipboardList } from "lucide-react";

// type Inquiry = {
//   id: string;
//   student_name: string;
//   mobile_primary: string;
//   course_interested: string | null;
//   status: string;
//   created_at: string;
// };

// export default function ReceptionInquiriesPage() {
//   const [inquiries, setInquiries] = useState<Inquiry[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadInquiries = async () => {
//     setLoading(true);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) return;

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("branch_id")
//       .eq("id", user.id)
//       .single();

//     if (!profile?.branch_id) return;

//     const { data, error } = await supabase
//       .from("inquiries")
//       .select(`
//         id,
//         student_name,
//         mobile_primary,
//         course_interested,
//         status,
//         created_at
//       `)
//       .eq("branch_id", profile.branch_id)
//       .order("created_at", { ascending: false });

//     if (!error && data) {
//       setInquiries(data);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     loadInquiries();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center gap-2 text-gray-500">
//         <ClipboardList size={18} />
//         Loading inquiries...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 max-w-6xl">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
//             <ClipboardList size={22} />
//             Reception Inquiries
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             All student inquiries for your branch
//           </p>
//         </div>

//         <Link
//           href="/reception/inquiries/new"
//           className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition shadow-sm"
//         >
//           <Plus size={16} />
//           New Inquiry
//         </Link>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="p-4 text-left font-medium">Student</th>
//               <th className="p-4 text-center font-medium">Mobile</th>
//               <th className="p-4 text-center font-medium">Course</th>
//               <th className="p-4 text-center font-medium">Status</th>
//               <th className="p-4 text-center font-medium">Action</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {inquiries.map((inq) => (
//               <tr key={inq.id} className="hover:bg-gray-50 transition">
//                 <td className="p-4 font-medium text-gray-800">
//                   {inq.student_name}
//                 </td>

//                 <td className="p-4 text-center text-gray-700">
//                   {inq.mobile_primary}
//                 </td>

//                 <td className="p-4 text-center text-gray-700">
//                   {inq.course_interested ?? "-"}
//                 </td>

//                 <td className="p-4 text-center">
//                   <span
//                     className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                       inq.status === "NEW"
//                         ? "bg-blue-100 text-blue-700"
//                         : inq.status === "ASSIGNED"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {inq.status}
//                   </span>
//                 </td>

//                 <td className="p-4 text-center">
//                   <Link
//                     href={`/reception/inquiries/${inq.id}`}
//                     className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     <Eye size={16} />
//                     View
//                   </Link>
//                 </td>
//               </tr>
//             ))}

//             {inquiries.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="p-8 text-center text-gray-500"
//                 >
//                   No inquiries found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  Plus,
  Eye,
  ClipboardList,
  Phone,
  GraduationCap,
} from "lucide-react";

import SearchInput from "@/components/filters/SearchInput";
import StatusDropdown from "@/components/filters/StatusDropdown";

type Inquiry = {
  id: string;
  student_name: string;
  mobile_primary: string;
  course_interested: string | null;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Confirmed", value: "ADMISSION_CONFIRMED" },
];

export default function ReceptionInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadInquiries = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("branch_id")
      .eq("id", user.id)
      .single();

    if (!profile?.branch_id) return;

    const { data } = await supabase
      .from("inquiries")
      .select(
        "id, student_name, mobile_primary, course_interested, status, created_at"
      )
      .eq("branch_id", profile.branch_id)
      .order("created_at", { ascending: false });

    setInquiries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch =
        inq.student_name.toLowerCase().includes(search.toLowerCase()) ||
        inq.mobile_primary.includes(search);

      const matchesStatus =
        statusFilter === "ALL" || inq.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-10">
        <ClipboardList size={18} />
        Loading inquiries...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <ClipboardList size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Reception Inquiries</h2>
            <p className="text-sm text-gray-500">
              All student inquiries for your branch
            </p>
          </div>
        </div>

        <Link
          href="/reception/inquiries/new"
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 shadow"
        >
          <Plus size={16} />
          New Inquiry
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl  shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search name or mobile"
            className="w-full md:w-72"
          />

          <StatusDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>


      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-center">Mobile</th>
              <th className="p-4 text-center">Course</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredInquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{inq.student_name}</td>

                <td className="p-4 text-center">
                  <Phone size={14} className="inline mr-1" />
                  {inq.mobile_primary}
                </td>

                <td className="p-4 text-center">
                  <GraduationCap size={14} className="inline mr-1" />
                  {inq.course_interested ?? "-"}
                </td>

                <td className="p-4 text-center">
                  {/* <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100">
                    {inq.status.replaceAll("_", " ")}
                  </span> */}

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
    ${inq.status === "NEW"
                        ? "bg-blue-100 text-blue-700"
                        : inq.status === "ASSIGNED"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {inq.status.replaceAll("_", " ").toLowerCase()}
                  </span>

                </td>

                <td className="p-4 text-center">
                  <Link
                    href={`/reception/inquiries/${inq.id}`}
                    className="inline-flex items-center gap-1 text-blue-600"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filteredInquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  No matching inquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
