import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, SlidersHorizontal, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
  is_trending: boolean;
  is_new_arrival: boolean;
  colors: string[];
  sizes: string[];
}

interface ProductsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  categorySlug?: string;
}

export const ProductsPage = ({ onNavigate, categorySlug }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    sortBy: 'newest',
    type: 'all',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, toggleCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, [categorySlug]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let productsRef = collection(db, 'products');
      let productsQuery = productsRef;

      if (categorySlug && categorySlug !== 'all') {
        // Get category by slug
        const categoriesSnapshot = await getDocs(query(collection(db, 'categories'), where('slug', '==', categorySlug)));
        const categoryDoc = categoriesSnapshot.docs[0];
        if (categoryDoc) {
          productsQuery = query(productsRef, where('category_id', '==', categoryDoc.id));
        }
      }

      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(productsData);
    } catch (error) {
      // Optionally handle error
      setProducts([]);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    if (filters.type === 'trending') {
      filtered = filtered.filter((p) => p.is_trending);
    } else if (filters.type === 'new') {
      filtered = filtered.filter((p) => p.is_new_arrival);
    }

    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const handleWishlistToggle = (productId: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleQuickAdd = async (product: Product) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || 'Default';
    await addToCart(product.id, defaultSize, defaultColor, 1);
    toggleCart();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-gradient-to-br from-black via-zinc-900 to-black py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-light capitalize">
            {categorySlug && categorySlug !== 'all' ? categorySlug : 'All Products'}
          </h1>
          <p className="text-gray-400 mt-2">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'item' : 'items'} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* MOBILE FILTER BUTTON */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition"
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>

          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* FILTER PANEL */}
          <div
            className={`lg:block lg:w-72 ${
              isFilterOpen
                ? 'fixed top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-2xl z-50 p-6'
                : 'hidden'
            }`}
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-xl">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X />
                </button>
              </div>

              {/* PRICE */}
              <div>
                <h3 className="font-medium mb-4">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { label: 'All Prices', value: 'all' },
                    { label: 'Under ₹1,000', value: '0-1000' },
                    { label: '₹1,000 - ₹2,500', value: '1000-2500' },
                    { label: '₹2,500 - ₹5,000', value: '2500-5000' },
                    { label: 'Above ₹5,000', value: '5000-999999' },
                  ].map((option) => (
                    <label key={option.value} className="flex gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.priceRange === option.value}
                        onChange={() =>
                          setFilters({ ...filters, priceRange: option.value })
                        }
                        className="accent-white"
                      />
                      <span className="text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* TYPE */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="font-medium mb-4">Type</h3>
                <div className="space-y-2">
                  {[
                    { label: 'All Items', value: 'all' },
                    { label: 'Trending', value: 'trending' },
                    { label: 'New Arrivals', value: 'new' },
                  ].map((option) => (
                    <label key={option.value} className="flex gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.type === option.value}
                        onChange={() =>
                          setFilters({ ...filters, type: option.value })
                        }
                        className="accent-white"
                      />
                      <span className="text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SORT */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="font-medium mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-black border border-white/20 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[420px] rounded-3xl bg-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/400x600'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />

                      {product.compare_at_price && (
                        <div className="absolute top-4 left-4 bg-[#ff073a] shadow-[0_0_6px_rgba(255,7,58,0.45)] text-white text-black text-xs px-3 py-1 rounded-full">
                          {Math.round(
                            ((product.compare_at_price - product.price) /
                              product.compare_at_price) *
                              100
                          )}
                          % OFF
                        </div>
                      )}

                      <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleWishlistToggle(product.id)}
                          className={`p-3 rounded-full backdrop-blur ${
                            isInWishlist(product.id)
                              ? 'bg-[#ff073a] shadow-[0_0_6px_rgba(255,7,58,0.45)] text-white'
                              : 'bg-black/60 text-white'
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                          />
                        </button>

                        <button
                          onClick={() =>
                            onNavigate('product', { slug: product.slug })
                          }
                          className="p-3 rounded-full bg-black/60 backdrop-blur"
                        >
                          <Eye size={18} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="absolute bottom-4 left-4 right-4 py-3 bg-[#ff073a] shadow-[0_0_6px_rgba(255,7,58,0.45)] text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-green-500 transition hover:scale-105"
                      >
                        <ShoppingCart size={18} className="inline mr-2" />
                        Quick Add
                      </button>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.compare_at_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {(product.is_trending || product.is_new_arrival) && (
                        <div className="flex gap-2 mt-2">
                          {product.is_trending && (
                            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300">
                              Trending
                            </span>
                          )}
                          {product.is_new_arrival && (
                            <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                              New
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
