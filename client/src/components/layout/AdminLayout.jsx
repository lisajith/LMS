import { Outlet, NavLink, useNavigate } from "react-router-dom";
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

  // ✅ Working Logout
  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="min-h-screen bg-theme flex items-start">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-72 card-theme border-r border-theme p-6 flex flex-col shadow-lg">
        {/* Logo */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold primary-text">SyVa</h1>
              <p className="text-theme-muted text-sm">
                Learning Management System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "hover:bg-theme-hover text-theme hover:translate-x-1"
                  }`
                }
              >
                <Icon
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="pt-6 border-t border-theme space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-theme-secondary border border-theme">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 bg-white flex items-center justify-center">
              {userData?.photoURL ? (
                <img
                  src={userData.photoURL}
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

          {/* Profile Button */}
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-theme hover:bg-theme-hover transition-all duration-300 font-medium text-theme"
          >
            <Settings size={18} />
            Profile & Settings
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-lg font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-theme-secondary min-h-screen">
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
