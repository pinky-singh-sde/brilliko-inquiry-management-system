"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FileText, UserPlus } from "lucide-react";

export default function ReceptionDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reception Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage student inquiries efficiently
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* All Inquiries */}
        <Link
          href="/reception/inquiries"
          className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all hover:border-orange-400"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition">
              <FileText size={24} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                All Inquiries
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                View inquiries of your branch
              </p>
            </div>
          </div>
        </Link>

        {/* New Inquiry */}
        <Link
          href="/reception/inquiries/new"
          className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all hover:border-orange-400"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition">
              <UserPlus size={24} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                New Inquiry
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Register new student inquiry
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
