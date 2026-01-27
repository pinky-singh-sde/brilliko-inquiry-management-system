// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function CreateStaffPage() {
//   const router = useRouter();
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("COUNSELOR");
//   const [loading, setLoading] = useState(false);

//   const handleCreate = async () => {
//     setLoading(true);

//     // 1️⃣ get current branch
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const { data: adminProfile } = await supabase
//       .from("profiles")
//       .select("branch_id")
//       .eq("id", user.id)
//       .single();

//     // 2️⃣ create auth user
//     const { data, error } = await supabase.auth.admin.createUser({
//       email,
//       password,
//       email_confirm: true,
//     });

//     if (error || !data.user) {
//       alert(error?.message);
//       return;
//     }

//     // 3️⃣ create profile
//     await supabase.from("profiles").insert({
//       id: data.user.id,
//       full_name: fullName,
//       role,
//       branch_id: adminProfile?.branch_id,
//       is_active: true,
//     });

//     setLoading(false);
//     router.push("/branch/staff");
//   };

//   return (
//     <div className="max-w-xl space-y-6">
//       <h2 className="text-2xl font-semibold">Add Staff</h2>

//       <div className="bg-white p-6 rounded-lg shadow space-y-4">
//         <input
//           placeholder="Full Name"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         />

//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         />

//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="COUNSELOR">Counselor</option>
//           <option value="RECEPTIONIST">Receptionist</option>
//         </select>

//         <button
//           onClick={handleCreate}
//           disabled={loading}
//           className="bg-orange-600 text-white px-4 py-2 rounded w-full"
//         >
//           Create Staff
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateStaffPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("COUNSELOR");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("branch_id")
      .eq("id", user.id)
      .single();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      alert(error?.message);
      return;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      role,
      branch_id: adminProfile?.branch_id,
      is_active: true,
    });

    setLoading(false);
    router.push("/branch/staff");
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Add Staff Member
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a new counselor or receptionist for this branch
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Temporary Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set initial password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="COUNSELOR">Counselor</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>

          {/* Action */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 transition"
          >
            {loading ? "Creating..." : "Create Staff"}
          </button>
        </div>
      </div>
    </div>
  );
}
