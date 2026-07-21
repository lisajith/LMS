import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

import { Calendar, Clock, Video, BookOpen, Radio } from "lucide-react";

function UpcomingClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchClasses() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Get student enrollments
        const enrollmentQuery = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );

        const enrollmentSnap = await getDocs(enrollmentQuery);

        const enrolledCourseIds = enrollmentSnap.docs.map(
          (doc) => doc.data().courseId
        );

        //console.log("Enrolled Courses:", enrolledCourseIds);

        // 2. No enrollments
        if (enrolledCourseIds.length === 0) {
          setClasses([]);
          return;
        }

        // 3. Fetch all classes
        const classQuery = query(
          collection(db, "classes"),
          orderBy("startTime", "asc") // IMPORTANT
        );

        const classSnap = await getDocs(classQuery);

        const allClasses = classSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        //console.log("All Classes:", allClasses);

        // 4. Filter only enrolled courses
        const filtered = allClasses.filter((cls) =>
          enrolledCourseIds.includes(cls.courseId)
        );

        //console.log("Filtered Classes:", filtered);

        const priority = {
          Live: 0,
          Upcoming: 1,
          Completed: 2,
        };

        const sorted = filtered.sort((a, b) => {
          const statusA = getStatus(a);
          const statusB = getStatus(b);

          return priority[statusA] - priority[statusB];
        });

        setClasses(sorted);
      } catch (err) {
        console.error("Fetch Classes Error:", err);
      } finally {
        setLoading(false); // ALWAYS runs
      }
    }

    fetchClasses();
  }, [user]);

  function getStatus(cls) {
    const now = new Date();

    const start = cls.startTime?.toDate
      ? cls.startTime.toDate()
      : new Date(cls.startTime);

    const end = cls.endTime?.toDate
      ? cls.endTime.toDate()
      : new Date(cls.endTime);

    if (now < start) return "Upcoming";

    if (now >= start && now <= end) return "Live";

    return "Completed";
  }

  function statusStyle(status) {
    switch (status) {
      case "Live":
        return "bg-green-500/10 text-green-600 border border-green-500/30";
      case "Upcoming":
        return "bg-blue-500/10 text-blue-600 border border-blue-500/30";
      default:
        return "bg-gray-500/10 text-gray-600 border border-gray-500/30";
    }
  }

  if (loading) {
    return <div className="text-center py-24">Loading classes...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card-theme rounded-3xl p-8 border border-theme shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl primary-soft flex items-center justify-center">
            <Calendar className="primary-text" size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Upcoming Classes</h1>
            <p className="text-theme-muted">
              Classes from your enrolled courses
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {["All", "Live", "Upcoming", "Completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "border border-theme hover:bg-theme-hover"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {classes.length === 0 ? (
        <div className="card-theme rounded-3xl p-12 text-center border border-theme">
          <BookOpen className="mx-auto text-theme-muted mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">No classes available</h2>
          <p className="text-theme-muted">
            Enroll in a course to see upcoming live classes.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {classes
            .filter((cls) => {
              if (filter === "All") return true;
              return getStatus(cls) === filter;
            })
            .map((cls) => {
              const status = getStatus(cls);

              return (
                <div
                  key={cls.id}
                  className="card-theme rounded-3xl p-6 border border-theme shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{cls.title}</h2>
                      <p className="text-theme-muted mt-1">{cls.courseName}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-blue-500" />
                      <span>
                        {cls.startTime?.toDate()?.toLocaleDateString()}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-orange-500" />
                      <span>
                        {cls.startTime?.toDate()?.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {cls.endTime?.toDate()?.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-purple-500" />
                      <span>{cls.instructorName || "Instructor"}</span>
                    </div>
                  </div>

                  {cls.description && (
                    <p className="text-theme-muted text-sm mt-4 line-clamp-3">
                      {cls.description}
                    </p>
                  )}

                  <div className="mt-6">
                    {status === "Completed" ? (
                      <button
                        disabled
                        className="w-full px-5 py-3 rounded-2xl border border-theme text-theme-muted cursor-not-allowed"
                      >
                        Class Completed
                      </button>
                    ) : (
                      <a
                        href={cls.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-primary px-5 py-3 rounded-2xl flex items-center justify-center gap-2"
                      >
                        {status === "Live" ? (
                          <>
                            <Radio size={18} />
                            Join Live Class
                          </>
                        ) : (
                          <>
                            <Video size={18} />
                            Open Meeting Link
                          </>
                        )}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default UpcomingClasses;
