import { Skeleton } from "./Skeleton";

type Props = {
  title: string;
  value?: string;
  change?: string;
  loading?: boolean;
};

export default function StatCard({
  title,
  value,
  change,
  loading,
}: Props) {
  return (
    <div className="bg-white/5 rounded-xl p-4 space-y-2">
      <p className="text-sm text-white/60">{title}</p>

      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="text-2xl font-semibold">{value}</p>
      )}

      {!loading && change && (
        <p className="text-xs text-emerald-400">{change}</p>
      )}
    </div>
  );
}
