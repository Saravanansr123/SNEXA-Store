interface Props {
  title: string;
  value: string;
  change: string;
}

export default function StatCard({ title, value, change }: Props) {
  const positive = change.startsWith("+");

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
      <p className="text-sm text-white/60">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      <p className={`text-sm mt-1 ${positive ? "text-green-400" : "text-red-400"}`}>
        {change}
      </p>
    </div>
  );
}
