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
  Info,
  User,
  Star,
  Book,
} from "lucide-react";

function CourseDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {

    async function fetchLessons() {
      try {

        const courseRef = doc(db, "courses", id);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourse({
            id: courseSnap.id,
            ...courseSnap.data(),
          });
        }
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

        // No lessons found
        if (lessonList.length === 0) {
          return;
        }

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
        // User not enrolled yet
        if (!enrollmentSnap.exists()) {
          setSelectedLesson(lessonList[0]);
          return;
        }
        const enrollmentData = enrollmentSnap.data();
        setEnrollment(enrollmentData);
        // Resume from last lesson if available,
        // otherwise continue from the first unfinished lesson.
        if (enrollmentData.lastLesson) {
          const lastLesson = lessonList.find(
            lesson => lesson.id === enrollmentData.lastLesson
          );
          setSelectedLesson(
            lastLesson || lessonList[0]
          );
        } else {
          const firstUnfinishedLesson = lessonList.find(
            lesson =>
              !enrollmentData.completedLessons?.includes(lesson.id)
          );
          setSelectedLesson(
            firstUnfinishedLesson || lessonList[0]
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course.");
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
          lastAccessedAt: serverTimestamp(),
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
          lastAccessedAt: serverTimestamp(),
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
        completedLessons: updatedCompletedLessons,
        progress,
        lastLesson: selectedLesson.id,
        lastAccessedAt: serverTimestamp(),
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

          <div className="mt-2 flex items-center gap-2 relative">
            <p className="text-theme-muted">
              Course :
              <span className="font-semibold text-theme ml-1">
                {course?.title}
              </span>
            </p>
            <button
              onClick={() => setShowInfo(!showInfo)}
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              className="text-theme-muted hover:text-blue-600 transition cursor-pointer"
            >
              <Info size={18} />
            </button>
            {showInfo && (
              <div
                className="
                  absolute
                  top-8
                  left-20
                  z-20
                  w-72
                  rounded-xl
                  card-theme
                  border
                  border-theme
                  shadow-xl
                  p-4
                "
              >
                <h3 className="font-bold text-theme mb-2">
                  {course?.title}
                </h3>
                <p className="text-sm text-theme-muted mb-3">
                  {course?.description}
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex gap-2">
                    <User /> <strong>Instructor:</strong> {course?.instructor}
                  </p>
                  <p className="flex gap-2">
                    <Star /> <strong>{course?.rating}</strong>/5
                  </p>
                  <p className="flex gap-2">
                    <Book /> <strong>{lessons.length}</strong> Lessons
                  </p>
                </div>
              </div>
            )}

          </div>

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