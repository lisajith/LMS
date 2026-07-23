import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Clock3,
  CheckCircle2,
} from "lucide-react";

function getTimerKey(userId, testId) {
  return `test_timer_${userId}_${testId}`;
}

function TestAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const warningCount = useRef(0);
  const lastViolationTime = useRef(0);
  const latestAnswersRef = useRef({});

  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    async function initializeTest() {
      if (!user) return;
      // Verify student is enrolled in this course
      const enrollmentQuery = query(
        collection(db, "enrollments"),
        where("userId", "==", user.uid)
      );

      const enrollmentSnap = await getDocs(enrollmentQuery);

      const enrolledCourseIds = enrollmentSnap.docs.map(
        (doc) => doc.data().courseId
      );

      try {
        // 1. Check if already submitted
        const submissionRef = doc(db, "testSubmissions", `${user.uid}_${id}`);

        const submissionSnap = await getDoc(submissionRef);

        if (submissionSnap.exists()) {
          navigate(`/dashboard/tests/result/${id}`, {
            replace: true,
          });
          return;
        }

        // 2. Fetch test
        const testRef = doc(db, "tests", id);

        const testSnap = await getDoc(testRef);

        if (!testSnap.exists()) {
          setLoading(false);
          return;
        }

        const data = {
          id: testSnap.id,
          ...testSnap.data(),
        };

        setTest(data);

        if (data.isPublished !== true) {
          toast.error("This test is not available.");

          navigate("/dashboard/tests", { replace: true });

          return;
        }

        if (!enrolledCourseIds.includes(data.courseId)) {
          toast.error("You are not enrolled in this course.");

          navigate("/dashboard/tests", { replace: true });

          return;
        }

        // 3. TIMER LOGIC
        const timerKey = getTimerKey(user.uid, id);

        const savedStart = localStorage.getItem(timerKey);

        let startTime;

        if (savedStart) {
          // Existing timer
          startTime = Number(savedStart);
        } else {
          // First time opening test
          startTime = Date.now();
          localStorage.setItem(timerKey, startTime.toString());
        }

        // Total duration in milliseconds
        const totalDurationMs = data.duration * 60 * 1000;

        // Time already spent
        const elapsedMs = Date.now() - startTime;

        // Remaining seconds
        const remainingSeconds = Math.max(
          0,
          Math.floor((totalDurationMs - elapsedMs) / 1000)
        );

        setTimeLeft(remainingSeconds);

        // If time already finished during refresh
        if (remainingSeconds <= 0) {
          await submitTest();
          return;
        }
      } catch (err) {
        console.error("Test Init Error:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeTest();
  }, [id, user, navigate]);

  useEffect(() => {
    if (!test || loading) return;

    if (timeLeft <= 0) {
      submitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // Auto submit when timer reaches 0
          submitTest();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, loading, timeLeft]);

  async function submitTest() {
    if (!user || !test) return;

    let obtainedMarks = 0;
    let correctQuestions = 0;
    const finalAnswers = latestAnswersRef.current;

    test.questions.forEach((question, index) => {
      const marks = Number(question.marks || 1);

      if (finalAnswers[index] === question.answer) {
        obtainedMarks += marks;
        correctQuestions++;
      }
    });

    try {
      await setDoc(doc(db, "testSubmissions", `${user.uid}_${test.id}`), {
        studentId: user.uid,
        studentName: userData?.name || user.displayName,
        testId: test.id,
        answers: finalAnswers,
        score: correctQuestions,
        obtainedMarks,
        totalQuestions: test.questions.length,
        totalMarks: test.questions.reduce(
          (sum, q) => sum + Number(q.marks || 1),
          0
        ),
        submittedAt: serverTimestamp(),
        status: "Completed",
      });

      // Remove saved timer
      localStorage.removeItem(getTimerKey(user.uid, test.id));

      navigate(`/dashboard/tests/result/${test.id}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  }

  function nextQuestion() {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  function clearResponse() {
    const updated = { ...answers };

    delete updated[currentQuestion];

    setAnswers(updated);
  }

  function handleViolation(reason) {
    const now = Date.now();

    // Ignore violations within 3 seconds
    if (now - lastViolationTime.current < 3000) return;

    lastViolationTime.current = now;

    warningCount.current += 1;

    const remaining = 3 - warningCount.current;

    if (warningCount.current < 3) {
      toast.error(
        `${reason}. ${remaining} warning${remaining > 1 ? "s" : ""} remaining.`,
        { duration: 4000 }
      );
    } else {
      toast.error(
        "Exam terminated due to repeated security violations. Your answers have been submitted automatically.",
        { duration: 5000 }
      );

      submitTest();
    }
  }

  // TAB SWITCH DETECTION
  useEffect(() => {
    if (!test) return;

    function handleVisibility() {
      if (document.hidden) {
        handleViolation("Tab switch detected");
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [test]);

  // BACK BUTTON DETECTION
  useEffect(() => {
    if (!test) return;

    window.history.pushState(null, "", window.location.href);

    function handlePopState() {
      window.history.pushState(null, "", window.location.href);

      handleViolation("Back navigation blocked");
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [test]);

  // REFRESH / CLOSE WARNING
  useEffect(() => {
    if (!test) return;

    function handleBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = "Your test is in progress. Leaving may submit the test.";
      return e.returnValue;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [test]);

  // FULLSCREEN EXIT DETECTION
  useEffect(() => {
    if (!test) return;

    function handleFullscreenExit() {
      if (!document.fullscreenElement) {
        handleViolation("Exited fullscreen mode");
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenExit);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [test]);

  // SAFE TO RETURN AFTER ALL HOOKS
  if (loading) {
    return <div className="text-center py-32">Loading Test...</div>;
  }

  if (!test) {
    return <div className="text-center py-32">Test Not Found</div>;
  }

  const question = test.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Premium Header */}

      <div className="card-theme rounded-3xl p-8 shadow-xl border border-theme">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold">{test.title}</h1>

            <p className="text-theme-muted mt-3 text-lg">
              Question {currentQuestion + 1} of {test.questions.length}
            </p>
          </div>

          {/* Timer Card */}

          <div className="primary-soft primary-border border rounded-2xl px-6 py-4 min-w-45">
            <div className="flex items-center justify-center gap-3">
              <Clock3 className="primary-text" size={28} />

              <div className="text-center">
                <p className="text-sm text-theme-muted">Time Left</p>

                <h2 className="text-3xl font-bold text-red-500 tracking-wider">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="surface-secondary rounded-2xl p-5 text-center">
            <p className="text-sm text-theme-muted">Answered</p>

            <h3 className="text-3xl font-bold text-green-500 mt-2">
              {answeredCount}
            </h3>
          </div>

          <div className="surface-secondary rounded-2xl p-5 text-center">
            <p className="text-sm text-theme-muted">Remaining</p>

            <h3 className="text-3xl font-bold text-orange-500 mt-2">
              {test.questions.length - answeredCount}
            </h3>
          </div>

          <div className="surface-secondary rounded-2xl p-5 text-center">
            <p className="text-sm text-theme-muted">Total Questions</p>

            <h3 className="text-3xl font-bold primary-text mt-2">
              {test.questions.length}
            </h3>
          </div>
        </div>

        {/* Progress Bar */}

        <div className="mt-8">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-theme-muted">
              Test Progress
            </span>

            <span className="text-sm font-bold primary-text">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-3 surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question Palette */}

      <div className="card-theme rounded-3xl p-6 shadow-lg border border-theme">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Question Navigator</h2>

          <p className="text-sm text-theme-muted">
            Click any number to jump directly
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {test.questions.map((q, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`

              w-12

              h-12

              rounded-xl

              font-bold

              transition-all

              duration-300

              border

              flex

              items-center

              justify-center

              ${
                currentQuestion === index
                  ? "bg-blue-600 text-white border-blue-600 scale-110 shadow-lg shadow-blue-500/30"
                  : answers[index]
                    ? "bg-green-500 text-white border-green-500 shadow-md"
                    : "card-theme border-theme hover:border-blue-500 hover:scale-105"
              }

            `}
            >
              {answers[index] ? (
                <CheckCircle2 size={20} className="mx-auto" />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>

        {/* Palette Legend */}

        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-theme text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600" />

            <span className="text-theme-muted">Current</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />

            <span className="text-theme-muted">Answered</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-theme card-theme" />

            <span className="text-theme-muted">Not Answered</span>
          </div>
        </div>
      </div>

      {/* Question Card */}

      <div className="card-theme rounded-3xl shadow-xl p-10 border border-theme">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold primary-text mb-2">
              QUESTION {currentQuestion + 1}
            </p>

            <h2 className="text-2xl font-bold leading-10">
              {question.question}
            </h2>
          </div>

          <div className="surface-secondary rounded-xl px-4 py-2 text-center min-w-22.5">
            <p className="text-xs text-theme-muted">Marks</p>

            <p className="text-xl font-bold primary-text">
              {question.marks || 1}
            </p>
          </div>
        </div>

        {/* Options Start */}

        <div className="space-y-5">
          {question.options.map((option, index) => (
            <div
              key={index}
              onClick={() =>
                setAnswers({
                  ...answers,

                  [currentQuestion]: option,
                })
              }
              className={`

              cursor-pointer

              rounded-2xl

              border-2

              transition-all

              duration-300

              p-5

              flex

              items-center

              gap-5

              hover:border-blue-500

              hover:shadow-lg

              ${
                answers[currentQuestion] === option
                  ? "border-blue-600 bg-linear-to-r from-blue-500/10 to-blue-600/10 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20"
                  : "border-theme hover:bg-theme-hover hover:border-blue-400"
              }

            `}
            >
              {" "}
              {/* Custom Radio */}
              <div
                className={`

                w-7

                h-7

                rounded-full

                border-[3px]

                flex

                items-center

                justify-center

                transition-all

                shrink-0

                ${
                  answers[currentQuestion] === option
                    ? "border-blue-600 bg-white dark:bg-gray-900"
                    : "border-gray-400 dark:border-gray-500"
                }

              `}
              >
                {answers[currentQuestion] === option && (
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                )}
              </div>
              {/* Option Text */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                      transition-all
                      duration-300
                      ${
                        answers[currentQuestion] === option
                          ? "bg-blue-600 text-white shadow-md"
                          : "primary-soft primary-text border border-theme"
                      }

                    `}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="text-lg font-medium text-theme leading-relaxed">
                    {option}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}

        <div className="flex flex-col lg:flex-row justify-between items-center mt-10 pt-8 border-t border-theme gap-5">
          <button
            onClick={clearResponse}
            disabled={!answers[currentQuestion]}
            className="

            flex

            items-center

            gap-2

            px-5

            py-3

            rounded-xl

            border

            border-red-400

            text-red-500

            hover:bg-red-500/10

            disabled:opacity-40

            disabled:cursor-not-allowed

            transition-all

            duration-300

          "
          >
            <Trash2 size={18} />
            Clear Response
          </button>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="

              btn-primary

              px-6

              py-3

              rounded-xl

              flex

              items-center

              gap-2

              disabled:opacity-40

              disabled:cursor-not-allowed

            "
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {currentQuestion === test.questions.length - 1 ? (
              <button
                onClick={submitTest}
                className="

                btn-primary

                px-8

                py-3

                rounded-xl

                flex

                items-center

                gap-2

                shadow-lg

                shadow-blue-500/20

              "
              >
                <CheckCircle2 size={20} />
                Submit Test
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="
                btn-primary
                px-8
                py-3
                rounded-xl
                flex
                items-center
                gap-2
              "
              >
                Next
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestAttempt;
