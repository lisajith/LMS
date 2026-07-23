import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FileQuestion } from "lucide-react";

function EditTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    courseId: "",
    courseName: "",
    description: "",
    duration: 30,
    totalMarks: 0,
    startDate: "",
    endDate: "",
    isPublished: false,
    questions: [],
  });
  const [courses, setCourses] = useState([]);

  function formatForDateTimeLocal(timestamp) {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    // Convert to local timezone for datetime-local input
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // -------------------------
        // Fetch test
        // -------------------------
        const snap = await getDoc(doc(db, "tests", id));

        if (snap.exists()) {
          const data = snap.data();

          setForm({
            title: data.title || "",
            courseId: data.courseId || "",
            courseName: data.courseName || "",
            description: data.description || "",
            duration: data.duration || 30,
            totalMarks: data.totalMarks || 0,
            startDate: formatForDateTimeLocal(data.startDate),
            endDate: formatForDateTimeLocal(data.endDate),
            isPublished: data.isPublished || false,
            questions: data.questions || [],
          });
        }

        // -------------------------
        // Fetch courses
        // -------------------------
        const courseSnap = await getDocs(collection(db, "courses"));

        const courseList = courseSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCourses(courseList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function handleQuestionChange(index, field, value) {
    const updated = [...form.questions];
    updated[index][field] = value;
    setForm({ ...form, questions: updated });
  }

  function handleOptionChange(qIndex, oIndex, value) {
    const updated = [...form.questions];
    updated[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: updated });
  }

  function addQuestion() {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
          marks: 1,
        },
      ],
    });
  }

  function removeQuestion(index) {
    setForm({
      ...form,
      questions: form.questions.filter((_, i) => i !== index),
    });
  }

  const calculatedTotalMarks = form.questions.reduce(
    (sum, q) => sum + Number(q.marks || 0),
    0
  );

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "tests", id), {
        ...form,
        duration: Number(form.duration),
        totalMarks: calculatedTotalMarks,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        updatedAt: serverTimestamp(),
      });

      alert("Test updated successfully");
      navigate("/admin/tests");
    } catch (err) {
      console.error(err);
      alert("Failed to update test");
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading test...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Test</h1>
        <p className="text-theme-muted">Update test details and questions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-theme">
              Test Title
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 rounded-xl border border-theme bg-theme"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-theme">
              Select Course
            </label>

            <select
              value={form.courseId}
              onChange={(e) => {
                const selected = courses.find((c) => c.id === e.target.value);

                setForm({
                  ...form,
                  courseId: selected?.id || "",
                  courseName: selected?.title || "",
                });
              }}
              className="w-full p-3 rounded-xl border border-theme bg-theme"
              required
            >
              <option value="">Choose a course</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            <p className="text-xs text-theme-muted">
              The course name is automatically linked from the database.
            </p>
          </div>
        </div>

        <label className="block text-sm font-semibold text-theme">
          Description
        </label>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 rounded-xl border border-theme bg-theme"
          rows={3}
        />

        <label className="block text-sm font-semibold text-theme">
          Duration(minutes)
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full p-3 rounded-xl border border-theme bg-theme"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-theme">
            Total Marks
          </label>

          <div className="w-full p-3 rounded-xl border border-theme bg-theme-secondary font-bold text-lg">
            {calculatedTotalMarks} Marks
          </div>

          <p className="text-xs text-theme-muted">
            Automatically calculated from question marks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-theme">
              Test Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full p-3 rounded-xl border border-theme bg-theme"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-theme">
              Test End Date & Time
            </label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full p-3 rounded-xl border border-theme bg-theme"
            />
          </div>
        </div>

        {/* Publish Status */}
        <div className="card-theme rounded-2xl border border-theme p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-theme">Test Status</h3>
              <p className="text-sm text-theme-muted mt-1">
                Publish this test to make it visible and accessible to students.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  isPublished: !prev.isPublished,
                }))
              }
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                form.isPublished
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-all duration-300 ${
                  form.isPublished ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                form.isPublished
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  form.isPublished ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              {form.isPublished ? "Published" : "Draft"}
            </span>

            <span className="text-sm text-theme-muted">
              {form.isPublished
                ? "Students can see and attempt this test."
                : "This test is saved as a draft and hidden from students."}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn-primary px-4 py-2 rounded-xl"
            >
              Add Question
            </button>
          </div>

          {form.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="card-theme rounded-3xl p-6 border border-theme shadow-lg space-y-5"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <FileQuestion className="text-blue-600" size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-theme">
                      Question {qIndex + 1}
                    </h3>

                    <p className="text-sm text-theme-muted">
                      Configure question, options, answer, and marks
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 w-full">
                  <label className="block text-sm font-semibold text-theme">
                    Question
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Enter the question"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-theme bg-theme resize-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="space-y-2">
                    <label className="block text-sm font-semibold text-theme">
                      Option {String.fromCharCode(65 + oIndex)}
                    </label>

                    <input
                      type="text"
                      placeholder={`Enter option ${String.fromCharCode(65 + oIndex)}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                      className="w-full p-3 rounded-xl border border-theme bg-theme"
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-theme">
                    Correct Answer
                  </label>

                  <select
                    value={q.answer}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "answer", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-theme bg-theme"
                  >
                    <option value="">Select correct answer</option>

                    {q.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option || `Option ${String.fromCharCode(65 + i)}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-theme">
                    Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={q.marks}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "marks",
                        Number(e.target.value)
                      )
                    }
                    className="w-full p-3 rounded-xl border border-theme bg-theme"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
            form.isPublished
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {form.isPublished ? "Save & Publish Test" : "Save as Draft"}
        </button>
      </form>
    </div>
  );
}

export default EditTest;