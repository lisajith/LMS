import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { Plus, Trash2, Save, FileQuestion } from "lucide-react";

function CreateTest() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    courseId: "",
    courseName: "",
    title: "",
    description: "",
    duration: 30,
    startDate: "",
    endDate: "",
    isPublished: true,
  });

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      answer: "",
      marks: 1,
    },
  ]);

  useEffect(() => {
    async function fetchCourses() {
      const snap = await getDocs(collection(db, "courses"));

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(list);
    }

    fetchCourses();
  }, []);

  function updateQuestion(index, field, value) {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  }

  function updateOption(qIndex, oIndex, value) {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  }

  function addQuestion() {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
        marks: 1,
      },
    ]);
  }

  function removeQuestion(index) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks), 0);

    try {
      await addDoc(collection(db, "tests"), {
        ...form,
        duration: Number(form.duration),
        totalMarks,
        questions,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Test created successfully");

      navigate("/admin/tests");
    } catch (error) {
      console.error(error);
      alert("Failed to create test");
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Test</h1>

        <p className="text-theme-muted">
          Build a course test with multiple-choice questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card-theme rounded-3xl p-8 border border-theme space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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

            <div>
              <label className="block font-semibold mb-2">
                Duration (minutes)
              </label>

              <input
                type="number"
                value={form.duration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-theme bg-theme p-4"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Test Title</label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="w-full rounded-xl border border-theme bg-theme p-4"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Description</label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full rounded-xl border border-theme bg-theme p-4"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Start Date</label>

              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-theme bg-theme p-4"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">End Date</label>

              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-theme bg-theme p-4"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                setForm({
                  ...form,
                  isPublished: e.target.checked,
                })
              }
            />

            <span className="font-medium">Publish immediately</span>
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileQuestion className="primary-text" />
              <h2 className="text-2xl font-bold">Questions</h2>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 rounded-xl border border-theme hover:bg-theme-hover flex items-center gap-2"
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>

          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="card-theme rounded-2xl p-6 border border-theme space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-lg">Question {qIndex + 1}</h3>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                placeholder="Enter question"
                value={q.question}
                onChange={(e) =>
                  updateQuestion(qIndex, "question", e.target.value)
                }
                className="w-full rounded-xl border border-theme bg-theme p-4"
                required
              />

              <div className="grid md:grid-cols-2 gap-3">
                {q.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    className="rounded-xl border border-theme bg-theme p-3"
                    required
                  />
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Correct Answer
                  </label>

                  <select
                    value={q.answer}
                    onChange={(e) =>
                      updateQuestion(qIndex, "answer", e.target.value)
                    }
                    className="w-full rounded-xl border border-theme bg-theme p-3"
                    required
                  >
                    <option value="">Select answer</option>

                    {q.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option || `Option ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={q.marks}
                    onChange={(e) =>
                      updateQuestion(qIndex, "marks", Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-theme bg-theme p-3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/tests")}
            className="px-5 py-3 rounded-xl border border-theme hover:bg-theme-hover transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Save size={18} />
            Create Test
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTest;