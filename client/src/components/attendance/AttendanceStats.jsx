import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { CheckCircle2, XCircle, Percent, Flame } from "lucide-react";

function AttendanceStats() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    percentage: 0,
    streak: 0,
  });

  useEffect(() => {
    async function loadStats() {
      if (!user) return;

      try {
        const q = query(
          collection(db, "attendance"),
          where("studentId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const records = snap.docs.map((d) => d.data());

        const present = records.filter(
          (r) => r.status === "Present" || r.status === "Late"
        ).length;

        const absent = records.filter((r) => r.status === "Absent").length;

        const total = records.length;

        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

        // Simple streak calculation
        const sorted = records
          .filter((r) => r.markedAt)
          .sort((a, b) => b.markedAt.toDate() - a.markedAt.toDate());

        let streak = 0;

        for (const record of sorted) {
          if (record.status === "Present" || record.status === "Late") {
            streak++;
          } else {
            break;
          }
        }

        setStats({
          present,
          absent,
          percentage,
          streak,
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadStats();
  }, [user]);

  const cards = [
    {
      title: "Present Days",
      value: stats.present,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Absent Days",
      value: stats.absent,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Attendance",
      value: `${stats.percentage}%`,
      icon: Percent,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Current Streak",
      value: `${stats.streak} Days`,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="card-theme rounded-2xl shadow p-5 hover-theme transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-theme-muted text-sm">{stat.title}</p>

                <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}
              >
                <Icon size={28} className={stat.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AttendanceStats;
