import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

function DashboardAttendance() {
  const { user } = useAuth();

  const [data, setData] = useState([
    { name: "Present", value: 0 },
    { name: "Absent", value: 0 },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      if (!user) return;

      try {
        const q = query(
          collection(db, "attendance"),
          where("studentId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const records = snapshot.docs.map((doc) => doc.data());

        const present = records.filter(
          (r) => r.status === "Present" || r.status === "Late"
        ).length;

        const absent = records.filter((r) => r.status === "Absent").length;

        setData([
          { name: "Present", value: present },
          { name: "Absent", value: absent },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendance();
  }, [user]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const percentage = total > 0 ? Math.round((data[0].value / total) * 100) : 0;

  return (
    <div className="card-theme rounded-3xl border border-theme shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-theme">Attendance Overview</h2>
          <p className="text-theme-muted text-sm mt-1">
            Your class attendance performance
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Live
        </div>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-theme-muted">
          Loading attendance...
        </div>
      ) : (
        <>
          <div className="h-72 relative">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip formatter={(value, name) => [`${value} Days`, name]} />

                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={78}
                  outerRadius={108}
                  paddingAngle={5}
                  cornerRadius={10}
                  stroke="white"
                  strokeWidth={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center */}
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <h2 className="text-5xl font-black text-theme">{percentage}%</h2>

              <p className="text-theme-muted font-medium mt-1">Attendance</p>
            </div>
          </div>

          {/* Legend */}
          {/* Legend */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* Present */}
            <div className="group rounded-2xl border border-green-200/60 dark:border-green-700/40 bg-green-50/50 dark:bg-green-900/20 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-theme">Present</p>
                    <p className="text-xs text-theme-muted">Attended classes</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <p className="text-4xl font-black text-theme leading-none">
                  {data[0].value}
                </p>

                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  +{percentage}%
                </span>
              </div>
            </div>

            {/* Absent */}
            <div className="group rounded-2xl border border-red-200/60 dark:border-red-700/40 bg-red-50/50 dark:bg-red-900/20 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-theme">Absent</p>
                    <p className="text-xs text-theme-muted">Missed classes</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <p className="text-4xl font-black text-theme leading-none">
                  {data[1].value}
                </p>

                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {data[1].value === 0 ? "Perfect" : "Needs focus"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardAttendance;
