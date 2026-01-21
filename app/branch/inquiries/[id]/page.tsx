// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";

// type Inquiry = {
//   id: string;
//   student_name: string;
//   father_name: string | null;
//   mobile_primary: string;
//   email: string | null;
//   qualification: string | null;
//   course_interested: string | null;
//   status: string;
//   receptionist_remarks: string | null;
//   counselor_notes: string | null;
// };

// export default function InquiryDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [inquiry, setInquiry] = useState<Inquiry | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // 🔹 Fetch inquiry
//   const fetchInquiry = async () => {
//     const { data, error } = await supabase
//       .from("inquiries")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) {
//       alert("Unauthorized or inquiry not found");
//       router.push("/branch/inquiries");
//       return;
//     }

//     setInquiry(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchInquiry();
//   }, []);

//   // 🔹 Update inquiry
//   const updateInquiry = async () => {
//     if (!inquiry) return;

//     setSaving(true);

//     const { error } = await supabase
//       .from("inquiries")
//       .update({
//         status: inquiry.status,
//         receptionist_remarks: inquiry.receptionist_remarks,
//         counselor_notes: inquiry.counselor_notes,
//       })
//       .eq("id", inquiry.id);

//     setSaving(false);

//     if (error) {
//       alert("Failed to update inquiry");
//     } else {
//       alert("Inquiry updated successfully");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!inquiry) return null;

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold">
//         Inquiry: {inquiry.student_name}
//       </h2>

//       {/* Student Info */}
//       <div className="bg-white p-6 rounded-lg shadow space-y-3">
//         <p><b>Father Name:</b> {inquiry.father_name || "-"}</p>
//         <p><b>Mobile:</b> {inquiry.mobile_primary}</p>
//         <p><b>Email:</b> {inquiry.email || "-"}</p>
//         <p><b>Qualification:</b> {inquiry.qualification || "-"}</p>
//         <p><b>Course Interested:</b> {inquiry.course_interested || "-"}</p>
//       </div>

//       {/* Status */}
//       <div className="bg-white p-6 rounded-lg shadow space-y-3">
//         <label className="font-medium">Status</label>
//         <select
//           value={inquiry.status}
//           onChange={(e) =>
//             setInquiry({ ...inquiry, status: e.target.value })
//           }
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="NEW">NEW</option>
//           <option value="ASSIGNED">ASSIGNED</option>
//           <option value="FOLLOW_UP">FOLLOW UP</option>
//           <option value="ADMISSION_CONFIRMED">ADMISSION CONFIRMED</option>
//           <option value="NOT_INTERESTED">NOT INTERESTED</option>
//         </select>
//       </div>

//       {/* Remarks */}
//       <div className="bg-white p-6 rounded-lg shadow space-y-4">
//         <div>
//           <label className="font-medium">Receptionist Remarks</label>
//           <textarea
//             value={inquiry.receptionist_remarks || ""}
//             onChange={(e) =>
//               setInquiry({
//                 ...inquiry,
//                 receptionist_remarks: e.target.value,
//               })
//             }
//             className="border w-full p-3 rounded mt-1"
//           />
//         </div>

//         <div>
//           <label className="font-medium">Counselor Notes</label>
//           <textarea
//             value={inquiry.counselor_notes || ""}
//             onChange={(e) =>
//               setInquiry({
//                 ...inquiry,
//                 counselor_notes: e.target.value,
//               })
//             }
//             className="border w-full p-3 rounded mt-1"
//           />
//         </div>
//       </div>

//       {/* Save */}
//       <button
//         onClick={updateInquiry}
//         disabled={saving}
//         className="bg-orange-600 text-white px-6 py-3 rounded"
//       >
//         {saving ? "Saving..." : "Save Changes"}
//       </button>
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
  mobile_primary: string;
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 1️⃣ Load inquiry
    const { data: inquiryData } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    setInquiry(inquiryData);

    // 2️⃣ Get current user's branch
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

    // 3️⃣ Load counselors of this branch
    const { data: counselorData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("branch_id", profile.branch_id)
      .eq("role", "COUNSELOR");

    setCounselors(counselorData || []);
  };

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

  if (!inquiry) {
    return <p className="text-gray-500">Loading inquiry...</p>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold">
        {inquiry.student_name}
      </h2>

      {/* 📋 Details */}
      <div className="bg-white p-4 rounded-lg shadow space-y-2">
        <p>
          <strong>Mobile:</strong> {inquiry.mobile_primary}
        </p>
        <p>
          <strong>Course:</strong>{" "}
          {inquiry.course_interested}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="font-medium">
            {inquiry.status}
          </span>
        </p>
      </div>

      {/* 👤 Assign Counselor */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h3 className="font-medium">
          Assign Counselor
        </h3>

        <select
          value={selectedCounselor}
          onChange={(e) =>
            setSelectedCounselor(e.target.value)
          }
          className="border px-3 py-2 rounded w-full"
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
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Assign
        </button>
      </div>
    </div>
  );
}
