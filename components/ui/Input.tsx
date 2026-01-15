type Props = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
};

export default function Input({
  label,
  name,
  type = "text",
  required = false,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}
