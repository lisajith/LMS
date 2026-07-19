import { Bell, LogOut, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

function Header() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 h-20 card-theme border-b border-theme flex items-center justify-between px-8">
      {/* Left Area */}
      <Link to="/" className="flex items-center gap-3">
        <GraduationCap className="text-blue-600" size={34} />
        <h1 className="text-2xl font-bold text-theme">SyVa</h1>
      </Link>

      {/* Right Area */}
      <div className="flex items-center gap-5">
        <button className="p-2 rounded-xl hover-theme transition text-theme-muted">
          <Bell size={22} />
        </button>

        <button
          onClick={handleLogout}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
