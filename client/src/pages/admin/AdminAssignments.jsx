import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { Plus, Edit, Trash2, Calendar, BookOpen, FileText } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAssignments() {
    try {
      const snapshot = await getDocs(collection(db, "assignments"));

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssignments(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Delete this assignment?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "assignments", id));

      setAssignments((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete assignment");
    }
  }

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading assignments... </div>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<FileText size={30} />}
        title="Assignment Center"
        description="Create assignments, manage deadlines, review submissions, and monitor student completion."
        action={
          <Link
            to="/admin/assignments/create"
            className="bg-white text-blue-700 px-5 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Create Assignment
          </Link>
        }
      />

      {assignments.length === 0 ? (
        <div className="card-theme rounded-2xl p-12 text-center border border-theme">
          <FileText size={48} className="mx-auto text-theme-muted mb-4" />

          <h2 className="text-xl font-bold mb-2">No assignments yet</h2>

          <p className="text-theme-muted">
            Create your first assignment for students.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="card-theme rounded-2xl p-6 border border-theme shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold">{assignment.title}</h2>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-theme-muted">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>{assignment.courseName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        Due:{" "}
                        {assignment.dueDate?.toDate
                          ? assignment.dueDate
                              .toDate()
                              .toLocaleDateString("en-IN")
                          : assignment.dueDate}
                      </span>
                    </div>
                  </div>

                  <p className="text-theme-muted">{assignment.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/assignments/edit/${assignment.id}`}
                    className="p-3 rounded-xl border border-the text-blue-600 hover-theme transition"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="p-3 rounded-xl border border-theme text-red-600 hover-theme transition cursor-pointer"
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

export default AdminAssignments;
