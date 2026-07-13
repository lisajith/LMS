import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠" },
  { name: "My Course", path: "/dashboard/course", icon: "📚" },
  { name: "Notes", path: "/dashboard/notes", icon: "📝" },
  { name: "Attendance", path: "/dashboard/attendance", icon: "✅" },
  { name: "Assignments", path: "/dashboard/assignments", icon: "📄" },
  { name: "Tests", path: "/dashboard/tests", icon: "✍️" },
  { name: "Certificates", path: "/dashboard/certificates", icon: "🏆" },
  { name: "Profile", path: "/dashboard/profile", icon: "👤" },
];

function Sidebar() {

  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

    <div className="p-6">

      {/* Profile */}

      <div className="mb-10">

        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
        </div>

        <h1 className="text-3xl font-bold mb-10">
          <>{user?.displayName || "Student"}</>
          <p className="text-xs text-gray-400 mb-10 mt-1">
            Welcome Back 👋
          </p>
        </h1>

      </div>

      {/* Menu */}

      <nav className="space-y-2">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

    </div>

    {/* Logout */}

    <div className="mt-auto p-6">

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 transition rounded-xl py-3 font-semibold"
      >
        🚪 Logout
      </button>

    </div>

  </aside>
);
}
export default Sidebar;