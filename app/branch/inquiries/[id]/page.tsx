
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";

// type Inquiry = {
//   id: string;
//   student_name: string;
//   father_name: string;
//   mobile_primary: string;
//   qualification: string;
//   course_interested: string;
//   status: string;
//   assigned_counselor_id: string | null;
// };

// type Counselor = {
//   id: string;
//   full_name: string;
// };

// export default function BranchInquiryDetail() {
//   const { id } = useParams();
//   const [inquiry, setInquiry] = useState<Inquiry | null>(null);
//   const [counselors, setCounselors] = useState<Counselor[]>([]);
//   const [selectedCounselor, setSelectedCounselor] = useState("");
//   const [loading, setLoading] = useState(false);



//   const loadData = async () => {
//     const { data: inquiryData } = await supabase
//       .from("inquiries")
//       .select("*")
//       .eq("id", id)
//       .single();

//     setInquiry(inquiryData);

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

//     const { data: counselorData } = await supabase
//       .from("profiles")
//       .select("id, full_name")
//       .eq("branch_id", profile.branch_id)
//       .eq("role", "COUNSELOR");

//     setCounselors(counselorData || []);
//   };


//   useEffect(() => {
//     loadData();
//   }, []);


//   const assignCounselor = async () => {
//     if (!selectedCounselor) return;

//     setLoading(true);

//     await supabase
//       .from("inquiries")
//       .update({
//         assigned_counselor_id: selectedCounselor,
//         status: "ASSIGNED",
//       })
//       .eq("id", id);

//     await loadData();
//     setLoading(false);
//   };

//   const statusStyle = (status: string) => {
//     switch (status) {
//       case "NEW":
//         return "bg-blue-100 text-blue-700";
//       case "ASSIGNED":
//         return "bg-purple-100 text-purple-700";
//       case "FOLLOW_UP":
//         return "bg-yellow-100 text-yellow-700";
//       case "ADMISSION_CONFIRMED":
//         return "bg-green-100 text-green-700";
//       case "NOT_INTERESTED":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   if (!inquiry) {
//     return <p className="text-gray-500">Loading inquiry...</p>;
//   }

//   return (
//     <div className="max-w-5xl space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//         <h2 className="text-xl sm:text-2xl font-semibold">
//           {inquiry.student_name}
//         </h2>

//         <span
//           className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
//             inquiry.status
//           )}`}
//         >
//           {inquiry.status.replace("_", " ")}
//         </span>
//       </div>

//       {/* Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* 📋 Inquiry Details */}
//         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 space-y-4">
//           <h3 className="text-sm font-semibold text-gray-600 uppercase">
//             Inquiry Details
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//             <Detail label="Student Name" value={inquiry.student_name} />
//             <Detail label="Father Name" value={inquiry.father_name} />
//             <Detail label="Mobile" value={inquiry.mobile_primary} />
//             <Detail label="Qualification" value={inquiry.qualification} />
//             <Detail
//               label="Course Interested"
//               value={inquiry.course_interested}
//             />
//           </div>
//         </div>

//         {/* 👤 Assign Counselor */}
//         <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
//           <h3 className="text-sm font-semibold text-gray-600 uppercase">
//             Assign Counselor
//           </h3>

//           <select
//             value={selectedCounselor}
//             onChange={(e) => setSelectedCounselor(e.target.value)}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//           >
//             <option value="">Select Counselor</option>
//             {counselors.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.full_name}
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={assignCounselor}
//             disabled={loading || !selectedCounselor}
//             className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 transition"
//           >
//             {loading ? "Assigning..." : "Assign Counselor"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Detail({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div>
//       <p className="text-xs text-gray-500">{label}</p>
//       <p className="font-medium text-gray-900">
//         {value || "-"}
//       </p>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Inquiry = {
  id: string;
  student_name: string;
  father_name: string | null;
  mobile_primary: string;
  qualification: string | null;
  course_interested: string | null;
  status: string;
  assigned_counselor_id: string | null;
};

type Counselor = {
  id: string;
  full_name: string;
};

export default function BranchInquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // 🔐 get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    // 🔐 get admin branch
    const { data: profile } = await supabase
      .from("profiles")
      .select("branch_id")
      .eq("id", user.id)
      .single();

    if (!profile?.branch_id) return;

    // 🔐 fetch inquiry ONLY from same branch
    const { data: inquiryData, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .eq("branch_id", profile.branch_id)
      .single();

    if (error || !inquiryData) {
      alert("Inquiry not found or access denied");
      router.push("/branch/inquiries");
      return;
    }

    setInquiry(inquiryData);

    // 👤 counselors of this branch
    const { data: counselorData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("branch_id", profile.branch_id)
      .eq("role", "COUNSELOR");

    setCounselors(counselorData || []);
  }

  async function assignCounselor() {
    if (!selectedCounselor || !inquiry) return;

    setLoading(true);

    const { error } = await supabase
      .from("inquiries")
      .update({
        assigned_counselor_id: selectedCounselor,
        status: "ASSIGNED",
      })
      .eq("id", inquiry.id);

    setLoading(false);

    if (!error) {
      alert("Counselor assigned");
      loadData();
    } else {
      alert(error.message);
    }
  }

  function statusStyle(status: string) {
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
  }

  if (!inquiry) {
    return <p className="text-gray-500">Loading inquiry...</p>;
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {inquiry.student_name}
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
            inquiry.status
          )}`}
        >
          {inquiry.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DETAILS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">
            Inquiry Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Student Name" value={inquiry.student_name} />
            <Detail label="Father Name" value={inquiry.father_name} />
            <Detail label="Mobile" value={inquiry.mobile_primary} />
            <Detail label="Qualification" value={inquiry.qualification} />
            <Detail label="Course Interested" value={inquiry.course_interested} />
          </div>
        </div>

        {/* ASSIGN COUNSELOR */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">
            Counselor Assignment
          </h3>

          {inquiry.assigned_counselor_id ? (
            <p className="text-sm text-gray-600">
              Counselor already assigned
            </p>
          ) : (
            <>
              <select
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Select Counselor</option>
                {counselors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>

              <button
                onClick={assignCounselor}
                disabled={loading || !selectedCounselor}
                className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "Assigning..." : "Assign Counselor"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || "-"}</p>
    </div>
  );
}
