import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  /* Swipe refs */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* Keyboard shortcut: Ctrl + B */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        setOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* Swipe handlers */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const distance = touchEndX.current - touchStartX.current;
    if (distance > 80) setOpen(true);
    if (distance < -80) setOpen(false);
  };

  return (
    <div
      className="flex min-h-screen bg-black text-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-50 h-full w-[260px]
          bg-black border-r border-white/10
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex justify-end p-3 border-b border-white/10">
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <AdminSidebar closeSidebar={() => setOpen(false)} />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
       
        {/* <header
          className="
            sticky top-0 z-30
            h-16
            flex items-center gap-4
            px-6
            bg-black/80 backdrop-blur-xl
            border-b border-white/10
          "
        >
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Breadcrumb placeholder */}
          {/* <div className="text-sm text-white/60">
            Dashboard / <span className="text-white">Trade history</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/10">
              Export
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-sm font-medium">
              + Add trade
            </button>
          </div>
        </header> */} 

        {/* PAGE WRAPPER (IMPORTANT) */}
        <main
          className="
            flex-1
            overflow-y-auto
            bg-black
          "
        >
          {/* CONTENT CONTAINER (matches screenshot width) */}
          <div className="max-w-[1200px] mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
