// Add type declaration for default export
export type {};
export default function TopSellingProducts() {
  const items = ["Air Jordan 8", "Air Jordan 5", "Air Jordan 13", "Nike Air Max"];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="font-medium mb-4">Top Selling Products</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p} className="text-center">
            <div className="h-28 bg-white/10 rounded-xl mb-2" />
            <p className="text-sm">{p}</p>
            <p className="text-xs text-white/50">752 pcs</p>
          </div>
        ))}
      </div>
    </div>
  );
}
