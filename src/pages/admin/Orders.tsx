import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase"; // correct for your structure

type Order = {
  id: string;
  orderId?: string;
  totalAmount?: number;
  status?: "pending" | "completed" | "cancelled" | string;
  createdAt?: Timestamp;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Order, "id">),
        }));

        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <p className="text-white/60">Loading orders...</p>;
  }

  if (!orders.length) {
    return (
      <p className="text-white/40 text-center mt-10">
        No orders found
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Orders</h1>

      <div className="bg-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10 text-white/60">
            <tr>
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  {order.orderId ?? order.id}
                </td>

                <td className="px-4 py-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs
                      ${
                        order.status === "pending"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : order.status === "completed"
                          ? "bg-emerald-400/20 text-emerald-400"
                          : "bg-rose-400/20 text-rose-400"
                      }`}
                  >
                    {order.status ?? "unknown"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  ₹{order.totalAmount?.toLocaleString() ?? "0"}
                </td>

                <td className="px-4 py-3 text-white/60">
                  {order.createdAt
                    ? order.createdAt.toDate().toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
