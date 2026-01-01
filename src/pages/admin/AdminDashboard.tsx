import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

import {
  StatCard,
  SalesAnalytics,
  TopSellingProducts,
  CurrentOffers,
} from "../../components/admin";

export default function AdminDashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pendingDelivery, setPendingDelivery] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const usersRef = collection(db, "users");

        const pendingQuery = query(
          ordersRef,
          where("status", "==", "pending")
        );

        const [orders, users, pending] = await Promise.all([
          getCountFromServer(ordersRef),
          getCountFromServer(usersRef),
          getCountFromServer(pendingQuery),
        ]);

        setTotalOrders(orders.data().count);
        setTotalCustomers(users.data().count);
        setPendingDelivery(pending.data().count);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Overview</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$82,650" change="+11%" />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          change="+11%"
          loading={loading}
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          change="-17%"
          loading={loading}
        />
        <StatCard
          title="Pending Delivery"
          value={pendingDelivery.toLocaleString()}
          change="+7%"
          loading={loading}
        />
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 min-h-[300px]">
          <SalesAnalytics />
        </div>
      </div>

      {/* PRODUCTS & OFFERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 min-h-[300px]">
          <TopSellingProducts />
        </div>
        <div className="min-h-[300px]">
          <CurrentOffers />
        </div>
      </div>
    </div>
  );
}
