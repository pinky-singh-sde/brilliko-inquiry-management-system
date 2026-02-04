

// export default function AdminDashboard() {
//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
//       {/* Header */}
//       <div className="mb-10">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Super Admin
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Control everything from one Dashboard
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         <DashboardCard
//           title="Branches"
//           description="Create, update & manage all branches"
//           href="/admin/branches"
//           gradient="from-blue-500 to-indigo-500"
//         />

//         <DashboardCard
//           title="Staff Users"
//           description="Manage admins, counselors & receptionists"
//           href="/admin/users"
//           gradient="from-orange-500 to-red-500"
//         />

//         <DashboardCard
//           title="Inquiries"
//           description="Track and respond to student inquiries"
//           href="/admin/inquiries"
//           gradient="from-emerald-500 to-teal-500"
//         />
//       </div>
//     </div>
//   );
// }

// function DashboardCard({
//   title,
//   description,
//   href,
//   gradient,
// }: {
//   title: string;
//   description: string;
//   href: string;
//   gradient: string;
// }) {
//   return (
//     <a
//       href={href}
//       className="group relative overflow-hidden rounded-2xl bg-white p-6
//                  shadow-md transition-all duration-300
//                  hover:shadow-xl hover:-translate-y-1"
//     >
//       {/* Gradient accent */}
//       <div
//         className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${gradient}`}
//       />

//       <div className="relative">
//         <h2 className="text-xl font-semibold text-gray-800
//                        group-hover:text-gray-900">
//           {title}
//         </h2>

//         <p className="text-sm text-gray-500 mt-2">
//           {description}
//         </p>

//         <div className="mt-6 inline-flex items-center text-sm font-medium text-gray-700
//                         group-hover:text-orange-600 transition">
//           Open
//           <span className="ml-2 transform transition group-hover:translate-x-1">
//             →
//           </span>
//         </div>
//       </div>
//     </a>
//   );
// }



"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  MessageSquareText,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Super Admin
        </h1>
        <p className="text-gray-500 mt-2">
          Control everything from one dashboard
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <DashboardCard
          title="Branches"
          description="Create, update & manage all branches"
          href="/admin/branches"
          icon={Building2}
          gradient="from-blue-500 to-indigo-500"
        />

        <DashboardCard
          title="Staff Users"
          description="Manage admins, counselors & receptionists"
          href="/admin/users"
          icon={Users}
          gradient="from-orange-500 to-red-500"
        />

        <DashboardCard
          title="Inquiries"
          description="Track and respond to student inquiries"
          href="/admin/inquiries"
          icon={MessageSquareText}
          gradient="from-emerald-500 to-teal-500"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  gradient,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  gradient: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white p-6
                 shadow-sm transition-all duration-300
                 hover:shadow-xl hover:-translate-y-1
                 focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {/* Gradient top border */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
      />

      <div className="relative flex flex-col h-full">
        {/* Icon */}
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
          <Icon className="h-5 w-5 text-gray-700 group-hover:text-orange-600 transition" />
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-2 flex-1">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-6 inline-flex items-center text-sm font-medium text-gray-700
                        group-hover:text-orange-600 transition">
          Open
          <span className="ml-2 transform transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
