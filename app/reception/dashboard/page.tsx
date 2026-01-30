
"use client";

import Link from "next/link";
import { FileText, UserPlus, ArrowRight } from "lucide-react";

export default function ReceptionDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Reception Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage and register student inquiries for your branch
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* All Inquiries */}
        <DashboardCard
          href="/reception/inquiries"
          icon={<FileText size={26} />}
          title="All Inquiries"
          description="View and manage inquiries of your branch"
        />

        {/* New Inquiry */}
        <DashboardCard
          href="/reception/inquiries/new"
          icon={<UserPlus size={26} />}
          title="New Inquiry"
          description="Register a new student inquiry"
          highlight
        />
      </div>
    </div>
  );
}

/* ---------- Reusable Card ---------- */

function DashboardCard({
  href,
  icon,
  title,
  description,
  highlight = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-xl border bg-white p-6
        shadow-sm transition-all
        hover:shadow-lg hover:-translate-y-1
        ${highlight ? "border-orange-300" : "border-gray-200"}`}
    >
      {/* Accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1
          ${highlight ? "bg-orange-500" : "bg-gray-200"}
          group-hover:bg-orange-500 transition`}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg
              ${highlight ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}
              group-hover:bg-orange-100 group-hover:text-orange-600 transition`}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          </div>
        </div>

        <ArrowRight
          className="text-gray-400 group-hover:text-orange-500 transition"
          size={20}
        />
      </div>
    </Link>
  );
}
