import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { Save, Calendar } from "lucide-react";

function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const [form, setForm] = useState({
    courseId: "",
    courseName: "",

    instructorId: "",
    instructorName: "",

    title: "",
    description: "",
    meetingLink: "",
    startTime: "",
    endTime: "",
    status: "Upcoming",
  });

  function formatDateTimeLocal(timestamp) {
    if (!timestamp?.toDate) return "";

    const date = timestamp.toDate();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch class
        const classSnap = await getDoc(doc(db, "classes", id));

        if (classSnap.exists()) {
          const data = classSnap.data();

          setForm({
            courseId: data.courseId || "",
            courseName: data.courseName || "",

            instructorId: data.instructorId || "",
            instructorName: data.instructorName || "",

            title: data.title || "",
            description: data.description || "",
            meetingLink: data.meetingLink || "",

            startTime: formatDateTimeLocal(data.startTime),
            endTime: formatDateTimeLocal(data.endTime),

            status: data.status || "Upcoming",
          });
        }

        // Fetch courses
        const courseSnap = await getDocs(collection(db, "courses"));

        setCourses(
          courseSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        // Fetch instructors
        const userSnap = await getDocs(collection(db, "users"));

        setInstructors(
          userSnap.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((u) => u.role === "admin")
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "classes", id), {
        ...form,

        startTime: new Date(form.startTime),
        endTime: new Date(form.endTime),

        updatedAt: serverTimestamp(),
      });

      alert("Class updated successfully");

      navigate("/admin/classes");
    } catch (error) {
      console.error(error);
      alert("Failed to update class");
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading class...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl primary-soft flex items-center justify-center">
          <Calendar className="primary-text" size={24} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Edit Class</h1>
          <p className="text-theme-muted">
            Update class schedule and instructor details
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card-theme rounded-3xl p-8 border border-theme space-y-6"
      >
        {/* Course */}
        <div>
          <label className="block font-semibold mb-2">Course</label>

          <select
            value={form.courseId}
            onChange={(e) => {
              const selected = courses.find((c) => c.id === e.target.value);

              setForm({
                ...form,
                courseId: e.target.value,
                courseName: selected?.title || "",
              });
            }}
            className="w-full rounded-xl border border-theme bg-theme p-4"
          >
            <option value="">Select Course</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Instructor */}
        <div>
          <label className="block font-semibold mb-2">Instructor</label>

          <select
            value={form.instructorId}
            onChange={(e) => {
              const selected = instructors.find((i) => i.id === e.target.value);

              setForm({
                ...form,
                instructorId: e.target.value,
                instructorName: selected?.name || "",
              });
            }}
            className="w-full rounded-xl border border-theme bg-theme p-4"
          >
            <option value="">Select Instructor</option>

            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-2">Class Title</label>

          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-theme bg-theme p-4"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>

          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-theme bg-theme p-4"
          />
        </div>

        {/* Meeting Link */}
        <div>
          <label className="block font-semibold mb-2">Meeting Link</label>

          <input
            type="url"
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            className="w-full rounded-xl border border-theme bg-theme p-4"
          />
        </div>

        {/* Time */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Start Time</label>

            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full rounded-xl border border-theme bg-theme p-4"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">End Time</label>

            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full rounded-xl border border-theme bg-theme p-4"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-2">Status</label>

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-xl border border-theme bg-theme p-4"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/classes")}
            className="px-5 py-3 rounded-xl border border-theme hover:bg-theme-hover transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Save size={18} />
            Update Class
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditClass;
