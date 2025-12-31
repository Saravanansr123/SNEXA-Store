import { StatCard, SalesAnalytics, TopSellingProducts, CurrentOffers } from "../../components/admin";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-semibold">Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value="$82,650" change="+11%" />
          <StatCard title="Total Orders" value="1,645" change="+11%" />
          <StatCard title="Total Customer" value="1,462" change="-17%" />
          <StatCard title="Pending Delivery" value="117" change="+7%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesAnalytics />
          </div>
          {/* <SalesTarget /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopSellingProducts />
          </div>
          <CurrentOffers />
        </div>
      </main>
    </div>
  );
}
