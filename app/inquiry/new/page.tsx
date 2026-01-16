"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";


export default function InquiryNewPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const f = e.currentTarget;

    const { error } =  await supabase.from("inquiries").insert({
      branch_id: f.branch_id.value,
      student_name: f.student_name.value,
      father_name: f.father_name.value || null,
      gender: f.gender.value || null,
      mobile_primary: f.mobile_primary.value,
      email: f.email.value || null,
      qualification: f.qualification.value || null,
      employment_status: f.employment_status.value || null,
      course_interested : f.course_interested.value || null,
      lead_source: f.lead_source.value || null,
      receptionist_remarks: f.receptionist_remarks.value || null,
    });

    
    setLoading(false);

    if (!error) {
        setSuccess(true);
        f.reset();
      } else {
        alert(error.message);
      }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Institute Logo" className="h-10" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center">
          Student Inquiry Form
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Please fill in the details below accurately
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

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
              <Select name="course_interested"  label="Course Interested">
                <option value="">Select Course</option>
                <option>Web Development</option>
                <option>Digital Marketing</option>
              </Select>

              <Select name="branch_id" label="Branch" required>
                <option value="">Select Branch</option>
                <option value="92877c67-ba77-4c47-9b45-0e7eb38bb2f2">Ferozepur</option>
                <option value="9f08ddd8-9fb4-4e91-9511-ee0ecc312374">Sector 32</option>
              </Select>
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

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-lg font-semibold"
          >
            {loading ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- reusable UI ---------------- */

type SectionProps = {
    title: string;
    children: ReactNode;
  };
  

function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 border-b pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

type TwoColProps = {
    children: ReactNode;
  };

function TwoCol({ children }: TwoColProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}


type InputProps = {
    label: string;
  } & InputHTMLAttributes<HTMLInputElement>;  
function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="label">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

type SelectProps = {
    label: string;
    children: ReactNode;
  } & SelectHTMLAttributes<HTMLSelectElement>;

function Select({ label, children, ...props }: SelectProps) {
  return (
    <div>
      <label className="label">{label}</label>
      <select {...props} className="input">
        {children}
      </select>
    </div>
  );
}

type TextareaProps = {
    label: string;
  } & TextareaHTMLAttributes<HTMLTextAreaElement>;
  
function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea {...props} className="input h-28" />
    </div>
  );
}
