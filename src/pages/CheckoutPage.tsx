import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, setDoc } from 'firebase/firestore';
import { Check } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CheckoutPage = ({ onNavigate }: CheckoutPageProps) => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);

    try {
      const orderNum = `ORD${Date.now()}`;

      // Create order in Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        user_id: user.uid,
        order_number: orderNum,
        status: 'pending',
        total_amount: total,
        payment_method: paymentMethod,
        payment_id: paymentMethod === 'upi' ? upiId : '',
        shipping_address: formData,
        created_at: new Date().toISOString(),
      });

      // Add order items as subcollection
      const orderItems = cartItems.map((item) => ({
        order_id: orderRef.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
        selected_size: item.selected_size,
        selected_color: item.selected_color,
        created_at: new Date().toISOString(),
      }));
      for (const item of orderItems) {
        await addDoc(collection(db, 'orders', orderRef.id, 'order_items'), item);
      }

      await clearCart();
      setOrderNumber(orderNum);
      setOrderPlaced(true);
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------- ORDER SUCCESS ---------- */
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full bg-black/60 backdrop-blur-xl
          border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-500/20 rounded-full
            flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-400" />
          </div>

          <h2 className="text-2xl font-light text-white mb-2">
            Order Placed Successfully
          </h2>

          <p className="text-white/60 mb-2">Order Number</p>
          <p className="text-xl font-medium text-rose-400 mb-6">
            {orderNumber}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('orders')}
              className="w-full py-3 bg-rose-400 text-black rounded-full
                hover:bg-rose-500 transition font-medium"
            >
              View My Orders
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full py-3 border border-white/20 text-white
                rounded-full hover:bg-white/10 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- MAIN CHECKOUT ---------- */
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-light text-white mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Shipping */}
              <div className="bg-black/60 backdrop-blur-xl border border-white/10
                rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-medium text-white mb-4">
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <input
                      key={key}
                      required
                      placeholder={key.replace(/([A-Z])/g, ' $1')}
                      value={value}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="px-4 py-3 rounded-lg bg-black/50
                        border border-white/10 text-white
                        focus:ring-2 focus:ring-rose-400 outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-black/60 backdrop-blur-xl border border-white/10
                rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-medium text-white mb-4">
                  Payment Method
                </h2>

                <label className="flex items-center gap-3 p-4 rounded-xl
                  bg-white/5 border border-white/10 cursor-pointer mb-3">
                  <input
                    type="radio"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <span className="text-white">UPI Payment</span>
                </label>

                {paymentMethod === 'upi' && (
                  <input
                    placeholder="UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/50
                      border border-white/10 text-white outline-none"
                  />
                )}

                <label className="flex items-center gap-3 p-4 rounded-xl
                  bg-white/5 border border-white/10 cursor-pointer mt-4">
                  <input
                    type="radio"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span className="text-white">Cash on Delivery</span>
                </label>
              </div>

              <button
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-rose-400
                  text-black font-medium hover:bg-rose-500 transition"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* RIGHT */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10
            rounded-2xl p-6 shadow-xl sticky top-24">
            <h2 className="text-xl font-medium text-white mb-4">
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 mb-4">
                <img
                  src={item.product?.images?.[0]}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-white text-sm">{item.product?.name}</p>
                  <p className="text-white/60 text-xs">
                    {item.selected_size} · {item.selected_color} · Qty {item.quantity}
                  </p>
                  <p className="text-rose-400 text-sm font-medium">
                    ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-white text-lg font-medium">
                <span>Total</span>
                <span className="text-rose-400">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
