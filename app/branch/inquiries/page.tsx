// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import Link from "next/link";

// type Inquiry = {
//   id: string;
//   student_name: string;
//   mobile_primary: string;
//   course_interested: string | null;
//   lead_source: string | null;
//   status: string;
//   created_at: string;
// };

// export default function BranchInquiriesPage() {
//   const [inquiries, setInquiries] = useState<Inquiry[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadInquiries = async () => {
//       // 1️⃣ Get logged-in user
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       // 2️⃣ Get branch_id from profile
//       const { data: profile, error } = await supabase
//         .from("profiles")
//         .select("branch_id")
//         .eq("id", user.id)
//         .single();

//       if (error || !profile?.branch_id) return;

//       // 3️⃣ Fetch inquiries of that branch
//       const { data } = await supabase
//         .from("inquiries")
//         .select(`
//           id,
//           student_name,
//           mobile_primary,
//           course_interested,
//           lead_source,
//           status,
//           created_at
//         `)
//         .eq("branch_id", profile.branch_id)
//         .order("created_at", { ascending: false });

//       setInquiries(data || []);
//       setLoading(false);
//     };

//     loadInquiries();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-6">Inquiries</h1>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Student</th>
//               <th className="p-3">Mobile</th>
//               <th className="p-3">Course</th>
//               <th className="p-3">Source</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Created</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading && (
//               <tr>
//                 <td colSpan={6} className="p-4 text-center">
//                   Loading...
//                 </td>
//               </tr>
//             )}

//             {!loading && inquiries.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="p-4 text-center text-gray-500">
//                   No inquiries found
//                 </td>
//               </tr>
//             )}

//             {inquiries.map((inq) => (
//               <tr key={inq.id} className="border-t">
//                 <td className="p-3">
//                   <Link
//                     href={`/branch/inquiries/${inq.id}`}
//                     className="text-blue-600 hover:underline font-medium"
//                   >
//                     {inq.student_name}
//                   </Link>
//                 </td>
//                 <td className="p-3 text-center">
//                   {inq.mobile_primary}
//                 </td>
//                 <td className="p-3 text-center">
//                   {inq.course_interested || "-"}
//                 </td>
//                 <td className="p-3 text-center">
//                   {inq.lead_source || "-"}
//                 </td>
//                 <td className="p-3 text-center">
//                   <span className="px-2 py-1 rounded text-xs bg-gray-100">
//                     {inq.status}
//                   </span>
//                 </td>
//                 <td className="p-3 text-center text-xs">
//                   {new Date(inq.created_at).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


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

  const statusStyle = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-700";
      case "ASSIGNED":
        return "bg-purple-100 text-purple-700";
      case "FOLLOW_UP":
        return "bg-yellow-100 text-yellow-700";
      case "ADMISSION_CONFIRMED":
        return "bg-green-100 text-green-700";
      case "NOT_INTERESTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Inquiries
        </h1>
        <span className="text-sm text-gray-500">
          Total: {inquiries.length}
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-center">Mobile</th>
              <th className="p-4 text-center">Course</th>
              <th className="p-4 text-center">Source</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Created</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading inquiries...
                </td>
              </tr>
            )}

            {!loading && inquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No inquiries found
                </td>
              </tr>
            )}

            {inquiries.map((inq) => (
              <tr
                key={inq.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">
                  <Link
                    href={`/branch/inquiries/${inq.id}`}
                    className="text-orange-600 hover:underline"
                  >
                    {inq.student_name}
                  </Link>
                </td>
                <td className="p-4 text-center">
                  {inq.mobile_primary}
                </td>
                <td className="p-4 text-center">
                  {inq.course_interested || "-"}
                </td>
                <td className="p-4 text-center">
                  {inq.lead_source || "-"}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                      inq.status
                    )}`}
                  >
                    {inq.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4 text-center text-xs text-gray-500">
                  {new Date(inq.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading && (
          <p className="text-center text-gray-500">
            Loading inquiries...
          </p>
        )}

        {!loading && inquiries.length === 0 && (
          <p className="text-center text-gray-500">
            No inquiries found
          </p>
        )}

        {inquiries.map((inq) => (
          <Link
            key={inq.id}
            href={`/branch/inquiries/${inq.id}`}
            className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">
                  {inq.student_name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {inq.mobile_primary}
                </p>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(
                  inq.status
                )}`}
              >
                {inq.status.replace("_", " ")}
              </span>
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Course:</span>{" "}
                {inq.course_interested || "-"}
              </p>
              <p>
                <span className="font-medium">Source:</span>{" "}
                {inq.lead_source || "-"}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(inq.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
