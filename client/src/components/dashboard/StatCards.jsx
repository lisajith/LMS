import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BookOpen, CheckCircle2, TrendingUp, Award } from "lucide-react";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import StatCard from "./StatCard";

function StatCards() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    courses: 0,
    completedLessons: 0,
    progress: 0,
    certificates: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      const q = query(
        collection(db, "enrollments"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      let courses = snapshot.docs.length;
      let completedLessons = 0;
      let totalProgress = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        completedLessons += data.completedLessons?.length || 0;
        totalProgress += data.progress || 0;
      });

      const averageProgress =
        courses > 0
          ? Math.round(totalProgress / courses)
          : 0;

      setStats({
        courses,
        completedLessons,
        progress: averageProgress,
        certificates: 0,
      });
    }

    fetchStats();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        icon={<BookOpen size={28} />}
        title="Enrolled Courses"
        value={stats.courses}
        color="bg-blue-100 text-blue-600"
      />

      <StatCard
        icon={<CheckCircle2 size={28} />}
        title="Completed Lessons"
        value={stats.completedLessons}
        color="bg-green-100 text-green-600"
      />

      <StatCard
        icon={<TrendingUp size={28} />}
        title="Overall Progress"
        value={`${stats.progress}%`}
        color="bg-orange-100 text-orange-600"
      />

      <StatCard
        icon={<Award size={28} />}
        title="Certificates"
        value={stats.certificates}
        color="bg-purple-100 text-purple-600"
      />

    </div>
  );
}

export default StatCards;