import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  where,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import {
  GraduationCap,
  House,
  BookOpen,
  LayoutDashboard,
  Info,
  Mail,
  Bell,
  UserCircle2,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

function Navbar() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  async function handleNotificationClick() {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);
    if (!nextState || unreadCount === 0) return;
    const readQuery = query(
      collection(db, "announcementReads"),
      where("userId", "==", user.uid)
    );
    const readSnapshot = await getDocs(readQuery);
    const alreadyRead = readSnapshot.docs.map(
      doc => doc.data().announcementId
    );
    const unreadAnnouncements = announcements.filter(
      item => !alreadyRead.includes(item.id)
    );
    for (const item of unreadAnnouncements) {
      await addDoc(collection(db, "announcementReads"), {
        userId: user.uid,
        announcementId: item.id,
        readAt: serverTimestamp(),
      });
    }
    setUnreadCount(0);
  }

  useEffect(() => {
      async function fetchAnnouncements() {
        const announcementQuery = query(
          collection(db, "announcements"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const announcementSnapshot = await getDocs(announcementQuery);
        const announcementList = announcementSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(announcementList);
        const readQuery = query(
          collection(db, "announcementReads"),
          where("userId", "==", user.uid)
        );
        const readSnapshot = await getDocs(readQuery);
        const readIds = readSnapshot.docs.map(
          doc => doc.data().announcementId
        );
        const unread = announcementList.filter(
          item => !readIds.includes(item.id)
        );
        setUnreadCount(unread.length);
      }
      if (user) {
        fetchAnnouncements();
      }
    }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <nav className="sticky top-0 z-50 opacity-90 card-theme border-b border-theme shadow-sm">
      <div className="max-w-7xl mx-auto h-20 px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-3"
        >
          <GraduationCap
            size={34}
            style={{ color: "var(--primary)" }} 
          />
          <span className="text-2xl font-bold text-theme">
            LMS Portal
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-7">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 ${
                isActive
                  ? "font-semibold"
                  : "text-theme transition"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { color: "var(--primary)" }
                : {}
            }
          >
            <House size={18} />
            Home
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `flex items-center gap-2 ${
                isActive
                  ? "font-semibold"
                  : "text-theme transition"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { color: "var(--primary)" }
                : {}
            }
          >
            <BookOpen size={18} />
            Courses
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-theme hover:text-blue-600 transition"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          )}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex items-center gap-2 ${
                isActive
                  ? "font-semibold"
                  : "text-theme transition"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { color: "var(--primary)" }
                : {}
            }
          >
            <Info size={18} />
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex items-center gap-2 ${
                isActive
                  ? "font-semibold"
                  : "text-theme transition"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { color: "var(--primary)" }
                : {}
            }
          >
            <Mail size={18} />
            Contact
          </NavLink>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-5">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className="font-medium text-theme hover:text-blue-600 transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="btn-primary px-5 py-2.5 rounded-xl text-white font-medium hover:shadow-lg transition-all"
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-xl hover-theme transition"
                >
                  <Bell
                    size={21}
                    className="text-theme-muted"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-96 rounded-2xl card-theme border border-theme shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-theme font-semibold">
                      Latest Announcements
                    </div>
                    {announcements.length === 0 ? (
                      <p className="p-5 text-theme-muted">
                        No announcements
                      </p>
                    ) : (
                      announcements.map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            navigate("/dashboard/announcements");
                            setNotificationsOpen(false);
                          }}
                          className="w-full text-left px-5 py-4 hover-theme transition border-b border-theme"
                        >
                          <p className="font-semibold">
                            {item.title}
                          </p>
                          <p className="text-sm text-theme-muted mt-1">
                            {item.message}
                          </p>
                        </button>
                      ))
                    )}
                    <button
                      onClick={() => {
                        navigate("/dashboard/announcements");
                        setNotificationsOpen(false);
                      }}
                      className="w-full py-3 font-semibold primary-text hover-theme"
                    >
                      View All
                    </button>
                  </div>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover-theme transition"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
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
                  <span className="font-medium text-theme">
                    {userData?.name?.split(" ")[0] || "Loading..."}
                  </span>
                  <ChevronDown size={18} className="text-theme-muted" />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 card-theme rounded-2xl border border-theme shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-theme">
                        <h3 className="font-semibold text-theme">
                          {userData?.name}
                        </h3>

                        <p className="text-sm text-theme-muted">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-theme hover-theme transition"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </button>

                      <button
                        onClick={() => {
                          navigate("/dashboard/profile");
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-theme hover-theme transition"
                      >
                        <Settings size={18} />
                        Profile & Settings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover-theme transition"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;