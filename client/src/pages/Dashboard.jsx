import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import StatCards from "../components/dashboard/StatCards";
import MyCourses from "../components/dashboard/MyCourses";
import LatestAnnouncements from "../components/announcements/LatestAnnouncements";
import DashboardProgress from "../components/dashboard/DashboardProgress";
import DashboardAttendance from "../components/dashboard/DashboardAttendance";
import { Smile, Sun, Hand, Icon } from "lucide-react";

import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/firebase";
import UpcomingClasses from "./UpcomingClasses";

function Dashboard() {
  const { user, userData } = useAuth();
  const [progressData, setProgressData] = useState([]);

  const firstName = user?.displayName?.split(" ")[0] || "Student";

  const hour = new Date().getHours();

  let greeting = "Hello";
  let Icon = Smile;

  if (hour < 12) {
    greeting = "Good Morning";
    Icon = Sun;
  } else if (hour < 17) {
    greeting = "Good Afternoon";
    Icon = Hand;
  } else {
    greeting = "Good Evening";
    Icon = Smile;
  }

  useEffect(() => {
    async function loadProgress() {
      if (!user) return;

      const enrollments = await getDocs(
        query(collection(db, "enrollments"), where("userId", "==", user.uid))
      );

      const data = [];

      for (const item of enrollments.docs) {
        const enroll = item.data();

        const course = await getDocs(
          query(
            collection(db, "courses"),
            where("__name__", "==", enroll.courseId)
          )
        );

        if (!course.empty) {
          data.push({
            course: course.docs[0].data().title,

            progress: enroll.progress,
          });
        }
      }

      setProgressData(data);
    }

    loadProgress();
  }, [user]);

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

      <div className="grid lg:grid-cols-3 gap-6">
        <DashboardAttendance />
        <div className="lg:col-span-2">
          <DashboardProgress data={progressData} />
        </div>
      </div>

      {/* Stats */}

      <StatCards />

      {/* Upcoming Classes */}

      <UpcomingClasses />

      {/* Continue Learning */}

      <MyCourses />

      {/* Recent Activity */}

      <LatestAnnouncements />
    </div>
  );
}

export default Dashboard;
