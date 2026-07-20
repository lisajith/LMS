import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

function EditAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    async function fetchData() {
      try {
        // Courses
        const courseSnap = await getDocs(collection(db, "courses"));

        setCourses(
          courseSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        // Assignment
        const assignmentRef = doc(db, "assignments", id);

        const assignmentSnap = await getDoc(assignmentRef);

        if (assignmentSnap.exists()) {
          const data = assignmentSnap.data();

          setForm({
            courseId: data.courseId || "",
            courseName: data.courseName || "",
            title: data.title || "",
            description: data.description || "",
            dueDate:
              data.dueDate &&
              typeof data.dueDate === "object" &&
              data.dueDate.toDate
                ? data.dueDate.toDate().toISOString().split("T")[0]
                : data.dueDate || "",
            maxMarks: data.maxMarks || 10,
            attachmentUrl: data.attachmentUrl || data.attachment || "",
          });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load assignment");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "assignments", id), {
        ...form,
        maxMarks: Number(form.maxMarks),
        updatedAt: serverTimestamp(),
        attachmentUrl: form.attachmentUrl,
      });

      alert("Assignment updated successfully");

      navigate("/admin/assignments");
    } catch (error) {
      console.error(error);
      alert("Failed to update assignment");
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading assignment... </div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Assignment</h1>

        <p className="text-theme-muted">Update assignment details</p>
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
              const selected = courses.find((c) => c.id === e.target.value);

              setForm((prev) => ({
                ...prev,
                courseId: e.target.value,
                courseName: selected?.title || "",
              }));
            }}
            className="w-full rounded-xl border border-theme bg-theme p-4"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Title</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-theme bg-theme p-4"
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
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">Attachment URL</label>

          <input
            type="url"
            name="attachmentUrl"
            value={form.attachmentUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-theme bg-theme p-4"
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAssignment;
