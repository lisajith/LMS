import {
  BookOpen,
  Check,
  Lock,
  Award,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function LessonSidebar({
  lessons,
  selectedLesson,
  setSelectedLesson,
  completedLessons = [],
  certificateUnlocked = false,
  courseId,
}) {

  const navigate = useNavigate();

  return (
    <div className="card-theme rounded-2xl shadow-md p-6 h-fit transition-all duration-500">

      {/* Header */}

      <div className="flex items-center gap-3 mb-8">
        <BookOpen
          size={28}
          className="primary-text"
        />

        <h2 className="text-2xl font-bold text-theme">
          Course Content
        </h2>
      </div>

      <div className="space-y-2">

        {lessons.map((lesson, index) => {

          const completed =
            completedLessons.includes(lesson.id);

          const current =
            selectedLesson?.id === lesson.id;

          return (

            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="flex gap-4 cursor-pointer group"
            >

              {/* Timeline */}

              <div className="flex flex-col items-center">

                <div
                  className={`
                    w-7
                    h-7
                    rounded-full
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300

                    ${
                      completed
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : current
                        ? "border-2 border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600"
                        : "border-2 border-theme text-theme-muted"
                    }
                  `}
                >

                  {completed ? (
                    <Check
                      size={15}
                      strokeWidth={3}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  )}

                </div>

                {index !== lessons.length - 1 && (

                  <div
                    className={`
                      w-0.5
                      flex-1
                      mt-2
                      transition-colors

                      ${
                        completed
                          ? "bg-green-500"
                          : "bg-theme-muted/30"
                      }
                    `}
                  />

                )}

              </div>

              {/* Lesson */}

              <div
                className={`
                  pb-8
                  transition

                  ${
                    current
                      ? "text-blue-600 font-semibold"
                      : "text-theme group-hover:text-blue-600"
                  }
                `}
              >

                {lesson.title}

              </div>

            </div>

          );

        })}

        {/* Certificate */}

        <div className="border-t border-theme mt-4 pt-6">

          <button
            disabled={!certificateUnlocked}
            onClick={() =>
              navigate(
                `/dashboard/certificate/${courseId}`
              )
            }
            className={`
              w-full
              flex
              items-center
              gap-3
              p-4
              rounded-xl
              transition-all
              duration-300

              ${
                certificateUnlocked
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-[1.02]"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }
            `}
          >

            {certificateUnlocked ? (
              <Award size={20} />
            ) : (
              <Lock size={20} />
            )}

            <div className="flex flex-col items-start">

              <span className="font-semibold">
                Certificate
              </span>

              <span className="text-xs opacity-80">

                {certificateUnlocked
                  ? "Unlocked"
                  : "Locked"}

              </span>

            </div>

          </button>

        </div>

      </div>

    </div>
  );
}

export default LessonSidebar;