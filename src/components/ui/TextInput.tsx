export function TextInput({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-white/70">{label}</label>
      <input
        {...props}
        className="
          w-full
          bg-black/40
          border border-white/10
          rounded-lg
          px-3 py-2
          text-white
          outline-none
        "
      />
    </div>
  );
}
