import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

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
    questions: [],
  });

  useEffect(() => {
    async function fetchTest() {
      try {
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
            startDate: data.startDate?.toDate
              ? data.startDate.toDate().toISOString().slice(0, 16)
              : "",
            endDate: data.endDate?.toDate
              ? data.endDate.toDate().toISOString().slice(0, 16)
              : "",
            questions: data.questions || [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTest();
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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "tests", id), {
        ...form,
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
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
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Test Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 rounded-xl border border-theme bg-theme"
            required
          />

          <input
            type="text"
            placeholder="Course Name"
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="w-full p-3 rounded-xl border border-theme bg-theme"
            required
          />
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 rounded-xl border border-theme bg-theme"
          rows={3}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full p-3 rounded-xl border border-theme bg-theme"
          />

          <input
            type="number"
            placeholder="Total Marks"
            value={form.totalMarks}
            onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
            className="w-full p-3 rounded-xl border border-theme bg-theme"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full p-3 rounded-xl border border-theme bg-theme"
          />

          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full p-3 rounded-xl border border-theme bg-theme"
          />
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
              className="card-theme rounded-2xl p-5 border border-theme space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
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

                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="px-3 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
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

        <button type="submit" className="btn-primary px-6 py-3 rounded-xl">
          Update Test
        </button>
      </form>
    </div>
  );
}

export default EditTest;
