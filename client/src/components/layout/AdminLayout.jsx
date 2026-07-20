import { Outlet, NavLink } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/courses", label: "Courses", icon: BookOpen },
  { path: "/admin/lessons", label: "Lessons", icon: FileText },
  { path:"/admin/assignments", label: "Assignments", icon: ClipboardList },
  { path: "/admin/tests", label: "Tests", icon: ClipboardCheck },
  { path: "/admin/classes", label: "Classes", icon: Calendar },
  { path: "/admin/announcements", label: "Announcements", icon: Bell },
  { path: "/admin/students", label: "Students", icon: Users },
];

function AdminLayout() {
  const { logout, userData } = useAuth();

  return (
    <div className="min-h-screen bg-theme flex">
      {/* Sidebar */}
      <aside className="w-72 card-theme border-r border-theme p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-3xl font-bold primary-text">SyVa</h1>
          <p className="text-theme-muted mt-1">Admin Panel</p>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-theme-hover text-theme"
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-theme">
          <div className="mb-4">
            <p className="font-semibold">{userData?.name}</p>
            <p className="text-sm text-theme-muted capitalize">
              {userData?.role}
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-theme hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;