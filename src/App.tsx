import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { CartPanel } from './components/CartPanel';
import HomePageSnap from './pages/HomePageSnap';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/admin';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if layout should be shown
  const hideLayout = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {!hideLayout && (
            <>
              <Navigation currentPage={location.pathname} onNavigate={(page) => navigate(page)} />
              <CartPanel onNavigate={(page) => navigate(page)} />
            </>
          )}

          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePageSnap onNavigate={(page) => navigate(page)} />} />
              <Route path="/products" element={<ProductsPage onNavigate={(page) => navigate(page)} />} />
              <Route path="/product/:slug" element={<ProductDetailPage onNavigate={(page) => navigate(page)} productSlug={''} />} />
              <Route path="/checkout" element={<CheckoutPage onNavigate={(page) => navigate(page)} />} />
              <Route path="/wishlist" element={<WishlistPage onNavigate={(page) => navigate(page)} />} />
              <Route path="/profile" element={<ProfilePage onNavigate={(page) => navigate(page)} />} />
              <Route path="/orders" element={<OrdersPage onNavigate={(page) => navigate(page)} />} />
              <Route path="/login" element={<AuthPage mode="login" onNavigate={(page) => navigate(page)} />} />
              <Route path="/register" element={<AuthPage mode="register" onNavigate={(page) => navigate(page)} />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<HomePageSnap onNavigate={(page) => navigate(page)} />} />
            </Routes>
          </main>

          {!hideLayout && <Footer onNavigate={(page) => navigate(page)} />}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
