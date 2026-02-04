
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
  
//     const {
//       data: { session },
//     } = await supabase.auth.getSession();
  
//     if (!session) {
//       alert("Not authenticated");
//       return;
//     }
  
//     const res = await fetch("/api/branch/create-staff", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session.access_token}`,
//       },
//       body: JSON.stringify({
//         email,
//         password,
//         full_name: fullName,
//         role,
//       }),
//     });
  
//     const data = await res.json();
  
//     if (!res.ok) {
//       alert(data.error);
//       setLoading(false);
//       return;
//     }
  
//     setLoading(false);
//     router.push("/branch/staff");
//   };
  
//   return (
//     <div className="flex justify-center">
//       <div className="w-full max-w-lg space-y-6">
//         {/* Header */}
//         <div>
//           <h2 className="text-xl sm:text-2xl font-semibold">
//             Add Staff Member
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Create a new counselor or receptionist for this branch
//           </p>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
//           {/* Full Name */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Full Name
//             </label>
//             <input
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Enter full name"
//               className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Email Address
//             </label>
//             <input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="staff@example.com"
//               className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Temporary Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Set initial password"
//               className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>

//           {/* Role */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Role
//             </label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//             >
//               <option value="COUNSELOR">Counselor</option>
//               <option value="RECEPTIONIST">Receptionist</option>
//             </select>
//           </div>

//           {/* Action */}
//           <button
//             onClick={handleCreate}
//             disabled={loading}
//             className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 transition"
//           >
//             {loading ? "Creating..." : "Create Staff"}
//           </button>
//         </div>
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
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);

    // 🛑 Basic validation
    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You are not authenticated");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/branch/create-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError("This email is already registered");
        } else {
          setError(data.error || "Something went wrong");
        }
        setLoading(false);
        return;
      }

      router.push("/branch/staff");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
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
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
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
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="COUNSELOR">Counselor</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>

          {/* Action */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating..." : "Create Staff"}
          </button>
        </div>
      </div>
    </div>
  );
}
