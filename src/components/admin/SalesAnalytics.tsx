// Add type declaration for default export
export type {};
export default function SalesAnalytics() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
      <h3 className="font-medium mb-4">Sales Analytic</h3>

      <div className="relative h-56 bg-gradient-to-t from-emerald-400/20 to-transparent rounded-xl">
        <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full">
          <polyline
            fill="none"
            stroke="#34D399"
            strokeWidth="2"
            points="0,30 10,22 20,25 30,15 40,18 50,8 60,14 70,10 80,18 90,12 100,14"
          />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-sm text-white/70">
        <p>Income: ₹23,262</p>
        <p>Expenses: ₹11,135</p>
        <p className="text-green-400">Balance: ₹48,135</p>
      </div>
    </div>
  );
}
