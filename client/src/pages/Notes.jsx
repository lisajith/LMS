import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import NoteCard from "../components/notes/NoteCard";

import {
  Search,
  LoaderCircle,
  LucideNotebookPen,
  NotepadTextDashed,
} from "lucide-react";

function Notes() {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {

    async function fetchNotes() {

      try {

        const q = query(
          collection(db, "notes"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        console.log(snapshot.docs);

        const notesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(notesList);

        setNotes(notesList);

      } catch (error) {
        console.error("Error loading notes:", error);
      } finally {
        setLoading(false);
      }

    }

    fetchNotes();

  }, []);

  const filteredNotes = notes.filter((note) => {

    const keyword = search.toLowerCase();

    return (
      note.title?.toLowerCase().includes(keyword) ||
      note.courseName?.toLowerCase().includes(keyword) ||
      note.lessonTitle?.toLowerCase().includes(keyword)
    );

  });

  if (loading) {

    return (

      <div className="flex justify-center items-center py-32 gap-3">

        <LoaderCircle
          className="animate-spin primary-text"
          size={28}
        />

        <p className="text-theme-muted">
          Loading Notes...
        </p>

      </div>

    );

  }

  return (

    <div>

      <div className="flex items-center gap-3 mb-8">

        <LucideNotebookPen
          size={34}
          className="primary-text"
        />

        <h1 className="text-4xl font-bold">
            Notes
        </h1>

      </div>

      {/* Search */}

      <div className="relative mb-8">

        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
        />

        <input
          type="text"
          placeholder="Search notes by title, course or lesson..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-theme bg-theme text-theme outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Empty */}

      {filteredNotes.length === 0 ? (

        <div className="card-theme rounded-2xl p-16 text-center">

          <NotepadTextDashed
            size={55}
            className="mx-auto mb-5 text-theme-muted"
          />

          <h2 className="text-2xl font-bold mb-2">
            No Notes Found
          </h2>

          <p className="text-theme-muted">
            Try another search keyword.
          </p>

        </div>

      ) : (

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredNotes.map((note) => (

            <NoteCard
              key={note.id}
              note={note}
            />

          ))}

        </div>

      )}

    </div>

  );

}

export default Notes;