// Add type declaration for default export
export type {};
export default function CurrentOffers() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="font-medium mb-4">Current Offer</h3>

      <div className="space-y-4 text-sm">
        <div>
          <p>40% Discount Offer</p>
          <div className="h-2 bg-emerald-400 rounded mt-2" />
        </div>

        <div>
          <p>100 Taka Coupon</p>
          <div className="h-2 bg-white/10 rounded mt-2" />
        </div>

        <div>
          <p>Stock Out Sale</p>
          <div className="h-2 bg-red-400 rounded mt-2" />
        </div>
      </div>
    </div>
  );
}
