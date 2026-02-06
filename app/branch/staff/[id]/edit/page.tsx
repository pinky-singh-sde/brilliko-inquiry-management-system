// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";

// export default function EditStaffPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [fullName, setFullName] = useState("");
//   const [role, setRole] = useState<"COUNSELOR" | "RECEPTIONIST">("COUNSELOR");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // 🔹 Load staff details
//   const loadStaff = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("full_name, role")
//       .eq("id", id)
//       .single();

//     if (error || !data) {
//       alert("Staff not found or access denied");
//       router.push("/branch/staff");
//       return;
//     }

//     setFullName(data.full_name);
//     setRole(data.role);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadStaff();
//   }, []);

//   // 🔹 Save changes
//   const saveChanges = async () => {
//     setSaving(true);

//     await supabase
//       .from("profiles")
//       .update({
//         full_name: fullName,
//         role,
//       })
//       .eq("id", id);

//     setSaving(false);
//     router.push("/branch/staff");
//   };

//   if (loading) {
//     return <p className="text-gray-500">Loading staff...</p>;
//   }

//   return (
//     <div className="max-w-xl space-y-6">
//       <h2 className="text-2xl font-semibold">Edit Staff</h2>

//       <div className="bg-white p-6 rounded-lg shadow space-y-4">
//         <div>
//           <label className="text-sm font-medium">Full Name</label>
//           <input
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             className="border px-3 py-2 rounded w-full mt-1"
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Role</label>
//           <select
//             value={role}
//             onChange={(e) =>
//               setRole(e.target.value as "COUNSELOR" | "RECEPTIONIST")
//             }
//             className="border px-3 py-2 rounded w-full mt-1"
//           >
//             <option value="COUNSELOR">Counselor</option>
//             <option value="RECEPTIONIST">Receptionist</option>
//           </select>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={saveChanges}
//             disabled={saving}
//             className="bg-orange-600 text-white px-4 py-2 rounded"
//           >
//             Save Changes
//           </button>

//           <button
//             onClick={() => router.push("/branch/staff")}
//             className="border px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Lock } from "lucide-react";

export default function EditStaffPage() {
  const { id } = useParams();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"COUNSELOR" | "RECEPTIONIST">("COUNSELOR");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load staff details
  const loadStaff = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", id)
      .single();

    if (error || !data) {
      alert("Staff not found or access denied");
      router.push("/branch/staff");
      return;
    }

    setFullName(data.full_name);
    setRole(data.role);
    setLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // 🔹 Save profile + password
  const saveChanges = async () => {
    setSaving(true);

    // 1️⃣ Update profile
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        role,
      })
      .eq("id", id);

    // 2️⃣ Update password (only if entered)
    if (newPassword) {
      const session = await supabase.auth.getSession();

      await fetch("/api/branch/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          user_id: id,
          new_password: newPassword,
        }),
      });
    }

    setSaving(false);
    router.push("/branch/staff");
  };

  if (loading) {
    return <p className="text-gray-500">Loading staff...</p>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        Edit Staff Member
      </h2>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-medium text-gray-800">Profile Details</h3>

        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm
                       focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "COUNSELOR" | "RECEPTIONIST")
            }
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm
                       focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="COUNSELOR">Counselor</option>
            <option value="RECEPTIONIST">Receptionist</option>
          </select>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-orange-600" />
          <h3 className="font-medium text-gray-800">Security</h3>
        </div>

        <div>
          <label className="text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm
                       focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only enter a password if you want to change it.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={saveChanges}
          disabled={saving}
          className="bg-orange-600 text-white px-5 py-2 rounded-lg
                     hover:bg-orange-700 transition
                     disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={() => router.push("/branch/staff")}
          className="border px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
