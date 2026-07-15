import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function CourseCard({
  id,
  title,
  instructor,
  progress,
  lessons,
  rating,
  thumbnail,
  showProgress = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkEnrollment() {
      if (!user) {
        setEnrolled(false);
        return;
      }

      const enrollmentRef = doc(
        db,
        "enrollments",
        `${user.uid}_${id}`
      );

      const enrollmentSnap = await getDoc(enrollmentRef);

      setEnrolled(enrollmentSnap.exists());
    }

    checkEnrollment();
  }, [user, id]);

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
      });

      setEnrolled(true);
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
                style={{ width: `${progress}%` }}
              ></div>

            </div>

            <p className="mt-2 text-sm font-medium text-theme-muted">
              {progress}% Completed
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-theme-muted">
            {enrolled
              ? "Continue your learning"
              : "Not enrolled yet"}
          </p>
        )}

        <div className="flex justify-between mt-5 text-sm text-theme-muted">

          <span>⭐ {rating}</span>

          <span>📚 {lessons} Lessons</span>

        </div>

        <button
          disabled={loading}
          onClick={() => {
            if (enrolled) {
              navigate(`/dashboard/course/${id}`);
            } else {
              handleEnroll();
            }
          }}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading
            ? "Enrolling..."
            : enrolled
            ? progress === 0
              ? "Start Learning →"
              : progress === 100
              ? "Review Course →"
              : "Continue Learning →"
            : "Enroll Now"}
        </button>

      </div>

    </div>
  );
}

export default CourseCard;2