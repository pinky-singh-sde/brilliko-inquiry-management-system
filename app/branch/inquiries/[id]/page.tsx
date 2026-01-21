
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
          <strong>Student Name:</strong> {inquiry.student_name}
        </p>
        <p>
          <strong>Father Name:</strong> {inquiry.father_name}
        </p>
        <p>
          <strong>Mobile:</strong> {inquiry.mobile_primary}
        </p>
        <p>
          <strong>Qualification:</strong> {inquiry.qualification}
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
