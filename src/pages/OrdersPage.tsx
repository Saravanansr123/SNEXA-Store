import { useState, useEffect } from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
}

interface OrdersPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const OrdersPage = ({ onNavigate }: OrdersPageProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    const q = query(
      collection(db, 'orders'),
      where('user_id', '==', user.uid),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
    setOrders(ordersData);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10 text-center">
          <Package size={56} className="mx-auto text-white/40 mb-4" />
          <p className="text-xl text-white/80 mb-6">
            Please sign in to view your orders
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-8 py-3 bg-rose-400 text-black rounded-full hover:bg-rose-500 transition-all font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <Package size={32} className="text-rose-400" />
          <h1 className="text-3xl font-light text-white">My Orders</h1>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-pulse"
              >
                <div className="h-5 bg-white/10 rounded w-1/4 mb-4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>

        /* EMPTY STATE */
        ) : orders.length === 0 ? (
          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-20 text-center">
            <Package size={64} className="mx-auto text-white/40 mb-6" />
            <p className="text-2xl font-light text-white mb-2">No orders yet</p>
            <p className="text-white/60 mb-8">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-rose-400 text-black rounded-full hover:bg-rose-500 transition-all font-medium"
            >
              Start Shopping
            </button>
          </div>

        /* ORDERS LIST */
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-rose-500/10 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-medium text-lg text-white mb-1">
                      Order {order.order_number}
                    </h3>
                    <p className="text-sm text-white/50">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="text-sm text-white/50">Total Amount</p>
                    <p className="text-2xl font-medium text-rose-400">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-white/50 mt-1 capitalize">
                      Payment: {order.payment_method}
                    </p>
                  </div>

                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-rose-400 hover:text-rose-400 transition-all"
                  >
                    View Details
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
