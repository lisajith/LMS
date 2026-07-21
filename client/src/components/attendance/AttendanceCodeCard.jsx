import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { KeyRound, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

function AttendanceCodeCard() {
  const { user, userData } = useAuth();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState(false);

  // Load student's enrolled courses
  useEffect(() => {
    async function fetchCourses() {
      if (!user) return;

      try {
        // Get student enrollments
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        // Unique course IDs
        const courseIds = [...new Set(snap.docs.map((d) => d.data().courseId))];

        // Fetch actual course documents
        const coursePromises = courseIds.map(async (courseId) => {
          const courseDoc = await getDoc(doc(db, "courses", courseId));

          if (courseDoc.exists()) {
            return {
              id: courseId,
              title: courseDoc.data().title || "Untitled Course",
            };
          }

          return null;
        });

        const courses = (await Promise.all(coursePromises)).filter(Boolean);

        setEnrolledCourses(courses);
        setSelectedCourse(""); // force user to choose
      } catch (err) {
        console.error(err);
      }
    }

    fetchCourses();
  }, [user]);

  async function handleMarkAttendance() {
    if (!selectedCourse || !code.trim()) {
      toast.error("Please enter the attendance code");
      return;
    }

    try {
      setLoading(true);

      // Get active code for selected course
      const codeRef = doc(db, "attendanceCodes", selectedCourse);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        toast.error("No active attendance session for this course");
        return;
      }

      const data = codeSnap.data();

      // Check active
      if (!data.active) {
        toast.error("Attendance session is closed");
        return;
      }

      // Check expiry
      const expiresAt = data.expiresAt?.toDate
        ? data.expiresAt.toDate()
        : new Date(data.expiresAt);

      if (new Date() > expiresAt) {
        toast.error("Attendance code has expired");
        return;
      }

      // Check code
      if (code.trim().toLowerCase() !== data.code.toLowerCase()) {
        toast.error("Invalid attendance code");
        return;
      }

      // Prevent duplicate attendance
      const attendanceId = `${user.uid}_${data.classId}`;
      const attendanceRef = doc(db, "attendance", attendanceId);

      const existing = await getDoc(attendanceRef);

      if (existing.exists()) {
        toast.error("Attendance already marked for this class");
        return;
      }

      // Save attendance
      await setDoc(attendanceRef, {
        studentId: user.uid,
        studentName: userData?.name || user.displayName || "Student",

        courseId: selectedCourse,
        classId: data.classId,

        status: "Present",

        attendanceCode: data.code,
        markedAt: serverTimestamp(),
      });

      setMarked(true);
      setCode("");

      toast.success("Attendance marked successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg space-y-5">
      {" "}
      <div className="flex items-center gap-3">
        {" "}
        <div className="w-12 h-12 rounded-2xl primary-soft flex items-center justify-center">
          {" "}
          <KeyRound className="primary-text" size={24} />{" "}
        </div>
        <div>
          <h2 className="text-2xl font-bold">Attendance Code</h2>
          <p className="text-theme-muted">
            Enter the code shared by your instructor
          </p>
        </div>
      </div>
      {marked ? (
        <div className="rounded-2xl border border-green-300 bg-green-50 p-5 text-center">
          <CheckCircle2 size={40} className="mx-auto text-green-600 mb-3" />

          <h3 className="text-lg font-bold text-green-700">
            Attendance Marked
          </h3>

          <p className="text-green-700 text-sm mt-1">
            Your attendance has been recorded successfully.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Course Selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Course</label>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-2xl border border-theme bg-theme px-4 py-3"
            >
              <option value="">Select enrolled course</option>

              {enrolledCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Attendance Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toLowerCase())}
              maxLength={6}
              placeholder="e.g. k3m8xq"
              className="w-full rounded-2xl border border-theme bg-theme px-4 py-4 text-center text-2xl font-mono tracking-[0.4em] lowercase"
            />
          </div>

          <button
            onClick={handleMarkAttendance}
            disabled={loading}
            className="w-full btn-primary px-5 py-3 rounded-2xl font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying Code..." : "Mark Attendance"}
          </button>

          <p className="text-xs text-theme-muted text-center">
            Codes are case-insensitive and expire automatically when the
            instructor closes attendance.
          </p>
        </div>
      )}
    </div>
  );
}

export default AttendanceCodeCard;
