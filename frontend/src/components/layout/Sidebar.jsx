import {
  LayoutDashboard,
  Package,
  Boxes,
  Mic,
  MessageCircle,
  BarChart3,
  FileText,
  Sparkles,
  LogOut
} from "lucide-react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Boxes, label: "Stock", path: "/stock" },
  { icon: Mic, label: "Voice", path: "/voice" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: Sparkles, label: "AI Report", path: "/report-generator" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: FileText, label: "Invoice", path: "/invoice" },
  { icon: FileText, label: "Invoices", path: "/invoices" },
];

export default function Sidebar() {

  const location = useLocation();
  const itemRefs = useRef([]);
  const [highlightStyle, setHighlightStyle] = useState({});
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* 🔥 MOVE FLOATING HIGHLIGHT */

  useEffect(() => {
    const activeIndex = navItems.findIndex(
      item => location.pathname === item.path
    );

    const el = itemRefs.current[activeIndex];

    if (el) {
      setHighlightStyle({
        top: el.offsetTop,
        height: el.offsetHeight
      });
    }
  }, [location.pathname]);

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col p-6">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">

        <img
          src="/logo.png"
          alt="Kognio Logo"
          className="h-20 w-20 object-contain 
                     drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
        />

        <div>
          <p className="text-xl font-bold 
            bg-gradient-to-r from-indigo-500 to-purple-600 
            bg-clip-text text-transparent">
            Kognio
          </p>

          <p className="text-xs text-gray-500">
            Inventory, Powered by Intelligence
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex flex-col gap-2">

        {/* 🔥 FLOATING ACTIVE BACKGROUND */}
        <div
          className="absolute left-0 w-full rounded-xl 
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     shadow-[0_8px_25px_rgba(102,126,234,0.4)]
                     transition-all duration-300 ease-in-out"
          style={{
            ...highlightStyle,
          }}
        />

        {/* Glow layer */}
        <div
          className="absolute left-0 w-full rounded-xl blur-md
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     opacity-40 transition-all duration-300"
          style={{
            ...highlightStyle,
          }}
        />

        {navItems.map((item, index) => {

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                          transition-all duration-300

                ${isActive
                  ? "text-white scale-[1.03]"
                  : "text-gray-500 hover:bg-gray-100 hover:scale-[1.02]"}`}
            >

              {/* 🔥 CURVED SIDE GLOW */}
              {isActive && (
                <span className="absolute right-[-20px] top-1/2 -translate-y-1/2 
                  w-10 h-10 bg-purple-400 blur-xl rounded-full opacity-70" />
              )}

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                <Icon size={18} />
                {item.label}
              </div>

            </NavLink>
          );
        })}

      </nav>
      {/* User & Logout */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
}