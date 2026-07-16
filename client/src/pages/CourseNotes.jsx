import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import NoteCard from "../components/notes/NoteCard";

import {
  LoaderCircle,
  NotepadTextDashed,
} from "lucide-react";

function CourseNotes() {

  const { id } = useParams();

  const [note, setNote] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchNote() {

      try {

        const q = query(
          collection(db, "notes"),
          where("courseId", "==", id)
        );

        const snapshot =
          await getDocs(q);

        if (!snapshot.empty) {

          setNote({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          });

        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    }

    fetchNote();

  }, [id]);

  if (loading) {

    return (

      <div className="flex justify-center py-24">

        <LoaderCircle
          className="animate-spin"
        />

      </div>

    );

  }

  if (!note) {

    return (

      <div className="card-theme rounded-2xl p-16 text-center">

        <NotepadTextDashed
          size={60}
          className="mx-auto mb-5"
        />

        <h2 className="text-2xl font-bold">

          Notes not uploaded yet

        </h2>

      </div>

    );

  }

  return <NoteCard note={note} />;

}

export default CourseNotes;