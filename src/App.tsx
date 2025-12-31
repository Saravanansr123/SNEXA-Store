import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { CartPanel } from "./components/CartPanel";

import HomePageSnap from "./pages/HomePageSnap";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { WishlistPage } from "./pages/WishlistPage";
import { ProfilePage } from "./pages/ProfilePage";
import { OrdersPage } from "./pages/OrdersPage";
import { AuthPage } from "./pages/AuthPage";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/AdminDashboard";
//import Analytics from "./pages/admin/Analytics";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide main site layout on auth pages & admin
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {!hideLayout && (
            <>
              <Navigation
                currentPage={location.pathname}
                onNavigate={(page) => navigate(page)}
              />
              <CartPanel onNavigate={(page) => navigate(page)} />
            </>
          )}

          <main className="min-h-screen">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route
                path="/"
                element={<HomePageSnap onNavigate={(page) => navigate(page)} />}
              />
              <Route
                path="/products"
                element={<ProductsPage onNavigate={(page) => navigate(page)} />}
              />
              <Route
                path="/product/:slug"
                element={
                  <ProductDetailPage
                    onNavigate={(page) => navigate(page)}
                    productSlug=""
                  />
                }
              />
              <Route
                path="/checkout"
                element={<CheckoutPage onNavigate={(page) => navigate(page)} />}
              />
              <Route
                path="/wishlist"
                element={<WishlistPage onNavigate={(page) => navigate(page)} />}
              />
              <Route
                path="/profile"
                element={<ProfilePage onNavigate={(page) => navigate(page)} />}
              />
              <Route
                path="/orders"
                element={<OrdersPage onNavigate={(page) => navigate(page)} />}
              />

              {/* AUTH ROUTES */}
              <Route
                path="/login"
                element={<AuthPage mode="login" onNavigate={(page) => navigate(page)} />}
              />
              <Route
                path="/register"
                element={
                  <AuthPage mode="register" onNavigate={(page) => navigate(page)} />
                }
              />

              {/* ADMIN ROUTES (WITH SIDEBAR LAYOUT) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                 {/* <Route path="analytics" element={<Analytics />} /> */}
                <Route path="products" element={<Products />} /> 
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
              </Route>

              {/* FALLBACK */}
              <Route
                path="*"
                element={<HomePageSnap onNavigate={(page) => navigate(page)} />}
              />
            </Routes>
          </main>

          {!hideLayout && (
            <Footer onNavigate={(page) => navigate(page)} />
          )}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
