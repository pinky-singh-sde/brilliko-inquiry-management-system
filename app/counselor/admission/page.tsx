// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
// import { CheckCircle } from "lucide-react";

// type Admission = {
//   id: string;
//   student_name: string;
//   mobile_primary: string;
//   email: string | null;
//   course_interested: string | null;
//   updated_at: string;
// };

// export default function CounselorAdmissionPage() {
//   const [admissions, setAdmissions] = useState<Admission[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function loadAdmissions() {
//     setLoading(true);

//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     const { data } = await supabase
//       .from("inquiries")
//       .select(
//         "id, student_name, mobile_primary, email, course_interested, updated_at"
//       )
//       .eq("assigned_counselor_id", user.id)
//       .eq("status", "ADMISSION_CONFIRMED")
//       .order("updated_at", { ascending: false });

//     setAdmissions(data || []);
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadAdmissions();
//   }, []);

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
//           <CheckCircle size={22} />
//         </div>
//         <div>
//           <h1 className="text-2xl font-semibold">Admissions</h1>
//           <p className="text-sm text-gray-500">
//             Students with confirmed admissions
//           </p>
//         </div>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <p className="text-center text-gray-500 py-10">
//           Loading admissions...
//         </p>
//       )}

//       {/* Empty */}
//       {!loading && admissions.length === 0 && (
//         <p className="text-center text-gray-500 py-10">
//           No confirmed admissions yet
//         </p>
//       )}

//       {/* DESKTOP TABLE */}
//       {!loading && admissions.length > 0 && (
//         <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 text-gray-600">
//               <tr>
//                 <th className="p-4 text-left">Student</th>
//                 <th className="p-4 text-center">Mobile</th>
//                 <th className="p-4 text-center">Email</th>
//                 <th className="p-4 text-center">Course</th>
//                 <th className="p-4 text-center">Confirmed On</th>
//                 <th className="p-4 text-center"></th>
//               </tr>
//             </thead>

//             <tbody>
//               {admissions.map((adm) => (
//                 <tr
//                   key={adm.id}
//                   className="border-t hover:bg-gray-50"
//                 >
//                   <td className="p-4 font-medium">
//                     {adm.student_name}
//                   </td>

//                   <td className="p-4 text-center">
//                     {adm.mobile_primary}
//                   </td>

//                   <td className="p-4 text-center">
//                     {adm.email ?? "-"}
//                   </td>

//                   <td className="p-4 text-center">
//                     {adm.course_interested ?? "-"}
//                   </td>

//                   <td className="p-4 text-center text-gray-500">
//                     {new Date(adm.updated_at).toLocaleDateString()}
//                   </td>

//                   <td className="p-4 text-center">
//                     <Link
//                       href={`/counselor/inquiries/${adm.id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       View
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* MOBILE CARDS */}
//       {!loading && admissions.length > 0 && (
//         <div className="grid grid-cols-1 gap-4 md:hidden">
//           {admissions.map((adm) => (
//             <div
//               key={adm.id}
//               className="bg-white rounded-xl shadow-sm p-4 space-y-2"
//             >
//               <div className="flex justify-between items-start">
//                 <h3 className="font-semibold">
//                   {adm.student_name}
//                 </h3>
//                 <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
//                   Confirmed
//                 </span>
//               </div>

//               <p className="text-sm text-gray-600">
//                  {adm.mobile_primary}
//               </p>

//               <p className="text-sm text-gray-600">
//                  {adm.course_interested ?? "-"}
//               </p>

//               <p className="text-xs text-gray-400">
//                 Confirmed on{" "}
//                 {new Date(adm.updated_at).toLocaleDateString()}
//               </p>

//               <Link
//                 href={`/counselor/inquiries/${adm.id}`}
//                 className="inline-block text-sm text-blue-600 font-medium"
//               >
//                 View Details →
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle, Search , X} from "lucide-react";

type Admission = {
  id: string;
  student_name: string;
  mobile_primary: string;
  email: string | null;
  course_interested: string | null;
  updated_at: string;
};

export default function CounselorAdmissionPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadAdmissions() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("inquiries")
      .select(
        "id, student_name, mobile_primary, email, course_interested, updated_at"
      )
      .eq("assigned_counselor_id", user.id)
      .eq("status", "ADMISSION_CONFIRMED")
      .order("updated_at", { ascending: false });

    setAdmissions(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAdmissions();
  }, []);

  // Filter admissions by search term
  const filteredAdmissions = admissions.filter((adm) => {
    const q = search.toLowerCase();
    return (
      adm.student_name.toLowerCase().includes(q) ||
      adm.mobile_primary.includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <CheckCircle size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Admissions</h1>
          <p className="text-sm text-gray-500">
            Students with confirmed admissions
          </p>
        </div>
      </div>

      {/* Search / Filter */}
      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          placeholder="Search by student name or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}


<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  <div className="relative w-full md:w-72">
    {/* Magnifying glass icon */}
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      <Search/>
    </span>

    <input
      type="text"
      placeholder="Search by student name or mobile"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />

    {/* Clear button */}
    {search && (
      <button
        onClick={() => setSearch("")}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        <X/>
      </button>
    )}
  </div>
</div>


      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 py-10">
          Loading admissions...
        </p>
      )}

      {/* Empty */}
      {!loading && filteredAdmissions.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No matching admissions found
        </p>
      )}

      {/* DESKTOP TABLE */}
      {!loading && filteredAdmissions.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-center">Mobile</th>
                <th className="p-4 text-center">Email</th>
                <th className="p-4 text-center">Course</th>
                <th className="p-4 text-center">Confirmed On</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmissions.map((adm) => (
                <tr key={adm.id} className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="p-4 font-medium">{adm.student_name}</td>
                  <td className="p-4 text-center">{adm.mobile_primary}</td>
                  <td className="p-4 text-center">{adm.email ?? "-"}</td>
                  <td className="p-4 text-center">{adm.course_interested ?? "-"}</td>
                  <td className="p-4 text-center text-gray-500">
                    {new Date(adm.updated_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/counselor/inquiries/${adm.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARDS */}
      {!loading && filteredAdmissions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredAdmissions.map((adm) => (
            <div
              key={adm.id}
              className="bg-white rounded-xl shadow-sm p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{adm.student_name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                  Confirmed
                </span>
              </div>

              <p className="text-sm text-gray-600">📞 {adm.mobile_primary}</p>
              <p className="text-sm text-gray-600">🎓 {adm.course_interested ?? "-"}</p>
              <p className="text-xs text-gray-400">
                Confirmed on {new Date(adm.updated_at).toLocaleDateString()}
              </p>

              <Link
                href={`/counselor/inquiries/${adm.id}`}
                className="inline-block text-sm text-blue-600 font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


