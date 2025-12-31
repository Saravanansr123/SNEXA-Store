import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface CartPanelProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CartPanel = ({ onNavigate }: CartPanelProps) => {
  const { cartItems, isCartOpen, toggleCart, updateCartItem, removeFromCart } =
    useCart();
  const { user } = useAuth();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    toggleCart();
    onNavigate('checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={toggleCart}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col
        bg-black/70 backdrop-blur-xl border-l border-white/10 shadow-2xl animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-medium flex items-center gap-2 text-white">
            <ShoppingBag size={24} className="text-rose-400" />
            Shopping Cart
            {cartItems.length > 0 && (
              <span className="text-sm text-white/60">
                ({cartItems.length})
              </span>
            )}
          </h2>

          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X size={22} className="text-white" />
          </button>
        </div>

        {/* Not Logged In */}
        {!user ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <ShoppingBag size={64} className="mx-auto text-white/30 mb-4" />
              <p className="text-white/70 mb-4">
                Please sign in to view your cart
              </p>
              <button
                onClick={() => {
                  toggleCart();
                  onNavigate('login');
                }}
                className="px-6 py-2 bg-rose-400 text-black rounded-full hover:bg-rose-500 transition"
              >
                Sign In
              </button>
            </div>
          </div>

        /* Empty Cart */
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <ShoppingBag size={64} className="mx-auto text-white/30 mb-4" />
              <p className="text-white/70 mb-4">Your cart is empty</p>
              <button
                onClick={() => {
                  toggleCart();
                  onNavigate('home');
                }}
                className="px-6 py-2 bg-rose-400 text-black rounded-full hover:bg-rose-500 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        /* Cart Items */
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl
                    bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <img
                    src={
                      item.product?.images?.[0] ||
                      'https://via.placeholder.com/100'
                    }
                    alt={item.product?.name || 'Product'}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">
                      {item.product?.name}
                    </h3>

                    <p className="text-sm text-white/60 mb-1">
                      Size: {item.selected_size} | Color: {item.selected_color}
                    </p>

                    <p className="font-medium text-rose-400">
                      ₹{item.product?.price?.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 px-3 py-1
                        rounded-full bg-black/60 border border-white/10">
                        <button
                          onClick={() =>
                            updateCartItem(item.id, item.quantity - 1)
                          }
                          className="hover:text-rose-400 transition"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-6 text-center text-white">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateCartItem(item.id, item.quantity + 1)
                          }
                          className="hover:text-rose-400 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-400 hover:text-red-500 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 space-y-4">
              <div className="flex justify-between text-lg font-medium text-white">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-full
                  bg-rose-400 text-black font-medium
                  hover:bg-rose-500 transition transform hover:scale-[1.02]"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={toggleCart}
                className="w-full py-3 rounded-full
                  border border-white/20 text-white
                  hover:bg-white/10 transition"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.35s ease-out;
        }
      `}</style>
    </>
  );
};
