export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Super Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Branches" href="/admin/branches" />
        <DashboardCard title="Staff Users" href="/admin/users" />
        <DashboardCard title="All Inquiries" href="/admin/inquiries" />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="border rounded-lg p-6 hover:shadow-md transition bg-white"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 mt-2">
        Manage {title.toLowerCase()}
      </p>
    </a>
  );
}
