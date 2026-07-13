import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";


function Navbar() {

  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }
  
  return (
    <nav className="sticky top-0 z-50 bg-white/50 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          LMS
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-slate-700 hover:text-blue-600 transition"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-slate-700 hover:text-blue-600 transition"
            }
          >
            Course
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-slate-700 hover:text-blue-600 transition"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-slate-700 hover:text-blue-600 transition"
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Right Side */}
        {
          user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>

              <NavLink
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Logout
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink
                to="/login"
                className="text-slate-700 hover:text-blue-600 transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </NavLink>
            </div>
          )
        }
      </div>
    </nav>
  );
}

export default Navbar;