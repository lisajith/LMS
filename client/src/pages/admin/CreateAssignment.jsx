import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

function CreateAssignment() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    courseId: "",
    courseName: "",
    title: "",
    description: "",
    dueDate: "",
    maxMarks: 10,
    attachmentUrl: "",
  });

  useEffect(() => {
    async function fetchCourses() {
      const snapshot = await getDocs(collection(db, "courses"));

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(list);
    }

    fetchCourses();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.courseId || !form.title || !form.description || !form.dueDate) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "assignments"), {
        ...form,
        maxMarks: Number(form.maxMarks),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublished: true,
      });

      alert("Assignment created successfully");

      navigate("/admin/assignments");
    } catch (error) {
      console.error(error);

      alert("Failed to create assignment");
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Assignment</h1>

        <p className="text-theme-muted">Add a new assignment for a course</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-theme rounded-3xl p-8 border border-theme space-y-6"
      >
        <div>
          <label className="block font-semibold mb-2">Course</label>

          <select
            name="courseId"
            value={form.courseId}
            onChange={(e) => {
              const selected = courses.find(
                (course) => course.id === e.target.value
              );

              setForm((prev) => ({
                ...prev,
                courseId: e.target.value,
                courseName: selected?.title || "",
              }));
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

        <div>
          <label className="block font-semibold mb-2">Assignment Title</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-theme bg-theme p-4"
            placeholder="Variables Practice"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-xl border border-theme bg-theme p-4"
            placeholder="Explain the assignment requirements..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-theme bg-theme p-4"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Max Marks</label>

            <input
              type="number"
              name="maxMarks"
              value={form.maxMarks}
              onChange={handleChange}
              className="w-full rounded-xl border border-theme bg-theme p-4"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Attachment URL (Optional)
          </label>

          <input
            type="url"
            name="attachmentUrl"
            value={form.attachmentUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-theme bg-theme p-4"
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/assignments")}
            className="px-5 py-3 rounded-xl border border-theme hover:bg-theme-hover transition"
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary px-6 py-3 rounded-xl">
            Publish Assignment
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAssignment;
