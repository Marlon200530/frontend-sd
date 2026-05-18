
export function Toast({ toast }: { toast: { message: string; type: string } | null }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
      <div
        className={`rounded-xl border px-5 py-4 shadow-xl ${isError ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-white text-emerald-800"}`}
      >
        <p className="text-sm font-bold">{toast.message}</p>
      </div>
    </div>
  );
}

