"use client";

import { useEffect, useState, ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { supabase } from "@/lib/supabaseClient";

type Branch = {
  id: string;
  name: string;
};

type InquiryFormProps = {
  onSubmit: (form: HTMLFormElement) => Promise<void>;
  showBranchSelect?: boolean;
  loading?: boolean;
};

export default function InquiryForm({
  onSubmit,
  showBranchSelect = false,
  loading = false,
}: InquiryFormProps) {
  const [branches, setBranches] = useState<Branch[]>([]);



  const loadBranches = async () => {
    const { data, error } = await supabase
      .from("branches")
      .select("id, name")
      .order("name");

    if (!error && data) {
      setBranches(data);
    }
  };
  useEffect(() => {
    if (showBranchSelect) {
      loadBranches();
    }
  }, [showBranchSelect]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="space-y-8"
    >
      {/* BASIC INFO */}
      <Section title="Basic Information">
        <TwoCol>
          <Input name="student_name" label="Student Name" required />
          <Input name="father_name" label="Father / Guardian Name" />
        </TwoCol>

        <Select name="gender" label="Gender">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </Select>
      </Section>

      {/* CONTACT */}
      <Section title="Contact Details">
        <TwoCol>
          <Input name="mobile_primary" label="Phone Number" required />
          <Input name="email" label="Email (Optional)" />
        </TwoCol>
      </Section>

      {/* EDUCATION */}
      <Section title="Education & Work">
        <Select name="qualification" label="Qualification">
          <option value="">Select Qualification</option>
          <option>10th</option>
          <option>12th</option>
          <option>Graduate</option>
        </Select>

        <Select name="employment_status" label="Employment Status">
          <option value="">Select Status</option>
          <option>Student</option>
          <option>Working</option>
          <option>Unemployed</option>
        </Select>
      </Section>

      {/* COURSE */}
      <Section title="Course Details">
        <TwoCol>
          <Select name="course_interested" label="Course Interested">
            <option value="">Select Course</option>
            <option>Web Development</option>
            <option>Digital Marketing</option>
          </Select>

          {showBranchSelect && (
            <Select name="branch_id" label="Branch" required>
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          )}
        </TwoCol>

        <Select name="lead_source" label="How did you know about us?">
          <option value="">Select Source</option>
          <option>Walk-in</option>
          <option>Facebook</option>
          <option>Instagram</option>
          <option>Referral</option>
        </Select>

        <Textarea name="receptionist_remarks" label="Remarks / Requirements" />
      </Section>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-lg font-semibold"
      >
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}


/* ---------- UI helpers ---------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 border-b pb-2">{title}</h3>
      {children}
    </div>
  );
}

function TwoCol({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function Input({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

function Select({
  label,
  children,
  ...props
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="label">{label}</label>
      <select {...props} className="input">
        {children}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea {...props} className="input h-28" />
    </div>
  );
}
