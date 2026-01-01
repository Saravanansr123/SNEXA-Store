import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart, toggleCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  /* LOAD PRODUCT BY SLUG */
  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          where("slug", "==", slug)
        );

        const snapshot = await getDocs(q);
        const docSnap = snapshot.docs[0];

        if (docSnap) {
          const data = {
            id: docSnap.id,
            ...(docSnap.data() as Omit<Product, "id">),
          } as Product;

          setProduct(data);
          setSelectedSize(data.sizes[0] || "");
          setSelectedColor(data.colors[0] || "");
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  /* ADD TO CART */
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product || !selectedSize || !selectedColor) return;

    await addToCart(product.id, selectedSize, selectedColor, quantity);
    setAddedToCart(true);
    toggleCart();

    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* WISHLIST */
  const handleWishlistToggle = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product) return;

    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product.id);
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  /* NOT FOUND */
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-6">
            Product not found
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-full bg-white text-black hover:scale-105 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-14 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* BACK */}
        <button
          onClick={() => navigate("/products")}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
          {/* IMAGES */}
          <div>
            <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden mb-4">
              <img
                src={
                  product.images[selectedImage] ||
                  "https://via.placeholder.com/600x800"
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0
                          ? product.images.length - 1
                          : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur rounded-full hover:scale-110 transition"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1
                          ? 0
                          : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 backdrop-blur rounded-full hover:scale-110 transition"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? "border-white"
                        : "border-transparent hover:border-white/40"
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-3xl font-light mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-medium">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.compare_at_price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.compare_at_price.toLocaleString("en-IN")}
                  </span>
                  <span className="px-4 py-1 rounded-full bg-[#ff073a] text-white text-sm">
                    {Math.round(
                      ((product.compare_at_price - product.price) /
                        product.compare_at_price) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* SIZE */}
            <div className="mb-8">
              <label className="block mb-3 text-sm tracking-widest text-gray-400">
                SIZE
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded-full border transition ${
                      selectedSize === size
                        ? "bg-[#00f0ff] text-white border-white"
                        : "border-white/20 hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div className="mb-8">
              <label className="block mb-3 text-sm tracking-widest text-gray-400">
                COLOR
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2 rounded-full border capitalize transition ${
                      selectedColor === color
                        ? "bg-[#00f0ff] text-white border-white"
                        : "border-white/20 hover:border-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mb-10">
              <label className="block mb-3 text-sm tracking-widest text-gray-400">
                QUANTITY
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-white/30"
                >
                  -
                </button>

                <span className="w-10 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock, quantity + 1)
                    )
                  }
                  className="w-10 h-10 rounded-full border border-white/30"
                >
                  +
                </button>

                <span className="text-sm text-gray-400">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className="flex-1 py-4 rounded-full bg-[#ff073a] text-white hover:scale-[1.03] transition"
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check /> Added to Cart
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart /> Add to Cart
                  </span>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-full border transition ${
                  isInWishlist(product.id)
                    ? "bg-[#ff073a] text-white"
                    : "border-white/30"
                }`}
              >
                <Heart
                  fill={
                    isInWishlist(product.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
