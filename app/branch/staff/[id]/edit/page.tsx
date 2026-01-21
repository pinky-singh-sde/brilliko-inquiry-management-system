"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditStaffPage() {
  const { id } = useParams();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"COUNSELOR" | "RECEPTIONIST">("COUNSELOR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load staff details
  const loadStaff = async () => {
    setLoading(true);

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

  // 🔹 Save changes
  const saveChanges = async () => {
    setSaving(true);

    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        role,
      })
      .eq("id", id);

    setSaving(false);
    router.push("/branch/staff");
  };

  if (loading) {
    return <p className="text-gray-500">Loading staff...</p>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold">Edit Staff</h2>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border px-3 py-2 rounded w-full mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "COUNSELOR" | "RECEPTIONIST")
            }
            className="border px-3 py-2 rounded w-full mt-1"
          >
            <option value="COUNSELOR">Counselor</option>
            <option value="RECEPTIONIST">Receptionist</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>

          <button
            onClick={() => router.push("/branch/staff")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
