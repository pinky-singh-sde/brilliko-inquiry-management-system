// // app/inquiry/page.tsx
// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function InquiryPage() {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = e.target;

//     const { error } = await supabase.from("inquiries").insert({
//       branch_id: "BRANCH_UUID_HERE",
//       student_name: form.student_name.value,
//       mobile_primary: form.mobile_primary.value,
//       father_name: form.father_name.value,
//       qualification: form.qualification.value,
//       lead_source: form.lead_source.value,
//     });

//     if (!error) setSuccess(true);
//     setLoading(false);
//   };

//   if (success) {
//     return <p className="p-6 text-green-600">Inquiry submitted successfully</p>;
//   }

//   return (
//     <form onSubmit={handleSubmit} className="p-6 space-y-4">
//       <input name="student_name" placeholder="Student Name" required />
//       <input name="mobile_primary" placeholder="Mobile Number" required />
//       <input name="father_name" placeholder="Father Name" />
//       <input name="qualification" placeholder="Qualification" />
//       <input name="lead_source" placeholder="How did you know about us?" />

//       <button disabled={loading}>
//         {loading ? "Submitting..." : "Submit Inquiry"}
//       </button>
//     </form>
//   );
// }

// "use client";

// import Image from "next/image";
// import { supabase } from "@/lib/supabaseClient";
// import Input from "@/components/ui/Input";
// import Select from "@/components/ui/Select";
// import Button from "@/components/ui/Button";

// export default function InquiryPage() {
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     await supabase.from("inquiries").insert({
//       branch_id: "BRANCH_UUID_HERE",
//       student_name: form.student_name.value,
//       father_name: form.father_name.value,
//       mobile_primary: form.mobile_primary.value,
//       email: form.email.value,
//       qualification: form.qualification.value,
//       employment_status: form.employment_status.value,
//       lead_source: form.lead_source.value,
//       gender: form.gender.value,
//     });

//     form.reset();
//     alert("Inquiry submitted successfully");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white max-w-4xl w-full p-8 rounded-lg shadow-md"
//       >
//         {/* LOGO */}
//         <div className="flex justify-center mb-6">
//           <Image src="/logo.png" alt="Institute Logo" width={140} height={80} />
//         </div>

//         <h2 className="text-xl font-bold text-center mb-6">
//           Student Inquiry Form
//         </h2>

//         {/* FORM GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Input label="Student Name" name="student_name" required />
//           <Input label="Father / Guardian Name" name="father_name" />

//           <Select
//             label="Gender"
//             name="gender"
//             options={["Male", "Female", "Other"]}
//           />

//           <Input
//             label="Mobile Number"
//             name="mobile_primary"
//             required
//           />

//           <Input label="Email ID" name="email" type="email" />

//           <Select
//             label="Qualification"
//             name="qualification"
//             options={["10th", "10+2", "Graduate", "Post Graduate"]}
//           />

//           <Select
//             label="Employment Status"
//             name="employment_status"
//             options={["Working", "Not Working"]}
//           />

//           <Select
//             label="How did you hear about us?"
//             name="lead_source"
//             options={[
//               "Newspaper",
//               "Friends",
//               "Staff",
//               "Student",
//               "Social Media",
//               "Direct",
//               "Other",
//             ]}
//           />
//         </div>

//         <div className="mt-8">
//           <Button text="Submit Inquiry" />
//         </div>
//       </form>
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function InquiryPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    await supabase.from("inquiries").insert({
      branch_id: form.branch_id.value,
      student_name: form.student_name.value,
      father_name: form.father_name.value,
      gender: form.gender.value,
      mobile_primary: form.mobile_primary.value,
      email: form.email.value,
      qualification: form.qualification.value,
      employment_status: form.employment_status.value,
      course_interested: form.course_interested.value,
      lead_source: form.lead_source.value,
      remarks: form.remarks.value,
      status: "NEW",
    });

    form.reset();
    alert("Inquiry submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-4xl w-full p-8 rounded-xl shadow-lg"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Institute Logo" width={140} height={70} />
        </div>

        <h2 className="text-xl font-semibold text-center mb-8">
          Student Inquiry Form
        </h2>

        {/* BASIC INFORMATION */}
        <Section title="Basic Information">
          <Input label="Student Name" name="student_name" required />
          <Input label="Father / Guardian Name" name="father_name" />
          <Select
            label="Gender"
            name="gender"
            options={["Male", "Female", "Other"]}
          />
        </Section>

        {/* CONTACT DETAILS */}
        <Section title="Contact Details">
          <Input label="Phone Number" name="mobile_primary" required />
          <Input label="Email (Optional)" name="email" type="email" />
        </Section>

        {/* EDUCATION & WORK */}
        <Section title="Education & Work">
          <Select
            label="Qualification"
            name="qualification"
            options={["10th", "10+2", "Graduate", "Post Graduate"]}
          />
          <Select
            label="Employment Status"
            name="employment_status"
            options={["Working", "Not Working"]}
          />
        </Section>

        {/* COURSE DETAILS */}
        <Section title="Course Details">
          <Select
            label="Course Interested"
            name="course_interested"
            options={[
              "Web Development",
              "App Development",
              "Graphic Design",
              "Animation",
              "Other",
            ]}
          />

          <Select
            label="Branch"
            name="branch_id"
            // options={[
            //   { label: "Ferozepur (Main)", value: "BRANCH_UUID_1" },
            //   { label: "Sector 32", value: "BRANCH_UUID_2" },
            // ]}
          />

          <Select
            label="How did you know about us?"
            name="lead_source"
            options={[
              "Newspaper",
              "Friends",
              "Staff",
              "Student",
              "Social Media",
              "Direct",
              "Other",
            ]}
          />
        </Section>

        {/* REMARKS */}
        <div className="mt-6">
          <label className="text-sm font-medium">Remarks / Requirements</label>
          <textarea
            name="remarks"
            rows={3}
            className="w-full mt-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mt-8">
          <Button text="Submit Inquiry" />
        </div>
      </form>
    </div>
  );
}

/* SECTION WRAPPER — matches image divider style */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="border-t mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}
