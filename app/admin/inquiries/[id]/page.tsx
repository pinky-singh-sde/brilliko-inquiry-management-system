"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Inquiry = {
  id: string;
  student_name: string;
  father_name: string;
  gender: string;
  mobile_primary: string;
  mobile_alternate: string;
  email: string;
  qualification: string;
  course_interested: string;
  lead_source: string;
  status: string;
  receptionist_remarks: string;
  counselor_notes: string;
  branch_id: string;
};

type Counselor = {
  id: string;
  full_name: string;
};

export default function AdminInquiryDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [status, setStatus] = useState("");
  const [assignedCounselor, setAssignedCounselor] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch inquiry
  const fetchInquiry = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      router.push("/unauthorized");
      return;
    }

    setInquiry(data);
    setStatus(data.status);
    setAssignedCounselor(data.assigned_counselor_id);
    setNotes(data.counselor_notes || "");
    setLoading(false);
  };

  // 🔹 Fetch counselors (branch-specific)
  const fetchCounselors = async (branchId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "COUNSELOR")
      .eq("branch_id", branchId);

    if (data) setCounselors(data);
  };

  useEffect(() => {
    fetchInquiry();
  }, []);

  useEffect(() => {
    if (inquiry?.branch_id) {
      fetchCounselors(inquiry.branch_id);
    }
  }, [inquiry]);

  // 🔥 Update inquiry
  const updateInquiry = async () => {
    await supabase
      .from("inquiries")
      .update({
        status,
        assigned_counselor_id: assignedCounselor,
        counselor_notes: notes,
        updated_at: new Date(),
      })
      .eq("id", id);

    alert("Inquiry updated successfully");
    router.push("/admin/inquiries");
  };

  if (loading) return <p>Loading...</p>;
  if (!inquiry) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-semibold">Inquiry Details</h1>

      {/* 🧑 Student Info */}
      <div className="bg-white p-6 rounded-lg shadow grid grid-cols-2 gap-4">
        <Info label="Student Name" value={inquiry.student_name} />
        <Info label="Father Name" value={inquiry.father_name} />
        <Info label="Gender" value={inquiry.gender} />
        <Info label="Mobile" value={inquiry.mobile_primary} />
        <Info label="Alternate Mobile" value={inquiry.mobile_alternate} />
        <Info label="Email" value={inquiry.email} />
        <Info label="Qualification" value={inquiry.qualification} />
        <Info label="Course Interested" value={inquiry.course_interested} />
        <Info label="Lead Source" value={inquiry.lead_source} />
      </div>

      {/* ⚙️ Actions */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="font-medium">Manage Inquiry</h3>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="NEW">NEW</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="FOLLOW_UP">FOLLOW_UP</option>
          <option value="ADMISSION_CONFIRMED">ADMISSION_CONFIRMED</option>
          <option value="NOT_INTERESTED">NOT_INTERESTED</option>
        </select>

        {/* Counselor */}
        <select
          value={assignedCounselor ?? ""}
          onChange={(e) => setAssignedCounselor(e.target.value || null)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Assign Counselor</option>
          {counselors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>

        {/* Notes */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Counselor Notes"
          className="border px-3 py-2 rounded w-full"
          rows={4}
        />

        <button
          onClick={updateInquiry}
          className="bg-orange-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
