import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
BookOpen,
NotebookPen,
CalendarCheck,
ClipboardCheck,
Award,
User,
Bell,
ClipboardList,
Code2,
Calendar,
X,
Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
{
name: "Courses",
path: "/dashboard/courses",
icon: <BookOpen size={20} />,
},
{
name: "Notes",
path: "/dashboard/notes",
icon: <NotebookPen size={20} />,
},
{
name: "Attendance",
path: "/dashboard/attendance",
icon: <CalendarCheck size={20} />,
},
{
name: "Upcoming Classes",
path: "/dashboard/classes",
icon: <Calendar size={20} />,
},
{
name: "Assignments",
path: "/dashboard/assignments",
icon: <ClipboardList size={20} />,
},
{
name: "Tests",
path: "/dashboard/tests",
icon: <ClipboardCheck size={20} />,
},
{
name: "Practice",
path: "/dashboard/practice",
icon: <Code2 size={20} />,
},
{
name: "Certificates",
path: "/dashboard/certificates",
icon: <Award size={20} />,
},
{
name: "Announcements",
path: "/dashboard/announcements",
icon: <Bell size={20} />,
},
{
name: "Profile",
path: "/dashboard/profile",
icon: <User size={20} />,
},
];

function Sidebar() {
const location = useLocation();
const [mobileOpen, setMobileOpen] = useState(false);

// Close mobile drawer when route changes
useEffect(() => {
setMobileOpen(false);
}, [location.pathname]);

return (
<>
{/* Mobile Hamburger Button */}
<button
onClick={() => setMobileOpen(true)}
className="lg:hidden fixed top-24 left-4 z-50 w-12 h-12 rounded-2xl card-theme border border-theme shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300"
> <Menu size={22} className="primary-text" /> </button>

  {/* Desktop Sidebar */}
  <aside className="hidden lg:block fixed top-20 left-0 w-72 h-[calc(100vh-5rem)] card-theme border-r border-theme overflow-y-auto">
    <div className="px-5 py-6">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink key={item.name} to={item.path}>
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "btn-primary text-white font-semibold shadow-lg"
                    : "text-theme hover-theme hover:translate-x-1"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  </aside>

  {/* Mobile Drawer */}
  <AnimatePresence>
    {mobileOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />

        {/* Drawer */}
        <motion.aside
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: "tween", duration: 0.25 }}
          className="lg:hidden fixed top-0 left-0 z-50 w-80 h-screen card-theme border-r border-theme shadow-2xl overflow-y-auto"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-theme">
            <div>
              <h2 className="text-xl font-bold text-theme">Dashboard</h2>
              <p className="text-sm text-theme-muted">Student Menu</p>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 rounded-xl hover-theme flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Navigation */}
          <div className="px-5 py-5">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <NavLink key={item.name} to={item.path}>
                  {({ isActive }) => (
                    <div
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "btn-primary text-white font-semibold shadow-lg"
                          : "text-theme hover-theme"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
</>

);
}

export default Sidebar;
