import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { KeyRound, Users, Radio, Save, ClipboardCheck } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

function AdminAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCode, setActiveCode] = useState(null);
  const [markedStudents, setMarkedStudents] = useState([]);

  // unsubscribe listener when class changes
  const unsubscribeRef = useRef(null);

  // =========================
  // Load classes
  // =========================
  useEffect(() => {
    async function fetchClasses() {
      try {
        const snap = await getDocs(collection(db, "classes"));

        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setClasses(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  // =========================
  // Listen attendance realtime
  // =========================
  function listenMarkedAttendance(classId) {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const q = query(
      collection(db, "attendance"),
      where("classId", "==", classId)
    );

    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const marked = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setMarkedStudents(marked);

      // sync dropdowns
      const liveAttendance = {};

      marked.forEach((m) => {
        liveAttendance[m.studentId] = m.status;
      });

      setAttendance((prev) => ({
        ...prev,
        ...liveAttendance,
      }));
    });
  }

  // =========================
  // Select class
  // =========================
  async function handleClassSelect(classId) {
    try {
      const cls = classes.find((c) => c.id === classId);
      if (!cls) return;

      setSelectedClass(cls);

      // Load existing code
      const codeDoc = await getDoc(doc(db, "attendanceCodes", cls.courseId));

      if (codeDoc.exists() && codeDoc.data().active) {
        setActiveCode(codeDoc.data().code);
      } else {
        setActiveCode(null);
      }

      // Get enrolled students
      const enrollmentQuery = query(
        collection(db, "enrollments"),
        where("courseId", "==", cls.courseId)
      );

      const enrollmentSnap = await getDocs(enrollmentQuery);

      const studentPromises = enrollmentSnap.docs.map(async (d) => {
        const data = d.data();

        const userDoc = await getDoc(doc(db, "users", data.userId));

        return {
          userId: data.userId,
          studentName: userDoc.exists()
            ? userDoc.data().name || "Student"
            : "Student",
        };
      });

      const studentList = await Promise.all(studentPromises);

      setStudents(studentList);

      // Start with Pending
      setAttendance({});

      // Start realtime listener
      listenMarkedAttendance(cls.id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load class");
    }
  }

  // =========================
  // Generate code
  // =========================
  async function generateCode() {
    if (!selectedClass) return;

    try {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      let code = "";

      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await setDoc(doc(db, "attendanceCodes", selectedClass.courseId), {
        courseId: selectedClass.courseId,
        classId: selectedClass.id,
        code,
        active: true,
        generatedAt: serverTimestamp(),
        expiresAt,
      });

      setActiveCode(code);
      toast.success("Attendance code generated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate code");
    }
  }

  // =========================
  // Close attendance
  // =========================
  async function closeAttendance() {
    if (!selectedClass) return;

    try {
      await updateDoc(doc(db, "attendanceCodes", selectedClass.courseId), {
        active: false,
      });

      setActiveCode(null);
      toast.success("Attendance session closed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to close attendance");
    }
  }

  // =========================
  // Save attendance
  // =========================
  async function saveAttendance() {
    if (!selectedClass) return;

    try {
      let updatedCount = 0;

      for (const student of students) {
        const status = attendance[student.userId];

        // Keep Pending untouched
        if (!status || status === "Pending") {
          continue;
        }

        // SAME ID AS STUDENT SIDE
        const attendanceId = `${student.userId}_${selectedClass.id}`;

        await setDoc(
          doc(db, "attendance", attendanceId),
          {
            studentId: student.userId,
            studentName: student.studentName,

            courseId: selectedClass.courseId,
            courseName: selectedClass.courseName,

            classId: selectedClass.id,
            classTitle: selectedClass.title,

            status,

            markedBy: "admin",
            markedAt: serverTimestamp(),
          },
          { merge: true }
        );

        updatedCount++;
      }

      if (updatedCount === 0) {
        toast("No attendance changes to save");
        return;
      }

      toast.success(`Attendance updated for ${updatedCount} student(s)`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance");
    }
  }

  // =========================
  // Sort classes
  // =========================
  const sortedClasses = [...classes].sort((a, b) => {
    const now = new Date();

    const getPriority = (c) => {
      const start = c.startTime?.toDate
        ? c.startTime.toDate()
        : new Date(c.startTime);

      const end = c.endTime?.toDate ? c.endTime.toDate() : new Date(c.endTime);

      if (now >= start && now <= end) return 0; // Live
      if (now < start) return 1; // Upcoming
      return 2; // Completed
    };

    return getPriority(a) - getPriority(b);
  });

  if (loading) {
    return <div className="p-10 text-center">Loading attendance...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <AdminPageHeader
  icon={<KeyRound size={30} />}
  title="Attendance Management"
  description="Real-time classroom attendance management."
/>

      {/* Top Controls */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Class Selector */}
        <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
          <label className="block text-sm font-semibold mb-3">
            Select Class
          </label>

          <select
            onChange={(e) => handleClassSelect(e.target.value)}
            className="w-full rounded-2xl border border-theme bg-theme p-4 text-lg"
            defaultValue=""
          >
            <option value="" disabled>
              Choose a class session
            </option>

            {sortedClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.title} — {cls.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Code Generator */}
        {selectedClass && (
          <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Attendance Session</h3>
                <p className="text-theme-muted text-sm">
                  Generate or close student attendance access
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generateCode}
                  className="btn-primary px-4 py-3 rounded-2xl flex items-center gap-2"
                >
                  <Radio size={18} />
                  Generate
                </button>

                {activeCode && (
                  <button
                    onClick={closeAttendance}
                    className="px-4 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition font-semibold"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

            {activeCode ? (
              <div className="rounded-3xl bg-green-50 border border-green-300 p-6 text-center">
                <p className="text-sm font-semibold text-green-700">
                  ACTIVE ATTENDANCE CODE
                </p>

                <p className="text-5xl font-black tracking-[0.4em] text-green-800 mt-3">
                  {activeCode}
                </p>

                <p className="text-xs text-green-700 mt-3">
                  Students can mark attendance while this session is active.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-theme p-8 text-center text-theme-muted">
                No active attendance session
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      {selectedClass && (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Live Status */}
          <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg h-162.5 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <Users className="text-green-700" size={22} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold">Live Status</h3>
                  <p className="text-theme-muted text-sm">
                    Updates instantly when students mark attendance
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-green-700">
                  {markedStudents.length}
                </div>
                <div className="text-sm text-theme-muted">
                  of {students.length} marked
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {students.map((student) => {
                const record = markedStudents.find(
                  (m) => m.studentId === student.userId
                );

                return (
                  <div
                    key={student.userId}
                    className="flex items-center justify-between rounded-2xl border border-theme p-4 hover:bg-theme-hover transition"
                  >
                    <div>
                      <h4 className="font-semibold text-lg">
                        {student.studentName}
                      </h4>
                      <p className="text-sm text-theme-muted">
                        {student.userId}
                      </p>
                    </div>

                    {record ? (
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : record.status === "Late"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
                        Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Manual Attendance */}
          <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg h-162.5 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-2xl font-bold">Manual Attendance</h3>
                <p className="text-theme-muted text-sm">
                  Override student attendance when needed
                </p>
              </div>

              <button
                onClick={saveAttendance}
                className="btn-primary px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold"
              >
                <Save size={18} />
                Save
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {students.map((student) => (
                <div
                  key={student.userId}
                  className="rounded-2xl border border-theme p-4 space-y-3 hover:bg-theme-hover transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {student.studentName}
                      </h4>
                      <p className="text-sm text-theme-muted">
                        {student.userId}
                      </p>
                    </div>
                  </div>

                  <select
                    value={attendance[student.userId] || "Pending"}
                    onChange={(e) =>
                      setAttendance((prev) => ({
                        ...prev,
                        [student.userId]: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-theme bg-theme px-4 py-3 font-medium"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAttendance;
