import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import LessonSidebar from "../components/course/LessonSidebar";
import { useAuth } from "../context/AuthContext";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import { toast } from "react-toastify";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

function CourseDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [lessons, setLessons] = useState([]);

  const [selectedLesson, setSelectedLesson] = useState(null);

  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {

    async function fetchLessons() {

      const q = query(
        collection(db, "lessons"),
        where("courseId", "==", id),
        orderBy("order")
      );

      const snapshot = await getDocs(q);

      const lessonList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLessons(lessonList);

      if (!user) {
        setSelectedLesson(lessonList[0]);
        return;
      }

      const enrollmentRef = doc(
        db,
        "enrollments",
        `${user.uid}_${id}`
      );

      const enrollmentSnap = await getDoc(enrollmentRef);

      if (!enrollmentSnap.exists()) {
        setSelectedLesson(lessonList[0]);
        return;
      }

      const enrollmentData = enrollmentSnap.data();

      setEnrollment(enrollmentData);

      if (enrollmentData.lastLesson) {

        const lastLesson = lessonList.find(
          lesson => lesson.id === enrollmentData.lastLesson
        );

        setSelectedLesson(
          lastLesson || lessonList[0]
        );

      } else {

        setSelectedLesson(
          lessonList[0]
        );

      }

    }

    fetchLessons();

  }, [id, user]);

  const currentIndex = selectedLesson
    ? lessons.findIndex(
        lesson => lesson.id === selectedLesson.id
      )
    : -1;

  const isCompleted =
    selectedLesson &&
    enrollment?.completedLessons?.includes(
      selectedLesson.id
    );

  const isLastLesson =
    currentIndex === lessons.length - 1;

  async function handlePrevious() {

    if (currentIndex <= 0) return;

    const previousLesson =
      lessons[currentIndex - 1];

    setSelectedLesson(previousLesson);

    if (user) {

      await updateDoc(
        doc(
          db,
          "enrollments",
          `${user.uid}_${id}`
        ),
        {
          lastLesson: previousLesson.id,
        }
      );

    }

  }

  async function handleNext() {

    if (currentIndex >= lessons.length - 1)
      return;

    const nextLesson =
      lessons[currentIndex + 1];

    setSelectedLesson(nextLesson);

    if (user) {

      await updateDoc(
        doc(
          db,
          "enrollments",
          `${user.uid}_${id}`
        ),
        {
          lastLesson: nextLesson.id,
        }
      );

    }

  }

  async function handleCompleteLesson() {

    if (
      !user ||
      !selectedLesson ||
      !enrollment
    )
      return;

    if (
      enrollment.completedLessons.includes(
        selectedLesson.id
      )
    )
      return;

    const updatedCompletedLessons = [
      ...enrollment.completedLessons,
      selectedLesson.id,
    ];

    const progress = Math.round(
      (updatedCompletedLessons.length /
        lessons.length) *
        100
    );

    await updateDoc(
      doc(
        db,
        "enrollments",
        `${user.uid}_${id}`
      ),
      {
        completedLessons:
          updatedCompletedLessons,
        progress,
        lastLesson: selectedLesson.id,
      }
    );

    setEnrollment(prev => ({
      ...prev,
      completedLessons:
        updatedCompletedLessons,
      progress,
      lastLesson: selectedLesson.id,
    }));

    toast.success("Lesson Completed");

    if (!isLastLesson) {

      setSelectedLesson(
        lessons[currentIndex + 1]
      );

    }

  }

  if (!selectedLesson) {

    return (

      <div className="p-10">

        <div className="flex justify-center items-center gap-3 py-20">

          <LoaderCircle
            size={30}
            className="animate-spin primary-text"
          />

          <p className="text-theme-muted">
            Loading lessons...
          </p>

        </div>

      </div>

    );

  }
    return (

    <div className="grid lg:grid-cols-4 gap-8">

      {/* Sidebar */}

      <LessonSidebar
        lessons={lessons}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
        completedLessons={
          enrollment?.completedLessons || []
        }
        certificateUnlocked={
          enrollment?.certificateUnlocked || false
        }
        courseId={id}
        courseName={
          selectedLesson?.courseName ||
          enrollment?.courseName ||
          "Course"
        }
      />

      {/* Lesson Content */}

      <div className="lg:col-span-3">

        <div className="card-theme rounded-2xl shadow-md p-8">

          <h1 className="text-3xl font-bold">
            {selectedLesson.title}
          </h1>

          <p className="text-theme-muted mt-2">
            Course :
            <span className="font-medium">
              {" "}
              {id}
            </span>
          </p>

          <iframe
            src={selectedLesson.video}
            title={selectedLesson.title}
            allowFullScreen
            className="w-full aspect-video rounded-xl mt-6"
          />

          {/* Complete Lesson */}

          <button
            onClick={handleCompleteLesson}
            disabled={isCompleted}
            className={`transition mt-4 px-3 py-2 rounded-lg border

            ${
              isCompleted
                ? "border-green-600 text-green-700"
                : "border-gray-300 text-theme-muted hover:border-blue-500 hover:text-blue-600"
            }

            `}
          >

            {isCompleted ? (

              <>
                <CheckCircle2
                  size={18}
                  className="inline mr-2"
                />

                Completed

              </>

            ) : (

              <>
                Complete Lesson
              </>

            )}

          </button>

          {/* Navigation */}

          <div className="mt-10 flex justify-between">

            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl card-theme hover-theme disabled:opacity-50"
            >

              <ChevronLeft size={18} />

              Previous Lesson

            </button>

            <button

              onClick={async () => {

                if (
                  isLastLesson &&
                  enrollment?.completedLessons?.includes(
                    selectedLesson.id
                  )
                ) {

                  await updateDoc(
                    doc(
                      db,
                      "enrollments",
                      `${user.uid}_${id}`
                    ),
                    {

                      completed: true,

                      certificateUnlocked: true,

                      completedAt: serverTimestamp(),

                    }
                  );

                  setEnrollment((prev) => ({

                    ...prev,

                    completed: true,

                    certificateUnlocked: true,

                  }));

                  toast.success(
                    "🎉 Congratulations! Course Completed!"
                  );

                  navigate(
                    `/dashboard/certificate/${id}`
                  );

                  return;

                }

                handleNext();

              }}

              disabled={
                currentIndex === lessons.length - 1 &&
                !(
                  isLastLesson &&
                  enrollment?.completedLessons?.includes(
                    selectedLesson.id
                  )
                )
              }

              className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary disabled:opacity-50"

            >

              {isLastLesson &&
              enrollment?.completedLessons?.includes(
                selectedLesson.id
              ) ? (

                <>
                  🏆 Complete Course
                </>

              ) : (

                <>

                  Next Lesson

                  <ChevronRight size={18} />

                </>

              )}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default CourseDetails;