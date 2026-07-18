import { NavLink } from "react-router-dom";
import {
  BookOpen,
  NotebookPen,
  CalendarCheck,
  FileText,
  ClipboardCheck,
  Award,
  User,
  Bell,
  ClipboardList,
} from "lucide-react";

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
  return (
    <aside className="fixed top-20 left-0 w-72 h-[calc(100vh-5rem)] card-theme border-r border-theme overflow-y-auto">
      <div className="px-5 py-6">
        <nav className="space-y-2">
          
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "btn-primary text-white font-semibold"
                      : "text-theme hover-theme"
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
  );
}

export default Sidebar;