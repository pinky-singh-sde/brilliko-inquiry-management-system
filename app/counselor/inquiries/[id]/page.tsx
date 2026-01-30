// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import InquiryTimeline from "@/components/InquiryTimeline";

// type Inquiry = {
//   id: string;
//   student_name: string;
//   father_name: string | null;
//   mobile_primary: string;
//   email: string | null;
//   qualification: string | null;
//   course_interested: string | null;
//   status: string;
//   counselor_notes: string | null;
// };

// const STATUS_OPTIONS = [
//   "FOLLOW_UP",
//   "ADMISSION_CONFIRMED",
//   "NOT_INTERESTED",
// ];

// export default function CounselorInquiryDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [inquiry, setInquiry] = useState<Inquiry | null>(null);
//   const [notes, setNotes] = useState("");
//   const [status, setStatus] = useState("");
//   const [followUpNote, setFollowUpNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadInquiry();
//   }, []);

//   async function loadInquiry() {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     const { data, error } = await supabase
//       .from("inquiries")
//       .select("*")
//       .eq("id", id)
//       .eq("assigned_counselor_id", user.id)
//       .single();

//     if (error || !data) {
//       alert("Access denied or inquiry not found");
//       router.push("/counselor/inquiries");
//       return;
//     }

//     setInquiry(data);
//     setNotes(data.counselor_notes || "");
//     setStatus(data.status);
//   }

//   // ✅ Save status + counselor notes
//   async function saveChanges() {
//     setLoading(true);

//     await supabase.from("inquiries").update({
//       counselor_notes: notes,
//       status,
//     }).eq("id", id);

//     await supabase.from("inquiry_logs").insert({
//       inquiry_id: id,
//       action: status,
//       notes: "Status updated by counselor",
//     });

//     setLoading(false);
//     alert("Inquiry updated");
//     loadInquiry();
//   }

//   // ✅ Follow-up action
//   async function addFollowUp() {
//     if (!followUpNote) return;

//     await supabase.from("inquiries").update({
//       status: "FOLLOW_UP",
//     }).eq("id", id);

//     await supabase.from("inquiry_logs").insert({
//       inquiry_id: id,
//       action: "FOLLOW_UP",
//       notes: followUpNote,
//     });

//     setFollowUpNote("");
//     loadInquiry();
//   }

//   if (!inquiry) {
//     return <p className="text-gray-500">Loading inquiry...</p>;
//   }

//   return (
//     <div className="max-w-3xl space-y-6">
//       <h1 className="text-2xl font-semibold">{inquiry.student_name}</h1>

//       {/* DETAILS */}
//       <div className="bg-white p-4 rounded-lg shadow space-y-2">
//         <p><strong>Father:</strong> {inquiry.father_name ?? "-"}</p>
//         <p><strong>Mobile:</strong> {inquiry.mobile_primary}</p>
//         <p><strong>Email:</strong> {inquiry.email ?? "-"}</p>
//         <p><strong>Qualification:</strong> {inquiry.qualification ?? "-"}</p>
//         <p><strong>Course:</strong> {inquiry.course_interested ?? "-"}</p>
//         <p><strong>Status:</strong> {inquiry.status}</p>
//       </div>

//       {/* FOLLOW-UP */}
//       <div className="bg-white p-4 rounded-lg shadow space-y-3">
//         <h3 className="font-medium">Add Follow-Up</h3>
//         <textarea
//           value={followUpNote}
//           onChange={(e) => setFollowUpNote(e.target.value)}
//           className="input h-24"
//           placeholder="Call outcome, interest, next steps..."
//         />
//         <button
//           onClick={addFollowUp}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Save Follow-Up
//         </button>
//       </div>

//       {/* STATUS + NOTES */}
//       <div className="bg-white p-4 rounded-lg shadow space-y-4">
//         <h3 className="font-medium">Final Action</h3>

//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="input"
//         >
//           {STATUS_OPTIONS.map((s) => (
//             <option key={s} value={s}>
//               {s.replace("_", " ")}
//             </option>
//           ))}
//         </select>

//         <textarea
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           className="input h-28"
//           placeholder="Counselor summary notes"
//         />

//         <button
//           onClick={saveChanges}
//           disabled={loading}
//           className="bg-orange-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Saving..." : "Save Changes"}
//         </button>
//       </div>

//       {/* TIMELINE */}
//       <InquiryTimeline inquiryId={id as string} />
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import InquiryTimeline from "@/components/InquiryTimeline";

type Inquiry = {
  id: string;
  student_name: string;
  father_name: string | null;
  mobile_primary: string;
  email: string | null;
  qualification: string | null;
  course_interested: string | null;
  status: string;
  counselor_notes: string | null;
};

const STATUS_OPTIONS = [
  "FOLLOW_UP",
  "ADMISSION_CONFIRMED",
  "NOT_INTERESTED",
];

export default function CounselorInquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInquiry();
  }, [id]);

  async function loadInquiry() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .eq("assigned_counselor_id", user.id)
      .single();

    if (error || !data) {
      router.push("/counselor/inquiries");
      return;
    }

    setInquiry(data);
    setNotes(data.counselor_notes || "");
    setStatus(data.status);
  }

  async function saveChanges() {
    if (!inquiry || status === inquiry.status) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("inquiries")
      .update({ counselor_notes: notes, status })
      .eq("id", id);

    await supabase.from("inquiry_logs").insert({
      inquiry_id: id,
      action: status,
      notes: notes || "Final status updated",
      created_by: user?.id,
    });

    setLoading(false);
    loadInquiry();
  }

  async function addFollowUp() {
    if (!followUpNote || loading) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("inquiries")
      .update({ status: "FOLLOW_UP" })
      .eq("id", id);

    await supabase.from("inquiry_logs").insert({
      inquiry_id: id,
      action: "FOLLOW_UP",
      notes: followUpNote,
      created_by: user?.id,
    });

    setFollowUpNote("");
    setLoading(false);
    loadInquiry();
  }

  if (!inquiry) {
    return <p className="text-gray-500">Loading inquiry...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {inquiry.student_name}
        </h1>

        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
          {inquiry.status.replace("_", " ")}
        </span>
      </div>

      {/* DETAILS */}
      <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <Detail label="Father Name" value={inquiry.father_name} />
        <Detail label="Mobile" value={inquiry.mobile_primary} />
        <Detail label="Email" value={inquiry.email} />
        <Detail label="Qualification" value={inquiry.qualification} />
        <Detail label="Course Interested" value={inquiry.course_interested} />
      </div>

      {/* FOLLOW-UP */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
        <h3 className="font-semibold text-lg">Add Follow-Up</h3>

        <textarea
          value={followUpNote}
          onChange={(e) => setFollowUpNote(e.target.value)}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-28"
          placeholder="Call outcome, interest, next steps..."
        />

        <button
          onClick={addFollowUp}
          disabled={loading || !followUpNote}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg
                     hover:bg-blue-700 transition disabled:opacity-50"
        >
          Save Follow-Up
        </button>
      </div>

      {/* FINAL ACTION */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-lg">Final Action</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded-lg p-3 h-32"
          placeholder="Counselor summary notes"
        />

        <button
          onClick={saveChanges}
          disabled={loading || status === inquiry.status}
          className="bg-orange-600 text-white px-5 py-2 rounded-lg
                     hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Final Status"}
        </button>
      </div>

      {/* TIMELINE */}
      <InquiryTimeline inquiryId={id} />
    </div>
  );
}

/* ---------- Small UI Component ---------- */

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <p>
      <span className="text-gray-500">{label}: </span>
      <span className="font-medium">{value ?? "-"}</span>
    </p>
  );
}
