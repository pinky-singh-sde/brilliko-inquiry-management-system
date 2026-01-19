// export default function AdminDashboard() {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">
//         Super Admin Dashboard
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <DashboardCard title="Branches" href="/admin/branches" />
//         <DashboardCard title="Staff Users" href="/admin/users" />
//         <DashboardCard title="All Inquiries" href="/admin/inquiries" />
//       </div>
//     </div>
//   );
// }

// function DashboardCard({
//   title,
//   href,
// }: {
//   title: string;
//   href: string;
// }) {
//   return (
//     <a
//       href={href}
//       className="border rounded-lg p-6 hover:shadow-md transition bg-white"
//     >
//       <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-sm text-gray-500 mt-2">
//         Manage {title.toLowerCase()}
//       </p>
//     </a>
//   );
// }


export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Super Admin
        </h1>
        <p className="text-gray-500 mt-2">
          Control everything from one Dashboard
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardCard
          title="Branches"
          description="Create, update & manage all branches"
          href="/admin/branches"
          gradient="from-blue-500 to-indigo-500"
        />

        <DashboardCard
          title="Staff Users"
          description="Manage admins, counselors & receptionists"
          href="/admin/users"
          gradient="from-orange-500 to-red-500"
        />

        <DashboardCard
          title="Inquiries"
          description="Track and respond to student inquiries"
          href="/admin/inquiries"
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
}: {
  title: string;
  description: string;
  href: string;
  gradient: string;
}) {
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white p-6
                 shadow-md transition-all duration-300
                 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Gradient accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${gradient}`}
      />

      <div className="relative">
        <h2 className="text-xl font-semibold text-gray-800
                       group-hover:text-gray-900">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          {description}
        </p>

        <div className="mt-6 inline-flex items-center text-sm font-medium text-gray-700
                        group-hover:text-orange-600 transition">
          Open
          <span className="ml-2 transform transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </a>
  );
}
