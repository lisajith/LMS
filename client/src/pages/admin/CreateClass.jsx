import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { Save, Calendar, Users, Video } from "lucide-react";

function CreateClass() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  // For now we use admin users as instructors
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
  });

  useEffect(() => {
    async function fetchData() {
      // Fetch courses
      const courseSnap = await getDocs(collection(db, "courses"));

      const courseList = courseSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(courseList);

      // Fetch instructors (admin users)
      const userSnap = await getDocs(collection(db, "users"));

      const instructorList = userSnap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role === "admin");

      setInstructors(instructorList);
    }

    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addDoc(collection(db, "classes"), {
        courseId: form.courseId,
        courseName: form.courseName,

        instructorId: form.instructorId,
        instructorName: form.instructorName,

        title: form.title,
        description: form.description,
        meetingLink: form.meetingLink,

        startTime: new Date(form.startTime),
        endTime: new Date(form.endTime),

        status: "Upcoming",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Class scheduled successfully");

      navigate("/admin/classes");
    } catch (error) {
      console.error(error);
      alert("Failed to schedule class");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl primary-soft flex items-center justify-center">
          <Calendar className="primary-text" size={24} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Schedule Class</h1>

          <p className="text-theme-muted">
            Create a new live class session for students
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
            required
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
            required
          >
            <option value="">Select Instructor</option>

            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Class Title */}
        <div>
          <label className="block font-semibold mb-2">Class Title</label>

          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="w-full rounded-xl border border-theme bg-theme p-4"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>

          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what will be covered in this class"
            className="w-full rounded-xl border border-theme bg-theme p-4"
          />
        </div>

        {/* Meeting Link */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-2">
            <Video size={18} />
            Meeting Link
          </label>

          <input
            type="url"
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            placeholder="https://meet.google.com/..."
            className="w-full rounded-xl border border-theme bg-theme p-4"
            required
          />
        </div>

        {/* Start & End */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Start Time</label>

            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full rounded-xl border border-theme bg-theme p-4"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">End Time</label>

            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full rounded-xl border border-theme bg-theme p-4"
              required
            />
          </div>
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
            Schedule Class
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateClass;
