import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  Save,
  X,
  Link,
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    duration: "",
    level: "Beginner",
    description: "",
    thumbnail: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const snapshot = await getDocs(collection(db, "courses"));

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function openCreateModal() {
    setEditingCourse(null);
    setFormData({
      title: "",
      instructor: "",
      duration: "",
      level: "Beginner",
      description: "",
      thumbnail: "",
    });
    setShowModal(true);
  }

  function openEditModal(course) {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      instructor: course.instructor || "",
      duration: course.duration || "",
      level: course.level || "Beginner",
      description: course.description || "",
      thumbnail: course.thumbnail || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const slug = generateSlug(formData.title);

      const payload = {
        title: formData.title,
        instructor: formData.instructor,
        duration: Number(formData.duration) || 0,
        level: formData.level,
        description: formData.description,
        thumbnail: formData.thumbnail,
        slug,
        updatedAt: serverTimestamp(),
      };

      if (editingCourse) {
        await updateDoc(doc(db, "courses", editingCourse.id), payload);
      } else {
        await addDoc(collection(db, "courses"), {
          ...payload,
          createdAt: serverTimestamp(),
          studentsCount: 0,
          rating: 0,
        });
      }

      setShowModal(false);
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Failed to save course");
    }
  }

  async function handleDelete(courseId) {
    const confirmed = window.confirm(
      "Delete this course? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "courses", courseId));
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert("Failed to delete course");
    }
  }

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-24">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <AdminPageHeader
        icon={<BookOpen size={30} />}
        title="Course Management"
        description="Create, update, and organize all learning courses, instructors, and curriculum content from one place."
        action={
          <button
            onClick={openCreateModal}
            className="bg-white text-blue-700 px-5 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Create Course
          </button>
        }
      />
      {/* Search */}
      <div className="card-theme rounded-3xl p-5 border border-theme shadow-lg">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
            size={20}
          />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {/* Table */}
      <div className="card-theme rounded-3xl border border-theme shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-theme-hover border-b border-theme">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Course</th>
                <th className="text-left px-6 py-4 font-semibold">
                  Instructor
                </th>
                <th className="text-left px-6 py-4 font-semibold">Duration</th>
                <th className="text-left px-6 py-4 font-semibold">Level</th>
                <th className="text-right px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <BookOpen className="text-theme-muted" size={48} />
                      <p className="text-theme-muted">No courses found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-theme hover:bg-theme-hover transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            course.thumbnail?.replace("http://", "https://") ||
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80"
                          }
                          alt={course.title}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />

                        <div>
                          <h3 className="font-semibold text-lg">
                            {course.title}
                          </h3>
                          <p className="text-sm text-theme-muted">
                            {course.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">{course.instructor}</td>

                    <td className="px-6 py-4">{course.duration}</td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/30">
                        {course.level}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-2 rounded-xl hover:bg-blue-500/10 text-blue-500 transition-colors"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-theme rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-theme shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-theme">
              <h2 className="text-2xl font-bold">
                {editingCourse ? "Edit Course" : "Create Course"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-theme-hover transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium mb-2">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Java"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Instructor</label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Name"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Weeks"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Description</label>
                <textarea
                  rows="5"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe the course..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-2xl border border-theme hover:bg-theme-hover transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary px-6 py-3 rounded-2xl flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourses;
