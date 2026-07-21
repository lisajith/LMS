import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { useState } from "react";

import { Book, Star } from "lucide-react";

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

      const enrollmentRef = doc(db, "enrollments", `${user.uid}_${id}`);

      await setDoc(enrollmentRef, {
        userId: user.uid,
        courseId: id,
        enrolledAt: serverTimestamp(),

        // progress
        progress: 0,
        completedLessons: [],
        lastLesson: null,

        // completion
        completed: false,
        certificateUnlocked: false,

        // admin course data snapshot
        courseTitle: title,
        instructor,
        lessonCount,
        rating,
        thumbnail,
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
    <div className="group relative overflow-hidden rounded-3xl border border-theme bg-theme shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-transparent dark:bg-linear-to-br dark:from-slate-800 dark:to-slate-900">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Book size={48} className="mx-auto mb-3 opacity-60" />
              <p className="text-sm font-medium">No Thumbnail</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1.5 shadow-lg border border-white/20">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {rating}
          </span>
        </div>

        {/* Status Badge */}
        {myCourse && (
          <div className="absolute top-4 left-4 rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-semibold shadow-lg">
            My Course
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="min-h-18">
          <h2 className="text-xl font-bold text-theme leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h2>

          <div className="text-theme-muted mt-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {instructor?.charAt(0)?.toUpperCase() || "I"}
            </div>

            <span>{instructor}</span>
          </div>
        </div>

        {/* Progress Section */}
        {showProgress ? (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-theme">Progress</span>

              <span
                className={`text-sm font-bold ${
                  progress === 100 ? "text-green-600" : "text-blue-600"
                }`}
              >
                {progress}%
              </span>
            </div>

            <div className="relative w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                  progress === 100
                    ? "bg-linear-to-r from-green-500 to-emerald-500"
                    : "bg-linear-to-r from-blue-500 to-indigo-600"
                }`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>

            <p className="mt-2 text-xs text-theme-muted">
              {progress === 100
                ? "🎉 Course completed successfully"
                : `${100 - progress}% remaining`}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-theme-secondary border border-theme p-3">
            <div className="text-sm text-theme-muted flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>

              <span>
                {myCourse
                  ? "Continue your learning journey"
                  : enrolled
                    ? "Ready to start learning"
                    : "Enroll to unlock this course"}
              </span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mt-6 py-4 border-y border-theme">
          <div className="flex items-center gap-2 text-theme-muted">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Book size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide">Lessons</p>
              <p className="font-bold text-theme">{lessonCount}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-theme-muted">
              Rating
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-theme">{rating}</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          disabled={loading}
          onClick={() => {
            if (myCourse || enrolled) {
              navigate(`/dashboard/course/${id}`);
            } else {
              handleEnroll();
            }
          }}
          className={`mt-6 w-full py-3.5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enrolling...
            </>
          ) : myCourse ? (
            progress === 0 ? (
              <>
                Start Learning
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            ) : progress === 100 ? (
              <>
                Review Course
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                Continue Learning
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )
          ) : enrolled ? (
            <>
              Start Learning
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          ) : (
            <>
              Enroll Now
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
