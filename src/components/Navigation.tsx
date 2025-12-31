import {
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { HoverImageLinks } from "./HoverImageLinks";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  /* ================= CONTEXT ================= */
  const { user } = useAuth();
  const { cartCount, toggleCart } = useCart();

  /* ================= STATE ================= */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hidden, setHidden] = useState(false);

  /* ================= SCROLL DIRECTION ================= */
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 80) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }
  });

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* ================= ESC KEY CLOSE ================= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ================= AUTO CLOSE ON ROUTE ================= */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  /* ================= SEARCH ================= */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate("search", { q: searchQuery });
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ================= STICKY HEADER ================= */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-[60] bg-black/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>

            <span
              onClick={() => onNavigate("home")}
              className="cursor-pointer text-white text-sm tracking-[0.35em]"
            >
              SNEXA
            </span>
          </div>

          {/* CENTER (DESKTOP SEARCH) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5"
          >
            <Search size={16} className="text-white/70" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="bg-transparent text-sm text-white outline-none placeholder:text-white/50 w-56"
            />
          </form>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("wishlist")} className="p-2">
              <Heart size={18} className="text-white" />
            </button>

            <button onClick={toggleCart} className="relative p-2">
              <ShoppingCart size={18} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate(user ? "profile" : "login")}
              className="p-2"
            >
              <User size={18} className="text-white" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ================= LEFT SLIDE PANEL ================= */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-xl"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="
                fixed left-0 top-0 z-[60]
                h-[100dvh]
                w-full sm:w-[80%] lg:w-[50%]
                bg-neutral-950
                flex flex-col
                overflow-hidden
              "
            >
              {/* Glass edge */}
              <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />

              {/* Panel Header */}
              <div className="flex-shrink-0 px-6 py-5 border-b border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="tracking-[0.35em] text-white text-sm">
                    SNEXA
                  </span>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X size={20} className="text-white" />
                  </button>
                </div>

                {/* MOBILE SEARCH */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 md:hidden"
                >
                  <Search size={16} className="text-white/70" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products"
                    className="bg-transparent text-sm text-white outline-none placeholder:text-white/50 w-full"
                  />
                </form>
              </div>

              {/* MEGA MENU */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <HoverImageLinks
                  onItemClick={(route) => {
                    setIsMenuOpen(false);
                    if (route) {
                      onNavigate("products", { category: route });
                    }
                  }}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
