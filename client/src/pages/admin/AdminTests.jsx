import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import {
  Plus,
  Trash2,
  Edit,
  FileQuestion,
  Clock,
  BookOpen,
  Users,
  ShieldCheck,
  Eye,
  CalendarDays,
} from "lucide-react";

import AdminPageHeader from "../../components/admin/AdminPageHeader";

function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  async function fetchTests() {
    try {
      const snapshot = await getDocs(collection(db, "tests"));

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTests(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm(
      "Are you sure you want to permanently delete this test?"
    );

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "tests", id));
      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete test");
    }
  }

  function formatDate(date) {
    if (!date) return "Not scheduled";

    try {
      return date.toDate().toLocaleString();
    } catch {
      return "Not scheduled";
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {" "}
        <div className="text-center">
          {" "}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>{" "}
          <p className="text-theme-muted">Loading tests...</p>{" "}
        </div>{" "}
      </div>
    );
  }

  return (
    
    <div className="space-y-6">
      <AdminPageHeader
        icon={<ShieldCheck size={30} />}
        title="Test & Assessment Hub"
        description="Create exams, manage questions, review submissions, and analyze student performance."
        action={
          <Link
            to="/admin/tests/create"
            className="bg-white text-blue-700 px-5 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
          >
            {" "}
            <Plus size={18} />
            Create Test{" "}
          </Link>
        }
      />

      {tests.length === 0 ? (
        <div className="card-theme rounded-3xl p-16 text-center border border-theme shadow-lg">
          <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
            <FileQuestion size={40} className="text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold mb-2">No Tests Created Yet</h2>
          <p className="text-theme-muted mb-6">
            Start by creating your first assessment for students.
          </p>

          <Link
            to="/admin/tests/create"
            className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl font-semibold"
          >
            <Plus size={18} />
            Create First Test
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {tests.map((test) => {
            // ✅ Correct calculation PER TEST
            const calculatedMarks = (test.questions || []).reduce(
              (sum, q) => sum + Number(q.marks || 0),
              0
            );

            return (
              <div
                key={test.id}
                className="card-theme rounded-3xl p-6 border border-theme shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-theme">
                          {test.title}
                        </h2>
                        <p className="text-theme-muted mt-1">
                          {test.description || "No description provided"}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          test.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {test.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="rounded-2xl bg-theme-secondary border border-theme p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen size={18} className="text-blue-600" />
                          <span className="text-sm text-theme-muted">
                            Course
                          </span>
                        </div>
                        <p className="font-bold text-theme truncate">
                          {test.courseName || "Unknown"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-theme-secondary border border-theme p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={18} className="text-purple-600" />
                          <span className="text-sm text-theme-muted">
                            Duration
                          </span>
                        </div>
                        <p className="font-bold text-theme">
                          {test.duration || 0} min
                        </p>
                      </div>

                      <div className="rounded-2xl bg-theme-secondary border border-theme p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileQuestion size={18} className="text-indigo-600" />
                          <span className="text-sm text-theme-muted">
                            Questions
                          </span>
                        </div>
                        <p className="font-bold text-theme">
                          {test.questions?.length || 0}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-theme-secondary border border-theme p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={18} className="text-green-600" />
                          <span className="text-sm text-theme-muted">
                            Marks
                          </span>
                        </div>
                        <p className="font-bold text-theme">
                          {calculatedMarks}
                        </p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-theme-muted">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>Starts: {formatDate(test.startDate)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>Ends: {formatDate(test.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                    <Link
                      to={`/admin/tests/submissions/${test.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-theme hover:bg-theme-hover transition font-medium"
                    >
                      <Eye size={18} />
                      <span className="hidden lg:inline">Submissions</span>
                    </Link>

                    <Link
                      to={`/admin/tests/edit/${test.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition font-medium"
                    >
                      <Edit size={18} />
                      <span className="hidden lg:inline">Edit</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(test.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition font-medium"
                    >
                      <Trash2 size={18} />
                      <span className="hidden lg:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminTests;
