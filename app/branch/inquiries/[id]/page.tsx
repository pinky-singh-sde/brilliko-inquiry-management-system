
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

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     // 1️⃣ Load inquiry
//     const { data: inquiryData } = await supabase
//       .from("inquiries")
//       .select("*")
//       .eq("id", id)
//       .single();

//     setInquiry(inquiryData);

//     // 2️⃣ Get current user's branch
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

//     // 3️⃣ Load counselors of this branch
//     const { data: counselorData } = await supabase
//       .from("profiles")
//       .select("id, full_name")
//       .eq("branch_id", profile.branch_id)
//       .eq("role", "COUNSELOR");

//     setCounselors(counselorData || []);
//   };

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

//   if (!inquiry) {
//     return <p className="text-gray-500">Loading inquiry...</p>;
//   }

//   return (
//     <div className="space-y-6 max-w-3xl">
//       <h2 className="text-2xl font-semibold">
//         {inquiry.student_name}
//       </h2>

//       {/* 📋 Details */}
//       <div className="bg-white p-4 rounded-lg shadow space-y-2">
//         <p>
//           <strong>Student Name:</strong> {inquiry.student_name}
//         </p>
//         <p>
//           <strong>Father Name:</strong> {inquiry.father_name}
//         </p>
//         <p>
//           <strong>Mobile:</strong> {inquiry.mobile_primary}
//         </p>
//         <p>
//           <strong>Qualification:</strong> {inquiry.qualification}
//         </p>
//         <p>
//           <strong>Course:</strong>{" "}
//           {inquiry.course_interested}
//         </p>
//         <p>
//           <strong>Status:</strong>{" "}
//           <span className="font-medium">
//             {inquiry.status}
//           </span>
//         </p>
//       </div>

//       {/* 👤 Assign Counselor */}
//       <div className="bg-white p-4 rounded-lg shadow space-y-4">
//         <h3 className="font-medium">
//           Assign Counselor
//         </h3>

//         <select
//           value={selectedCounselor}
//           onChange={(e) =>
//             setSelectedCounselor(e.target.value)
//           }
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="">Select Counselor</option>
//           {counselors.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.full_name}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={assignCounselor}
//           disabled={loading}
//           className="bg-orange-600 text-white px-4 py-2 rounded"
//         >
//           Assign
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Inquiry = {
  id: string;
  student_name: string;
  father_name: string;
  mobile_primary: string;
  qualification: string;
  course_interested: string;
  status: string;
  assigned_counselor_id: string | null;
};

type Counselor = {
  id: string;
  full_name: string;
};

export default function BranchInquiryDetail() {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [loading, setLoading] = useState(false);



  const loadData = async () => {
    const { data: inquiryData } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    setInquiry(inquiryData);

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

    const { data: counselorData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("branch_id", profile.branch_id)
      .eq("role", "COUNSELOR");

    setCounselors(counselorData || []);
  };


  useEffect(() => {
    loadData();
  }, []);


  const assignCounselor = async () => {
    if (!selectedCounselor) return;

    setLoading(true);

    await supabase
      .from("inquiries")
      .update({
        assigned_counselor_id: selectedCounselor,
        status: "ASSIGNED",
      })
      .eq("id", id);

    await loadData();
    setLoading(false);
  };

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
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
            inquiry.status
          )}`}
        >
          {inquiry.status.replace("_", " ")}
        </span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 📋 Inquiry Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">
            Inquiry Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Student Name" value={inquiry.student_name} />
            <Detail label="Father Name" value={inquiry.father_name} />
            <Detail label="Mobile" value={inquiry.mobile_primary} />
            <Detail label="Qualification" value={inquiry.qualification} />
            <Detail
              label="Course Interested"
              value={inquiry.course_interested}
            />
          </div>
        </div>

        {/* 👤 Assign Counselor */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">
            Assign Counselor
          </h3>

          <select
            value={selectedCounselor}
            onChange={(e) => setSelectedCounselor(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 transition"
          >
            {loading ? "Assigning..." : "Assign Counselor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}
