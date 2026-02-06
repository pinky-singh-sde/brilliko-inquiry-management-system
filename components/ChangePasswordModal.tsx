// "use client";

// import { useState } from "react";

// type Props = {
//   userId: string;
//   apiUrl: string;
//   token?: string;
//   onClose: () => void;
// };

// export default function ChangePasswordModal({
//   userId,
//   apiUrl,
//   token,
//   onClose,
// }: Props) {
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!password) return alert("Password required");

//     setLoading(true);

//     const res = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: JSON.stringify({
//         user_id: userId,
//         new_password: password,
//       }),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (!res.ok) {
//       alert(data.error);
//       return;
//     }

//     alert("Password updated successfully");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
//         <h3 className="text-lg font-semibold">Change Password</h3>

//         <input
//           type="password"
//           placeholder="New password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />

//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-4 py-2 text-sm bg-orange-600 text-white rounded"
//           >
//             {loading ? "Saving..." : "Update"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Lock, X } from "lucide-react";

type Props = {
  userId: string;
  apiUrl: string;
  token?: string;
  onClose: () => void;
};

export default function ChangePasswordModal({
  userId,
  apiUrl,
  token,
  onClose,
}: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password) return alert("Password required");

    setLoading(true);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        user_id: userId,
        new_password: password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Password updated successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <Lock size={18} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Change Password
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">
            Set a new password for this user. They will need to use the new
            password on their next login.
          </p>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-500
                         focus:border-orange-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border text-gray-700
                       hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-orange-600 text-white
                       hover:bg-orange-700 transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
