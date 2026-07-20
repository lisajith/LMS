import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { db } from "../firebase/firebase";

import NoteCard from "../components/notes/NoteCard";

import {
  LoaderCircle,
  NotebookPen,
  NotepadTextDashed,
  Search,
} from "lucide-react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    async function fetchNotes() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get enrolled courses
        const enrollmentQuery = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );

        const enrollmentSnapshot = await getDocs(enrollmentQuery);

        const enrolledCourseIds = enrollmentSnapshot.docs.map(
          (doc) => doc.data().courseId
        );

        if (enrolledCourseIds.length === 0) {
          setNotes([]);
          setLoading(false);
          return;
        }

        // Get all notes
        // Get lessons that contain notes
        const lessonsQuery = query(
          collection(db, "lessons"),
          orderBy("updatedAt", "desc")
        );

        const lessonsSnapshot = await getDocs(lessonsQuery);

        const notesList = lessonsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (lesson) =>
              enrolledCourseIds.includes(lesson.courseId) && lesson.notesUrl
          );

        setNotes(notesList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [user]);

  const filteredNotes = notes.filter((note) => {
    const keyword = search.toLowerCase();

    return note.title?.toLowerCase().includes(keyword);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 gap-3">
        <LoaderCircle size={28} className="animate-spin primary-text" />

        <p className="text-theme-muted">Loading Notes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <NotebookPen size={34} className="primary-text" />

        <h1 className="text-4xl font-bold">Course Materials</h1>
      </div>

      <div className="relative mb-8">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
        />

        <input
          type="text"
          placeholder="Search by course, instructor or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-theme bg-theme text-theme outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="card-theme rounded-2xl p-16 text-center">
          <NotepadTextDashed
            size={55}
            className="mx-auto mb-5 text-theme-muted"
          />

          <h2 className="text-2xl font-bold mb-2">No Course Materials Found</h2>

          <p className="text-theme-muted">Try another search keyword.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} showCourseLink={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
