import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useState } from "react";

import {
  Book,
  Star,
} from "lucide-react";

function CourseCard({
  id,
  title,
  instructor,
  progress = 0,
  lessonCount = 0,
  rating,
  thumbnail,
  showProgress = false,
  enrolled = false,
  refreshCourses,
  myCourse = false,
}) {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  async function handleEnroll() {

    if (!user) {
      navigate("/login");
      return;
    }

    try {

      setLoading(true);

      const enrollmentRef = doc(
        db,
        "enrollments",
        `${user.uid}_${id}`
      );

      await setDoc(enrollmentRef, {
        userId: user.uid,
        courseId: id,
        enrolledAt: serverTimestamp(),
        progress: 0,
        completedLessons: [],
        lastLesson: null,
        completed: false,
        certificateUnlocked: false,
      });

      if (refreshCourses) {
        await refreshCourses();
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="card-theme rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1">

      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-contain"
      />

      <div className="p-6">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="text-slate-500 mt-1">
          by {instructor}
        </p>

        {showProgress ? (

          <>

            <div className="w-full h-3 bg-slate-200 rounded-full mt-5 overflow-hidden">

              <div
                className={`h-full transition-all duration-700 ease-out ${
                  progress === 100
                    ? "bg-green-500"
                    : "bg-blue-600"
                }`}
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-2 text-sm font-medium text-theme-muted">
              {progress}% Completed
            </p>

          </>

        ) : (

          <p className="mt-4 text-sm text-theme-muted">

            {myCourse
              ? "Continue your learning"
              : enrolled
              ? "Ready to start learning"
              : "Not enrolled yet"}

          </p>

        )}

        <div className="flex justify-between mt-5 text-sm text-theme-muted">

          <span className="flex items-center gap-2">

            <Star size={18} />

            {rating}

          </span>

          <span className="flex items-center gap-2">

            <Book size={18} />

            {lessonCount} Lessons

          </span>

        </div>

        <button

          disabled={loading}

          onClick={() => {

            if (myCourse || enrolled) {

              navigate(`/dashboard/course/${id}`);

            } else {

              handleEnroll();

            }

          }}

          className={`

            mt-6
            w-full
            py-3
            rounded-xl
            font-semibold
            transition

            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }

          `}

        >

          {loading ? (

            "Enrolling..."

          ) : myCourse ? (

            progress === 0
              ? "Start Learning →"
              : progress === 100
              ? "Review Course →"
              : "Continue Learning →"

          ) : enrolled ? (

            "Start Learning →"

          ) : (

            "Enroll Now"

          )}

        </button>

      </div>

    </div>

  );

}

export default CourseCard;