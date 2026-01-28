"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Save,
} from "lucide-react";

type Inquiry = {
  id: string;
  student_name: string;
  father_name: string | null;
  mobile_primary: string;
  email: string | null;
  qualification: string | null;
  course_interested: string | null;
  status: string;
  receptionist_remarks: string | null;
};

export default function ReceptionInquiryDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInquiry();
  }, []);

  const loadInquiry = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select(`
        id,
        student_name,
        father_name,
        mobile_primary,
        email,
        qualification,
        course_interested,
        status,
        receptionist_remarks
      `)
      .eq("id", id)
      .single();

    if (!error && data) {
      setInquiry(data);
      setStatus(data.status);
      setRemarks(data.receptionist_remarks || "");
    }
  };

  const updateInquiry = async () => {

    if (inquiry && inquiry.status !== "NEW" && status !== inquiry.status) {
  alert("Status can only be changed once!");
  return;
}

    setLoading(true);

    const { error } = await supabase
      .from("inquiries")
      .update({
        status,
        receptionist_remarks: remarks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setLoading(false);

    if (!error) {
      alert("Inquiry updated");
      router.push("/reception/inquiries");
    } else {
      alert(error.message);
    }
  };

  if (!inquiry) {
    return <p className="text-gray-500 p-6">Loading inquiry...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <User size={22} />
          {inquiry.student_name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Inquiry details & reception update
        </p>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
        <InfoRow label="Father Name" value={inquiry.father_name} />
        <InfoRow label="Mobile" value={inquiry.mobile_primary} icon={<Phone size={16} />} />
        <InfoRow label="Email" value={inquiry.email} icon={<Mail size={16} />} />
        <InfoRow label="Qualification" value={inquiry.qualification} icon={<GraduationCap size={16} />} />
        <InfoRow label="Course" value={inquiry.course_interested} icon={<BookOpen size={16} />} />
      </div>

      {/* Update Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-800">
          Reception Update
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="NEW">NEW</option>
            <option value="FOLLOW_UP">FOLLOW UP</option>
            <option value="NOT_INTERESTED">NOT INTERESTED</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receptionist Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter follow-up notes..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 h-28 resize-none focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={updateInquiry}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-60"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Small UI helper (no logic change) */
function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="font-medium text-gray-600 w-32">
        {label}
      </span>
      <span className="text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}
