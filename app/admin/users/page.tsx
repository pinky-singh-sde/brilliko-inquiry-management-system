"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Branch = {
  id: string;
  name: string;
};

type Profile = {
  id: string;
  full_name: string;
  role: string;
  branch_id: string | null;
  branches?: Branch | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BRANCH_ADMIN");
  const [branchId, setBranchId] = useState("");
  const [loading, setLoading] = useState(false);


  // 🔹 Fetch users
//   const fetchUsers = async () => {
//     const { data } = await supabase
//       .from("profiles")
//       .select(`
//         id,
//         full_name,
//         role,
//         branch_id,
//         branches ( id, name )
//       `)
//       .order("created_at", { ascending: false });

//     if (data) setUsers(data);
//   };

const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        branch_id,
        branches:branch_id (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })
      .returns<Profile[]>();
  
    if (error) {
      console.error(error);
      return;
    }
  
    setUsers(data ?? []);
  };
  


  // 🔹 Fetch branches
  const fetchBranches = async () => {
    const { data } = await supabase
      .from("branches")
      .select("id, name");

    if (data) setBranches(data);
  };


  
  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  // 🔹 Create user
//   const handleCreateUser = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     /**
//      * IMPORTANT:
//      * In production, this should be done using:
//      * supabase.auth.admin.createUser() via API route
//      * (Never expose service role key on client)
//      */

//     const { data: authData, error: authError } =
//       await supabase.auth.signUp({
//         email,
//         password,
//       });

//     if (authError || !authData.user) {
//       alert(authError?.message || "Auth failed");
//       setLoading(false);
//       return;
//     }

//     const { error: profileError } = await supabase
//       .from("profiles")
//       .insert({
//         id: authData.user.id,
//         full_name: fullName,
//         role,
//         branch_id: branchId || null,
//       });

//     if (profileError) {
//       alert("Profile creation failed");
//     } else {
//       setFullName("");
//       setEmail("");
//       setPassword("");
//       setRole("BRANCH_ADMIN");
//       setBranchId("");
//       fetchUsers();
//     }

//     setLoading(false);
//   };

const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        role,
        branch_id: branchId,
      }),
    });
  
    const result = await res.json();
  
    if (!res.ok) {
      alert(result.error || "Failed to create user");
      setLoading(false);
      return;
    }
  
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("BRANCH_ADMIN");
    setBranchId("");
  
    fetchUsers();
    setLoading(false);
  };
  

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {/* Create User */}
      <form
        onSubmit={handleCreateUser}
        className="bg-white p-6 rounded-lg shadow max-w-xl mb-8"
      >
        <h2 className="font-medium mb-4">Create User</h2>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        >
          <option value="BRANCH_ADMIN">Branch Admin</option>
          <option value="RECEPTIONIST">Receptionist</option>
          <option value="COUNSELOR">Counselor</option>
        </select>

        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Branch</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.full_name}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  {u.branches?.name || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
