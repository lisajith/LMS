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
} from "lucide-react";

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
    const ok = window.confirm("Delete this test?");

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "tests", id));

      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete test");
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading tests... </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tests</h1>

          <p className="text-theme-muted">Create and manage course tests</p>
        </div>

        <Link
          to="/admin/tests/create"
          className="btn-primary px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} />
          Create Test
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="card-theme rounded-2xl p-12 text-center border border-theme">
          <FileQuestion size={48} className="mx-auto text-theme-muted mb-4" />

          <h2 className="text-xl font-bold mb-2">No tests available</h2>

          <p className="text-theme-muted">
            Create your first test for students.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="card-theme rounded-2xl p-6 border border-theme shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h2 className="text-xl font-bold">{test.title}</h2>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-theme-muted">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>{test.courseName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{test.duration} mins</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileQuestion size={16} />
                      <span>{test.questions?.length || 0} Questions</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{test.totalMarks} Marks</span>
                    </div>
                  </div>

                  <p className="text-theme-muted">{test.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/tests/submissions/${test.id}`}
                    className="p-3 rounded-xl border border-theme hover:bg-theme-hover transition"
                  >
                    <Users size={18} />
                  </Link>

                  <Link
                    to={`/admin/tests/edit/${test.id}`}
                    className="p-3 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(test.id)}
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

export default AdminTests;
