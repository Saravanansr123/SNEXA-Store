export function SelectInput({ label, options, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-white/70">{label}</label>
      <select
        {...props}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2"
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
