import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { CalendarDays, CheckCircle2, XCircle } from "lucide-react";

function AttendanceTable() {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      if (!user) return;

      try {
        const q = query(
          collection(db, "attendance"),
          where("studentId", "==", user.uid),
          orderBy("markedAt", "desc")
        );

        const snap = await getDocs(q);

        const records = await Promise.all(
          snap.docs.map(async (d) => {
            const data = d.data();

            let courseTitle = "Course";

            if (data.courseId) {
              const courseSnap = await getDoc(
                doc(db, "courses", data.courseId)
              );

              if (courseSnap.exists()) {
                courseTitle = courseSnap.data().title || "Course";
              }
            }

            return {
              id: d.id,
              date: data.markedAt?.toDate ? data.markedAt.toDate() : null,
              course: courseTitle,
              status: data.status || "Absent",
            };
          })
        );

        setAttendance(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [user]);

  if (loading) {
    return (
      <div className="card-theme rounded-2xl shadow p-6">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="card-theme rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Attendance History</h2>

      {attendance.length === 0 ? (
        <div className="text-center py-10 text-theme-muted">
          No attendance records found.
        </div>
      ) : (
        <div className="space-y-4">
          {attendance.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center rounded-xl border border-theme p-5 hover-theme transition"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.course}</h3>

                <div className="flex items-center gap-2 mt-1 text-theme-muted">
                  <CalendarDays size={16} />

                  {item.date
                    ? item.date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </div>
              </div>

              {item.status === "Present" || item.status === "Late" ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-800/70 dark:text-green-200 dark:border dark:border-green-600/50">
                  <CheckCircle2 size={18} />
                  {item.status}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 dark:bg-red-800/70 dark:text-red-200 dark:border dark:border-red-600/50">
                  <XCircle size={18} />
                  Absent
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttendanceTable;
