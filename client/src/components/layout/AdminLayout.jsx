import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  Calendar,
  Bell,
  Users,
  LogOut,
  ClipboardCheck,
  CalendarCheck,
  UserCircle2,
  Settings,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/courses", label: "Courses", icon: BookOpen },
  { path: "/admin/lessons", label: "Lessons", icon: FileText },
  { path: "/admin/assignments", label: "Assignments", icon: ClipboardList },
  { path: "/admin/tests", label: "Tests", icon: ClipboardCheck },
  { path: "/admin/classes", label: "Classes", icon: Calendar },
  { path: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  { path: "/admin/students", label: "Students", icon: Users },
  { path: "/admin/announcements", label: "Announcements", icon: Bell },
];

function AdminLayout() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="bg-theme min-h-screen">
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="lg:hidden sticky top-0 z-50 bg-theme/80 backdrop-blur-xl border-b border-theme">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-2xl font-bold primary-text">SyVa</h1>
          </div>

          {/* Floating menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 rounded-2xl bg-theme-secondary border border-theme shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300"
          >
            <Menu size={22} className="text-theme" />
          </button>
        </div>
      </div>

      {/* ================= BACKDROP ================= */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64 card-theme border-r border-theme shadow-2xl
          transform transition-transform duration-300 ease-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-3xl font-bold primary-text">SyVa</h1>
            </div>

            {/* Close button - mobile only */}
            <button
              onClick={closeSidebar}
              className="lg:hidden w-10 h-10 rounded-xl hover:bg-theme-hover flex items-center justify-center transition"
            >
              <X size={20} className="text-theme" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "hover:bg-theme-hover text-theme hover:translate-x-1"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="pt-4 border-t border-theme space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-theme-secondary border border-theme">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 bg-white flex items-center justify-center">
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL?.replace("http://", "https://")}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="w-full h-full text-blue-500" />
                )}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-theme truncate">
                  {userData?.name || "Admin User"}
                </p>
                <p className="text-sm text-theme-muted capitalize">
                  {userData?.role || "Administrator"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigate("/dashboard/profile");
                closeSidebar();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-theme hover:bg-theme-hover transition-all duration-300 font-medium text-theme"
            >
              <Settings size={18} />
              Profile & Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="lg:ml-64 min-h-screen bg-theme-secondary transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;