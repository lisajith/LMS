import { useEffect, useState } from "react";
import {
collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc,
query,
where,
serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import {
Plus,
Edit,
Trash2,
PlayCircle,
FileText,
Save,
X,
} from "lucide-react";

function AdminLessons() {
const [courses, setCourses] = useState([]);
const [selectedCourse, setSelectedCourse] = useState("");
const [lessons, setLessons] = useState([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [editingLesson, setEditingLesson] = useState(null);

const [formData, setFormData] = useState({
title: "",
videoUrl: "",
notesUrl: "",
order: 1,
duration: "",
isPublished: true,
});

useEffect(() => {
fetchCourses();
}, []);

useEffect(() => {
if (selectedCourse) {
fetchLessons(selectedCourse);
} else {
setLessons([]);
}
}, [selectedCourse]);

async function fetchCourses() {
try {
const snapshot = await getDocs(collection(db, "courses"));


  const data = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));

  setCourses(data);

  // Auto select first course
  if (data.length > 0) {
    setSelectedCourse(data[0].id);
  }
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}


}

async function fetchLessons(courseId) {
try {
const snapshot = await getDocs(
query(collection(db, "lessons"), where("courseId", "==", courseId))
);


  const data = snapshot.docs
    .map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }))
    .sort((a, b) => a.order - b.order);

  setLessons(data);
} catch (error) {
  console.error(error);
}


}

function openCreateModal() {
setEditingLesson(null);


setFormData({
  title: "",
  videoUrl: "",
  notesUrl: "",
  order: lessons.length + 1,
  duration: "",
  isPublished: true,
});

setShowModal(true);


}

function openEditModal(lesson) {
setEditingLesson(lesson);


setFormData({
  title: lesson.title || "",
  videoUrl: lesson.videoUrl || "",
  notesUrl: lesson.notesUrl || "",
  order: lesson.order || 1,
  duration: lesson.duration || "",
  isPublished: lesson.isPublished ?? true,
});

setShowModal(true);


}

async function updateCourseLessonCount(courseId) {
const snapshot = await getDocs(
query(collection(db, "lessons"), where("courseId", "==", courseId))
);


await updateDoc(doc(db, "courses", courseId), {
  lessonsCount: snapshot.size,
  updatedAt: serverTimestamp(),
});


}

async function handleSubmit(e) {
e.preventDefault();


if (!selectedCourse) {
  alert("Please select a course");
  return;
}

try {
  const payload = {
    courseId: selectedCourse,
    title: formData.title,
    videoUrl: formData.videoUrl,
    notesUrl: formData.notesUrl,
    order: Number(formData.order),
    duration: formData.duration,
    isPublished: formData.isPublished,
    updatedAt: serverTimestamp(),
  };

  if (editingLesson) {
    await updateDoc(doc(db, "lessons", editingLesson.id), payload);
  } else {
    await addDoc(collection(db, "lessons"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  }

  await updateCourseLessonCount(selectedCourse);

  setShowModal(false);
  fetchLessons(selectedCourse);
} catch (error) {
  console.error(error);
  alert("Failed to save lesson");
}


}

async function handleDelete(lessonId) {
const confirmed = window.confirm("Delete this lesson?");


if (!confirmed) return;

try {
  await deleteDoc(doc(db, "lessons", lessonId));

  await updateCourseLessonCount(selectedCourse);

  fetchLessons(selectedCourse);
} catch (error) {
  console.error(error);
  alert("Failed to delete lesson");
}


}

if (loading) {
return <div className="text-center py-24">Loading lessons...</div>;
}

return ( <div className="space-y-6">
{/* Header */} <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"> <div> <h1 className="text-4xl font-bold">Lesson Management</h1> <p className="text-theme-muted mt-2">
Create and organize course lessons </p> </div>


    <button
      onClick={openCreateModal}
      className="btn-primary px-5 py-3 rounded-2xl flex items-center gap-2"
    >
      <Plus size={20} />
      Add Lesson
    </button>
  </div>

  {/* Course Selector */}
  <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
    <label className="block font-medium mb-3">Select Course</label>

    <select
      value={selectedCourse}
      onChange={(e) => setSelectedCourse(e.target.value)}
      className="w-full max-w-md px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
    >
      {courses.map((course) => (
        <option key={course.id} value={course.id}>
          {course.title}
        </option>
      ))}
    </select>
  </div>

  {/* Lessons List */}
  <div className="space-y-4">
    {lessons.length === 0 ? (
      <div className="card-theme rounded-3xl p-12 text-center border border-theme">
        <PlayCircle className="mx-auto text-theme-muted mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2">No lessons yet</h2>
        <p className="text-theme-muted">
          Add your first lesson to this course.
        </p>
      </div>
    ) : (
      lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="card-theme rounded-3xl p-6 border border-theme shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <PlayCircle className="text-blue-500" size={28} />
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-bold">{lesson.title}</h3>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-600 border border-gray-500/30">
                    Lesson {lesson.order}
                  </span>

                  {lesson.isPublished ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/30">
                      Published
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-600 border border-yellow-500/30">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-theme-muted">
                  {lesson.duration && <span>⏱ {lesson.duration}</span>}

                  {lesson.videoUrl && (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:underline"
                    >
                      <PlayCircle size={16} />
                      Video
                    </a>
                  )}

                  {lesson.notesUrl && (
                    <a
                      href={lesson.notesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-500 hover:underline"
                    >
                      <FileText size={16} />
                      Notes
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-auto">
              <button
                onClick={() => openEditModal(lesson)}
                className="p-3 rounded-xl hover:bg-blue-500/10 text-blue-500 transition-colors"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => handleDelete(lesson.id)}
                className="p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-theme rounded-3xl w-full max-w-2xl border border-theme shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-theme">
          <h2 className="text-2xl font-bold">
            {editingLesson ? "Edit Lesson" : "Add Lesson"}
          </h2>

          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-xl hover:bg-theme-hover transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block font-medium mb-2">Lesson Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Introduction to Python"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Video URL</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData({ ...formData, videoUrl: e.target.value })
              }
              className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block font-medium mb-2">PDF Notes URL</label>
            <input
              type="url"
              value={formData.notesUrl}
              onChange={(e) =>
                setFormData({ ...formData, notesUrl: e.target.value })
              }
              className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://res.cloudinary.com/..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium mb-2">Order</label>
              <input
                type="number"
                min="1"
                required
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-theme bg-theme outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15 mins"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isPublished: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-theme text-blue-600 focus:ring-blue-500"
            />

            <span className="font-medium">Publish immediately</span>
          </label>

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
              {editingLesson ? "Update Lesson" : "Save Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>


);
}

export default AdminLessons;
