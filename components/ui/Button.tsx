export default function Button({ text }: { text: string }) {
  return (
    <button
      type="submit"
      className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700"
    >
      {text}
    </button>
  );
}
