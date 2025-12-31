import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
// import { supabase } from '../lib/supabase';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
}

interface WishlistPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const WishlistPage = ({ onNavigate }: WishlistPageProps) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, toggleCart } = useCart();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlistProducts();
  }, [wishlistItems]);

  const loadWishlistProducts = async () => {
    if (wishlistItems.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const productIds = wishlistItems.map((item) => item.product_id);

    // Firebase: fetch products by IDs
    try {
      const { db } = await import('../lib/firebase');
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      // Firestore 'in' queries support up to 10 items per query
      let allProducts: Product[] = [];
      for (let i = 0; i < productIds.length; i += 10) {
        const batchIds = productIds.slice(i, i + 10);
        const q = query(collection(db, 'products'), where('id', 'in', batchIds));
        const snapshot = await getDocs(q);
        allProducts = allProducts.concat(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      }
      setProducts(allProducts);
    } catch (error) {
      setProducts([]);
    }
    setLoading(false);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || 'Default';

    await addToCart(product.id, defaultSize, defaultColor, 1);
    toggleCart();
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400" />
      </div>
    );
  }

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10 text-center">
          <Heart size={56} className="mx-auto text-white/40 mb-4" />
          <p className="text-xl text-white/80 mb-6">
            Please sign in to view your wishlist
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

  /* ================= EMPTY ================= */
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-black py-20">
        <div className="max-w-4xl mx-auto bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-16 text-center">
          <Heart size={64} className="mx-auto text-white/40 mb-6" />
          <p className="text-2xl font-light text-white mb-2">
            Your wishlist is empty
          </p>
          <p className="text-white/60 mb-8">
            Save items you love for later
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-3 bg-[#ff073a] shadow-[0_0_6px_rgba(255,7,58,0.45)] text-white rounded-full hover:bg-green-500 transition-all font-medium"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ================= MAIN ================= */
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <Heart size={32} className="text-rose-400" />
          <h1 className="text-3xl font-light text-white">My Wishlist</h1>
          <span className="text-white/60">({products.length} items)</span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-rose-500/10 transition-all"
            >
              <div className="relative aspect-[3/4] bg-black overflow-hidden">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400x600'}
                  alt={product.name}
                  onClick={() => onNavigate('product', { slug: product.slug })}
                  className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
                />

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white/60 backdrop-blur-lg border border-white/10 rounded-full hover:bg-[#ff073a] hover:shadow-[0_0_6px_rgba(0,240,255,0.45)]  hover:text-white-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>

                {product.compare_at_price && (
                  <div className="absolute top-4 left-4 bg-[#ff073a] shadow-[0_0_6px_rgba(255,7,58,0.45)] text-white text-sm px-3 py-1 rounded-full font-medium">
                    {Math.round(
                      ((product.compare_at_price - product.price) /
                        product.compare_at_price) *
                        100
                    )}
                    % OFF
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3
                  onClick={() => onNavigate('product', { slug: product.slug })}
                  className="font-medium mb-2 line-clamp-2 cursor-pointer text-white hover:text-rose-400 transition-colors"
                >
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg font-medium text-rose-400">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-sm text-white/50 line-through">
                      ₹{product.compare_at_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-3 bg-[#ff073a] shadow-[0_0_6px_rgba(255,7,58,0.45)] text-white rounded-full hover:bg-rose-500 transition-all transform hover:scale-[1.02] font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
