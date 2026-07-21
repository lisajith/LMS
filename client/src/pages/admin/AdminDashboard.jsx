import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import {
  Users,
  BookOpen,
  Award,
  Calendar,
  ClipboardCheck,
  Bell,
  ArrowRight,
  LoaderCircle,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    certificates: 0,
    liveClasses: 0,
    attendanceToday: 0,
  });

  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Initial load
    loadDashboard();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      loadDashboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function loadDashboard() {
    try {
      // ===== COUNTS =====
      const usersSnap = await getDocs(collection(db, "users"));
      const coursesSnap = await getDocs(collection(db, "courses"));
      const enrollmentsSnap = await getDocs(collection(db, "enrollments"));
      const attendanceSnap = await getDocs(collection(db, "attendance"));

      // Count students only
      const studentsCount = usersSnap.docs.filter(
        (d) => d.data().role !== "admin"
      ).length;

      // Count certificates
      const certificatesCount = enrollmentsSnap.docs.filter(
        (d) => d.data().certificateUnlocked === true
      ).length;

      // ===== LIVE CLASSES =====
      const now = new Date();

      const classesSnap = await getDocs(collection(db, "classes"));

      const liveClasses = classesSnap.docs.filter((d) => {
        const data = d.data();

        const start = data.startTime?.toDate
          ? data.startTime.toDate()
          : new Date(data.startTime);

        const end = data.endTime?.toDate
          ? data.endTime.toDate()
          : new Date(data.endTime);

        return now >= start && now <= end;
      });

      // ===== ATTENDANCE TODAY =====
      const today = new Date();

      const todayAttendance = attendanceSnap.docs.filter((d) => {
        const ts = d.data().markedAt?.toDate?.();

        if (!ts) return false;

        return (
          ts.getDate() === today.getDate() &&
          ts.getMonth() === today.getMonth() &&
          ts.getFullYear() === today.getFullYear()
        );
      });

      // ===== RECENT ENROLLMENTS =====
      const enrollQuery = query(
        collection(db, "enrollments"),
        orderBy("enrolledAt", "desc"),
        limit(5)
      );

      const enrollSnap = await getDocs(enrollQuery);

      const enrollments = await Promise.all(
        enrollSnap.docs.map(async (d) => {
          const data = d.data();

          const userDoc = usersSnap.docs.find((u) => u.id === data.userId);

          return {
            id: d.id,
            studentName: userDoc?.data()?.name || "Student",
            courseTitle: data.courseTitle || "Course",
            enrolledAt: data.enrolledAt,
          };
        })
      );

      setRecentEnrollments(enrollments);

      // ===== RECENT TEST SUBMISSIONS =====
      const testQuery = query(
        collection(db, "testSubmissions"),
        orderBy("submittedAt", "desc"),
        limit(5)
      );

      const testSnap = await getDocs(testQuery);

      const tests = testSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setRecentTests(tests);

      // ===== TODAY CLASSES =====
      const todayList = classesSnap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((c) => {
          const start = c.startTime?.toDate
            ? c.startTime.toDate()
            : new Date(c.startTime);

          return (
            start.getDate() === today.getDate() &&
            start.getMonth() === today.getMonth() &&
            start.getFullYear() === today.getFullYear()
          );
        })
        .sort((a, b) => {
          const aTime = a.startTime?.toDate
            ? a.startTime.toDate()
            : new Date(a.startTime);

          const bTime = b.startTime?.toDate
            ? b.startTime.toDate()
            : new Date(b.startTime);

          return aTime - bTime;
        });

      setTodayClasses(todayList);

      // ===== SET STATS =====
      setStats({
        students: studentsCount,
        courses: coursesSnap.size,
        certificates: certificatesCount,
        liveClasses: liveClasses.length,
        attendanceToday: todayAttendance.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoaderCircle className="animate-spin primary-text" size={42} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black">Admin Dashboard</h1>
            <p className="text-white/80 mt-2 text-lg">
              Monitor students, courses, classes, attendance, and certificates
              in real time.
            </p>
            <p className="text-sm text-white/60 mt-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <TrendingUp size={35} className="animate-pulse text-yellow-300" />
            <span className="font-semibold">Live Analytics</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard
          title="Students"
          value={stats.students}
          icon={<Users size={24} />}
          color="blue"
        />

        <StatCard
          title="Courses"
          value={stats.courses}
          icon={<BookOpen size={24} />}
          color="green"
        />

        <StatCard
          title="Certificates"
          value={stats.certificates}
          icon={<Award size={24} />}
          color="yellow"
        />

        <StatCard
          title="Live Classes"
          value={stats.liveClasses}
          icon={<Calendar size={24} />}
          color="purple"
        />

        <StatCard
          title="Attendance Today"
          value={stats.attendanceToday}
          icon={<ClipboardCheck size={24} />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="card-theme rounded-3xl p-6 border border-theme">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <Bell className="text-theme-muted" size={20} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <QuickAction
            to="/admin/courses"
            title="Create Course"
            description="Add a new course with lessons and resources."
          />

          <QuickAction
            to="/admin/tests/create"
            title="Create Test"
            description="Schedule assessments and quizzes for students."
          />

          <QuickAction
            to="/admin/announcements"
            title="Publish Announcement"
            description="Notify students about updates and important events."
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid xl:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="card-theme rounded-3xl p-6 border border-theme">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Recent Enrollments</h2>
            <Link
              to="/admin/students"
              className="text-sm primary-text hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentEnrollments.length === 0 ? (
              <p className="text-theme-muted">No recent enrollments.</p>
            ) : (
              recentEnrollments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-theme p-4"
                >
                  <div>
                    <h3 className="font-semibold">{item.studentName}</h3>
                    <p className="text-sm text-theme-muted">
                      {item.courseTitle}
                    </p>
                  </div>

                  <span className="text-xs text-theme-muted">
                    {item.enrolledAt?.toDate
                      ? item.enrolledAt.toDate().toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Test Activity */}
        <div className="card-theme rounded-3xl p-6 border border-theme">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Recent Test Activity</h2>
            <Link
              to="/admin/tests"
              className="text-sm primary-text hover:underline flex items-center gap-1"
            >
              View Tests
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentTests.length === 0 ? (
              <p className="text-theme-muted">No test submissions yet.</p>
            ) : (
              recentTests.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-theme p-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {item.studentName || "Student"}
                    </h3>
                    <p className="text-sm text-theme-muted">
                      {item.testTitle || "Test"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold primary-text">
                      {item.totalQuestions
                        ? Math.round((item.score / item.totalQuestions) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-theme-muted">
                      {item.submittedAt?.toDate
                        ? item.submittedAt.toDate().toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="card-theme rounded-3xl p-6 border border-theme">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Today’s Classes</h2>

          <Link
            to="/admin/classes"
            className="text-sm primary-text hover:underline flex items-center gap-1"
          >
            Manage Classes
            <ArrowRight size={16} />
          </Link>
        </div>

        {todayClasses.length === 0 ? (
          <div className="text-center py-10 text-theme-muted">
            No classes scheduled for today.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {todayClasses.map((cls) => {
              const start = cls.startTime?.toDate
                ? cls.startTime.toDate()
                : new Date(cls.startTime);

              const end = cls.endTime?.toDate
                ? cls.endTime.toDate()
                : new Date(cls.endTime);

              const now = new Date();

              const status =
                now >= start && now <= end
                  ? "Live"
                  : now < start
                    ? "Upcoming"
                    : "Completed";

              return (
                <div
                  key={cls.id}
                  className="rounded-2xl border border-theme p-5 hover-theme transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "Live"
                          ? "bg-green-100 text-green-700"
                          : status === "Upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>

                    <Calendar size={18} className="text-theme-muted" />
                  </div>

                  <h3 className="font-bold text-lg">{cls.title}</h3>

                  <p className="text-sm text-theme-muted mt-1">
                    {cls.courseName}
                  </p>

                  <div className="mt-4 text-sm">
                    <p className="font-medium">
                      {start.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {end.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="text-theme-muted mt-1">
                      Instructor: {cls.instructorName || "Trainer"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="card-theme rounded-3xl p-6 border border-theme shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color]}`}
        >
          {icon}
        </div>
      </div>

      <h3 className="text-theme-muted text-sm font-medium">{title}</h3>

      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function QuickAction({ to, title, description }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-theme p-5 hover-theme transition group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-theme-muted mt-2">{description}</p>
        </div>

        <ArrowRight
          size={20}
          className="primary-text group-hover:translate-x-1 transition"
        />
      </div>
    </Link>
  );
}

export default AdminDashboard;
