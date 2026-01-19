


"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Branch = {
  id: string;
  name: string;
  parent_branch_id: string | null;
  is_main: boolean;
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch branches
  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at");

    if (!error && data) {
      setBranches(data);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // 🔹 Create branch
  const createBranch = async () => {
    if (!name.trim()) return;

    setLoading(true);

    const isFirstBranch = branches.length === 0;

    await supabase.from("branches").insert({
      name,
      parent_branch_id: isFirstBranch ? null : parentId,
      is_main: isFirstBranch, // ✅ first branch becomes main
    });

    setName("");
    setParentId(null);
    setLoading(false);
    fetchBranches();
  };

  // 🔥 Set Main Branch
  const setMainBranch = async (id: string) => {
    // remove old main
    await supabase
      .from("branches")
      .update({ is_main: false })
      .eq("is_main", true);

    // set new main
    await supabase
      .from("branches")
      .update({ is_main: true, parent_branch_id: null })
      .eq("id", id);

    fetchBranches();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Branches</h2>

      {/* ➕ Add Branch */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h3 className="font-medium">Add Branch</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Branch Name"
          className="border px-3 py-2 rounded w-full"
        />

        <select
          value={parentId ?? ""}
          onChange={(e) => setParentId(e.target.value || null)}
          className="border px-3 py-2 rounded w-full"
          disabled={branches.length === 0}
        >
          <option value="">No Parent (Main / Independent)</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          onClick={createBranch}
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Branch"}
        </button>
      </div>

      {/* 📋 Branch List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {branches.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500"
                >
                  No branches yet. Create the first branch.
                </td>
              </tr>
            )}

            {branches.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.name}</td>

                <td className="p-3 text-center">
                  {b.is_main ? (
                    <span className="text-green-600 font-medium">
                      Main Branch
                    </span>
                  ) : (
                    "Sub Branch"
                  )}
                </td>

                <td className="p-3 text-center">
                  {!b.is_main && (
                    <button
                      onClick={() => setMainBranch(b.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Make Main
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
