import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Tag,
  Warehouse,
  ShoppingBag,
  DollarSign,
  Users,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";

/* ================= TYPES ================= */

interface AdminSidebarProps {
  closeSidebar?: () => void;
}

type MenuItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  countKey?: "products" | "orders" | "users";
};

/* ================= MENU ================= */

const menu: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Products", icon: Package, path: "/admin/products", countKey: "products" },
  { label: "Offers", icon: Tag, path: "/admin/offers" },
  { label: "Inventory", icon: Warehouse, path: "/admin/inventory" },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders", countKey: "orders" },
  { label: "Sales", icon: DollarSign, path: "/admin/sales" },
  { label: "Customers", icon: Users, path: "/admin/customers", countKey: "users" },
  { label: "Newsletter", icon: Mail, path: "/admin/newsletter" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

/* ================= COMPONENT ================= */

export default function AdminSidebar({ closeSidebar }: AdminSidebarProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCounts = async () => {
      const [products, orders, users] = await Promise.all([
        getCountFromServer(collection(db, "products")),
        getCountFromServer(collection(db, "orders")),
        getCountFromServer(collection(db, "users")),
      ]);

      setCounts({
        products: products.data().count,
        orders: orders.data().count,
        users: users.data().count,
      });
    };

    loadCounts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 h-full bg-black/70 backdrop-blur-xl border-r border-white/10 flex flex-col px-6 py-8">
      <h2 className="text-xl font-semibold mb-10 tracking-wide">
        SNEXA<span className="text-emerald-400">.</span>
      </h2>

      <nav className="flex-1 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end
              onClick={() => closeSidebar?.()}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-emerald-400 text-black"
                    : "text-white/70 hover:bg-white/10"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </div>

              {item.countKey && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {counts[item.countKey] ?? 0}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-4">
  <div
    className="
      w-full
      rounded-2xl
      bg-white/10
      backdrop-blur-xl
      border border-white/15
      shadow-lg shadow-black/30
    "
  >
    {/* User Info */}
    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
      {/* Avatar */}
      <div
        className="
          w-10 h-10
          rounded-full
          flex items-center justify-center
          bg-emerald-500/20
          text-emerald-400
          font-semibold
          text-sm
          shrink-0
        "
      >
        {admin?.name?.charAt(0)?.toUpperCase() || "S"}
      </div>

      {/* Name + Email */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {admin?.name || "Saravanan"}
        </p>
        <p className="text-xs text-white/60 truncate">
          {admin?.email}
        </p>
      </div>
    </div>

    {/* Divider */}
    <div className="mx-4 h-px bg-white/10" />

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="
        flex items-center gap-3
        w-full
        px-4 py-3
        text-sm
        text-white/70
        hover:text-white
        hover:bg-white/10
        transition
        rounded-b-2xl
      "
    >
      <LogOut size={18} className="shrink-0" />
      <span>Logout</span>
    </button>
  </div>

      </div>
    </aside>
  );
}
