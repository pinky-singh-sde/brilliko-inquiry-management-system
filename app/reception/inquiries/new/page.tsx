"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import InquiryForm from "@/components/InquiryForm";
import Image from "next/image";

export default function ReceptionInquiryNewPage() {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 
  const loadBranch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("branch_id")
      .eq("id", user.id)
      .single();

    setBranchId(data?.branch_id ?? null);
  };
 useEffect(() => {
    loadBranch();
  }, []);

  async function handleSubmit(form: HTMLFormElement) {
    if (!branchId) return;

    setLoading(true);

    const { error } = await supabase.from("inquiries").insert({
      branch_id: branchId,
      student_name: form.student_name.value,
      father_name: form.father_name.value || null,
      gender: form.gender.value || null,
      mobile_primary: form.mobile_primary.value,
      email: form.email.value || null,
      qualification: form.qualification.value || null,
      employment_status: form.employment_status.value || null,
      course_interested: form.course_interested.value || null,
      lead_source: form.lead_source.value || null,
      receptionist_remarks: form.receptionist_remarks.value || null,
      status: "NEW",
    });

    setLoading(false);

    if (!error) {
      form.reset();
      alert("Inquiry created successfully");
    } else {
      alert(error.message);
    }
  }

  if (!branchId) {
    return <p className="text-gray-500 p-6">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
             <Image
                  src="/logo.png"
                  alt="Brilliko Institute"
                  width={70}
                  height={70}
                  className="mx-auto mb-4"
                />
      <h2 className="text-2xl font-semibold mb-6">
        New Inquiry
      </h2>

      <InquiryForm
        onSubmit={handleSubmit}
        showBranchSelect={false}
        loading={loading}
      />
    </div>
  );
}
