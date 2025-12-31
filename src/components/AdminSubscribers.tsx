// AdminSubscribers.tsx
import { useEffect, useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminSubscribers() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletter/list")
      .then((res) => res.json())
      .then((data) => setSubs(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-8 py-20 max-w-6xl mx-auto">
      <h2 className="text-2xl text-white mb-8">
        Newsletter Subscribers
      </h2>

      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-2 p-4 text-white/70 text-sm border-b border-white/10">
          <span>Email</span>
          <span>Date</span>
        </div>

        {loading ? (
          <p className="p-6 text-white/50">Loading...</p>
        ) : subs.length === 0 ? (
          <p className="p-6 text-white/50">No subscribers yet</p>
        ) : (
          subs.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-2 p-4 text-white/80 text-sm
                         hover:bg-white/5 transition"
            >
              <span>{s.email}</span>
              <span>
                {new Date(s.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
