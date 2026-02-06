// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// type Branch = {
//   id: string;
//   name: string;
// };

// type Profile = {
//   id: string;
//   full_name: string;
//   role: string;
//   branch_id: string | null;
//   is_active: boolean;
//   branches?: Branch | null;
// };

// export default function UsersPage() {
//   const [users, setUsers] = useState<Profile[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("BRANCH_ADMIN");
//   const [branchId, setBranchId] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🔹 Fetch users
//   const fetchUsers = async () => {
//     let query = supabase
//       .from("profiles")
//       .select(`
//         id,
//         full_name,
//         role,
//         branch_id,
//         is_active,
//         branches:branch_id (
//           id,
//           name
//         )
//       `)
//       .order("created_at", { ascending: false });

//     if (filter === "ACTIVE") query = query.eq("is_active", true);
//     if (filter === "INACTIVE") query = query.eq("is_active", false);

//     const { data, error } = await query.returns<Profile[]>();

//     if (!error) setUsers(data ?? []);
//   };

//   // 🔹 Fetch branches
//   const fetchBranches = async () => {
//     const { data } = await supabase
//       .from("branches")
//       .select("id, name");

//     if (data) setBranches(data);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [filter]);

//   useEffect(() => {
//     fetchUsers();
//     fetchBranches();
//   }, []);

//   // 🔹 Create user
//   const handleCreateUser = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch("/api/admin/create-user", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email,
//         password,
//         full_name: fullName,
//         role,
//         branch_id: branchId,
//       }),
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       alert(result.error || "Failed to create user");
//       setLoading(false);
//       return;
//     }

//     setFullName("");
//     setEmail("");
//     setPassword("");
//     setRole("BRANCH_ADMIN");
//     setBranchId("");

//     fetchUsers();
//     setLoading(false);
//   };

//   // 🔁 Toggle active / inactive
//   const toggleStatus = async (id: string, is_active: boolean) => {
//     await supabase
//       .from("profiles")
//       .update({ is_active: !is_active })
//       .eq("id", id);

//     fetchUsers();
//   };

//   return (
//     <div className="p-8 space-y-8">
//       <h1 className="text-2xl font-semibold">Users</h1>

//       {/* Create User */}
//       <form
//         onSubmit={handleCreateUser}
//         className="bg-white p-6 rounded-lg shadow max-w-xl"
//       >
//         <h2 className="font-medium mb-4">Create User</h2>

//         <input
//           placeholder="Full Name"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           className="w-full border rounded px-3 py-2 mb-3"
//           required
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border rounded px-3 py-2 mb-3"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border rounded px-3 py-2 mb-3"
//           required
//         />

//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border rounded px-3 py-2 mb-3"
//         >
//           <option value="BRANCH_ADMIN">Branch Admin</option>
//           <option value="RECEPTIONIST">Receptionist</option>
//           <option value="COUNSELOR">Counselor</option>
//         </select>

//         <select
//           value={branchId}
//           onChange={(e) => setBranchId(e.target.value)}
//           className="w-full border rounded px-3 py-2 mb-4"
//         >
//           <option value="">Select Branch</option>
//           {branches.map((b) => (
//             <option key={b.id} value={b.id}>
//               {b.name}
//             </option>
//           ))}
//         </select>

//         <button
//           disabled={loading}
//           className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Creating..." : "Create User"}
//         </button>
//       </form>

//       {/* Filter */}
//       <div className="flex gap-3">
//         {["ALL", "ACTIVE", "INACTIVE"].map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f as any)}
//             className={`px-4 py-1 rounded text-sm ${
//               filter === f
//                 ? "bg-orange-600 text-white"
//                 : "bg-gray-100"
//             }`}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       {/* Users List */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="text-left p-3">Name</th>
//               <th className="text-left p-3">Role</th>
//               <th className="text-left p-3">Branch</th>
//               <th className="text-left p-3">Status</th>
//               <th className="text-left p-3">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr key={u.id} className="border-t">
//                 <td className="p-3">{u.full_name}</td>
//                 <td className="p-3">{u.role}</td>
//                 <td className="p-3">{u.branches?.name || "-"}</td>
//                 <td className="p-3">
//                   {u.is_active ? (
//                     <span className="text-green-600 font-medium">Active</span>
//                   ) : (
//                     <span className="text-red-500 font-medium">Inactive</span>
//                   )}
//                 </td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => toggleStatus(u.id, u.is_active)}
//                     className={`px-3 py-1 rounded text-xs text-white ${
//                       u.is_active
//                         ? "bg-red-500 hover:bg-red-600"
//                         : "bg-green-600 hover:bg-green-700"
//                     }`}
//                   >
//                     {u.is_active ? "Deactivate" : "Activate"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import {
  UserPlus,
  Shield,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Branch = {
  id: string;
  name: string;
};

type Profile = {
  id: string;
  full_name: string;
  role: string;
  branch_id: string | null;
  is_active: boolean;
  branches?: Branch | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");


  // 🔐 Change password states
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BRANCH_ADMIN");
  const [branchId, setBranchId] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔑 Get current session token
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionToken(data.session.access_token);
      }
    });
  }, []);





  const fetchUsers = async () => {
    let query = supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        role,
        branch_id,
        is_active,
        branches:branch_id (
          id,
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (filter === "ACTIVE") query = query.eq("is_active", true);
    if (filter === "INACTIVE") query = query.eq("is_active", false);

    const { data } = await query.returns<Profile[]>();
    setUsers(data ?? []);
  };

  const fetchBranches = async () => {
    const { data } = await supabase.from("branches").select("id, name");
    if (data) setBranches(data);
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

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

  const toggleStatus = async (id: string, is_active: boolean) => {
    await supabase.from("profiles").update({ is_active: !is_active }).eq("id", id);
    fetchUsers();
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users Management</h1>
      </div>

      {/* Create User Card */}
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-5 h-5 text-orange-600" />
          <h2 className="font-semibold">Create New User</h2>
        </div>

        <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="col-span-2 border rounded-lg px-3 py-2"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-2 border rounded-lg px-3 py-2"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="col-span-2 border rounded-lg px-3 py-2"
            required
          />

          <div className="relative">
            <Shield className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg pl-9 pr-3 py-2"
            >
              <option value="BRANCH_ADMIN">Branch Admin</option>
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="COUNSELOR">Counselor</option>
            </select>
          </div>

          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full border rounded-lg pl-9 pr-3 py-2"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={loading}
            className="col-span-2 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {["ALL", "ACTIVE", "INACTIVE"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${filter === f
                ? "bg-orange-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Branch</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{u.full_name}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">{u.branches?.name || "-"}</td>
                <td className="p-4">
                  {u.is_active ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                      <XCircle className="w-4 h-4" /> Inactive
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {/* Activate / Deactivate */}
                    <button
                      onClick={() => toggleStatus(u.id, u.is_active)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition ${u.is_active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {u.is_active ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>

                    {/* Change Password (secondary action) */}
                    <button
                      onClick={() => setSelectedUser(u.id)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium
                 text-orange-600 border border-orange-200
                 hover:bg-orange-50 transition"
                    >
                      Change Password
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 🔐 Change Password Modal */}
      {selectedUser && (
        <ChangePasswordModal
          userId={selectedUser}
          apiUrl="/api/admin/reset-password"
          token={sessionToken}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
