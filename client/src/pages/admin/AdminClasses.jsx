import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  Clock3,
  Users,
  Video,
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    try {
      const q = query(collection(db, "classes"), orderBy("startTime", "asc"));

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClasses(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this class session?");

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "classes", id));

      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete class");
    }
  }

  function formatDate(timestamp) {
    if (!timestamp?.toDate) return "Not scheduled";

    return timestamp.toDate().toLocaleString();
  }

  if (loading) {
    return <div className="p-10 text-center">Loading classes...</div>;
  }

  async function generateAttendanceCode(item) {
    try {
      // 6-character random code
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      let code = "";

      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }

      // Expire after 15 minutes
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Use courseId as document ID
      await setDoc(doc(db, "attendanceCodes", item.courseId), {
        courseId: item.courseId,
        classId: item.id,
        code,
        active: true,
        generatedBy: item.instructorId,
        generatedAt: serverTimestamp(),
        expiresAt,
      });

      alert(`Attendance code generated: ${code}`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate attendance code");
    }
  }

  function getClassStatus(item) {
    const now = new Date();

    const start = item.startTime?.toDate
      ? item.startTime.toDate()
      : new Date(item.startTime);

    const end = item.endTime?.toDate
      ? item.endTime.toDate()
      : new Date(item.endTime);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Live";
    return "Completed";
  }

  function statusStyle(status) {
    switch (status) {
      case "Live":
        return "bg-green-100 text-green-700";
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // async function fetchActiveCodes() {
  //   try {
  //     const q = query(
  //       collection(db, "attendanceCodes"),
  //       where("active", "==", true)
  //     );

  //     const snap = await getDocs(q);

  //     const codesMap = {};

  //     snap.docs.forEach((d) => {
  //       const data = d.data();

  //       codesMap[data.courseId] = {
  //         id: d.id,
  //         code: data.code,
  //       };
  //     });

  //     setActiveCodes(codesMap);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  async function closeAttendance(courseId) {
    try {
      const activeCode = activeCodes[courseId];

      if (!activeCode) return;

      await updateDoc(doc(db, "attendanceCodes", activeCode.id), {
        active: false,
      });

      alert("Attendance closed successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to close attendance");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
        <AdminPageHeader
          icon={<Calendar size={30} />}
          title="Live Class Scheduling"
          description="Schedule live sessions, manage instructors, meeting links, and track upcoming and completed classes."
          action={
            <Link
              to="/admin/classes/create"
              className="bg-white text-blue-700 px-5 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Schedule Class
            </Link>
          }
        />

      {/* Empty State */}
      {classes.length === 0 ? (
        <div className="card-theme rounded-2xl p-12 text-center border border-theme">
          <Calendar size={48} className="mx-auto text-theme-muted mb-4" />

          <h2 className="text-xl font-bold mb-2">No classes scheduled</h2>

          <p className="text-theme-muted">
            Create your first live class session.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {classes.map((item) => (
            <div
              key={item.id}
              className="card-theme rounded-2xl p-6 border border-theme shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                {/* Left */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">{item.title}</h2>

                    {(() => {
                      const status = getClassStatus(item);

                      return (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(status)}`}
                        >
                          {status}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-theme-muted">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{item.courseName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{item.instructorName || "No Instructor"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      <span>{formatDate(item.startTime)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Video size={16} />
                      <span>
                        {item.meetingLink ? "Meeting Ready" : "No Link"}
                      </span>
                    </div>
                  </div>

                  <p className="text-theme-muted">
                    {item.description || "No description provided."}
                  </p>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/classes/edit/${item.id}`}
                    className="p-3 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminClasses;
