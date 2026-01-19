// export default function AdminDashboard() {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-6">
//         Super Admin Dashboard
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <Card
//           title="Branches"
//           description="Create & manage all branches"
//           link="/admin/branches"
//         />

//         <Card
//           title="Users"
//           description="Create staff & assign roles"
//           link="/admin/users"
//         />

//         <Card
//           title="Inquiries"
//           description="View all inquiries across branches"
//           link="/admin/inquiries"
//         />
//       </div>
//     </div>
//   );
// }

// /* simple card */
// function Card({
//   title,
//   description,
//   link,
// }: {
//   title: string;
//   description: string;
//   link: string;
// }) {
//   return (
//     <a
//       href={link}
//       className="border rounded-xl p-6 hover:shadow-md transition bg-white"
//     >
//       <h3 className="text-lg font-medium">{title}</h3>
//       <p className="text-sm text-gray-500 mt-2">{description}</p>
//     </a>
//   );
// }

export default function AdminDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-orange-600">
        Super Admin Dashboard
      </h1>
      <p className="mt-2 text-gray-600">
        Login & middleware are working correctly.
      </p>
    </div>
  );
}
