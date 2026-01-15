type Props = {
  label: string;
  name: string;
  // options: string[];
  options?: (string | { label: string; value: string })[];
};

export default function Select({ label, name, options = [] }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        name={name}
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="">Select</option>
        {/* {options.map((opt) => (
-          <option key={opt} value={opt}>
-            {opt}
-          </option>
-        ))} */}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
