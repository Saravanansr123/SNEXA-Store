import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
//import { db } from "../lib/firebase";

/* ================= MENU CONFIG ================= */

const menu = [
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

export default function AdminSidebar() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  /* ================= LOAD FIREBASE COUNTS ================= */
  useEffect(() => {
    const loadCounts = async () => {
      try {
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
      } catch (err) {
        console.error("Sidebar count load failed", err);
      }
    };

    loadCounts();
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 px-6 py-8">
      {/* BRAND */}
      <h2 className="text-xl font-semibold mb-10 tracking-wide">
        SNEXA<span className="text-emerald-400">.</span>
      </h2>

      {/* NAV */}
      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end
              className={({ isActive }) =>
                `
                flex items-center justify-between gap-3 px-4 py-2 rounded-xl transition
                ${
                  isActive
                    ? "bg-emerald-400 text-black"
                    : "text-white/70 hover:bg-white/10"
                }
              `
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </div>

              {/* COUNT BADGE */}
              {item.countKey && counts[item.countKey] !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full
                  ${
                    item.label === "Orders"
                      ? "bg-rose-400/20 text-rose-400"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {counts[item.countKey]}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
