import { useEffect, useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Auto-hide success after 5s (clear feedback)
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(t);
  }, [success]);

  const handleSubscribe = async () => {
    setError(null);
    setSuccess(false);

    const trimmedEmail = email.trim();

    // ❌ EMPTY
    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    // ❌ INVALID FORMAT
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // ❌ DUPLICATE (frontend-safe)
    const stored: string[] = JSON.parse(
      localStorage.getItem("snexa_subscribers") || "[]"
    );

    if (stored.includes(trimmedEmail)) {
      setError("This email is already subscribed");
      return;
    }

    setLoading(true);

    try {
      // OPTIONAL backend (safe even if API not exists)
      try {
        await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        });
      } catch {
        // ignore API failure in frontend-only mode
      }

      localStorage.setItem(
        "snexa_subscribers",
        JSON.stringify([...stored, trimmedEmail])
      );

      setSuccess(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative mx-6 my-28 max-w-6xl mx-auto">
      <div className="relative rounded-[36px] p-[2px] bg-gradient-to-r from-orange-500/60 via-pink-500/60 to-purple-500/60">
        <div className="rounded-[34px] bg-black/80 backdrop-blur-2xl px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Stay Ahead of the Trend
          </h2>
          <p className="mt-3 text-white/60 max-w-md mx-auto">
            New drops, exclusive deals, and insider access — straight to your inbox.
          </p>

          {/* INPUT */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Enter your email"
              className={`
                w-full sm:w-80 px-6 py-4 rounded-full
                bg-white/10 text-white
                placeholder:text-white/40
                border
                ${
                  error
                    ? "border-red-400"
                    : success
                    ? "border-green-400"
                    : "border-white/20"
                }
                outline-none
                focus:ring-2 focus:ring-orange-400/40
              `}
            />

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="
                px-10 py-4 rounded-full
                bg-gradient-to-r from-orange-500 to-pink-500
                text-white font-medium
                transition-all duration-300
                hover:scale-105 hover:shadow-[0_0_40px_rgba(255,120,60,0.45)]
                disabled:opacity-60
              "
            >
              {loading ? "Joining..." : "Join Now"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="mt-5 text-sm text-red-400 font-medium">
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="mt-5 text-sm text-green-400 font-medium">
              🎉 Welcome to SNEXA — you’re officially in!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
