import { useAuth } from "../context/AuthContext";

import StatCards from "../components/dashboard/StatCards";
import MyCourses from "../components/dashboard/MyCourses";
import LatestAnnouncements from "../components/announcements/LatestAnnouncements";
import { Smile, Sun, Hand, Icon } from "lucide-react";

function Dashboard() {
  const { user, userData } = useAuth();

  const firstName =
    user?.displayName?.split(" ")[0] || "Student";

  const hour = new Date().getHours();

  let greeting = "Hello";
  let Icon = Smile

  if (hour < 12){ greeting = "Good Morning";Icon = Sun;}
  else if (hour < 17){ greeting = "Good Afternoon";Icon = Hand;}
  else{ greeting = "Good Evening";Icon = Smile;}

  return (
    <div className="space-y-8">

      {/* Greeting */}

      <section className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl text-white p-8 shadow-lg">

        <h1 className="text-4xl font-bold">
          <div className="flex gap-3 text-center align-middle">
            {greeting}, {userData?.name}
            <Icon size={48} color="#ff9800" strokeWidth={2} />
          </div>
        </h1>

        <p className="mt-3 text-blue-100 text-lg">
          Keep learning. Every lesson brings you one step closer to your goal.
        </p>

      </section>

      {/* Stats */}

      <StatCards />

      {/* Continue Learning */}

      <MyCourses />

      {/* Recent Activity */}

      <LatestAnnouncements />

    </div>
  );
}

export default Dashboard;