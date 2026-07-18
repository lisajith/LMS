import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function TestAttempt() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user, userData } = useAuth();

  const [test, setTest] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {

    async function fetchTest() {

      try {

        const ref = doc(
          db,
          "tests",
          id
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {

          const data = {

            id: snap.id,

            ...snap.data(),

          };

          setTest(data);

          setTimeLeft(data.duration * 60);

        }

      }

      catch (err) {

        console.error(err);

      }

    }

    fetchTest();

  }, [id]);

  useEffect(() => {

    if (!test) return;

    if (timeLeft <= 0) {

      submitTest();

      return;

    }

    const timer = setInterval(() => {

      setTimeLeft(prev => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft, test]);

  async function submitTest() {

    if (!test || !user) return;

    let score = 0;

    test.questions.forEach((question, index) => {

        if (answers[index] === question.answer) {

        score += question.marks || 1;

        }

    });

    try {

        await setDoc(

        doc(
            db,
            "testSubmissions",
            `${user.uid}_${test.id}`
        ),

        {

            studentId: user.uid,

            studentName:
            userData?.name ||
            user.displayName,

            testId: test.id,

            answers,

            score,

            obtainedMarks: score,

            totalQuestions: test.questions.length,

            totalMarks: test.questions.reduce(

            (total, q) => total + (q.marks || 1),

            0

            ),

            submittedAt: serverTimestamp(),

            status: "Completed",

        }

        );

        navigate(`/dashboard/tests/result/${test.id}`);

    }

    catch (error) {

        console.error("Submission Error:", error);

    }

    }

  function nextQuestion() {

    if (

      currentQuestion <

      test.questions.length - 1

    ) {

      setCurrentQuestion(

        currentQuestion + 1

      );

    }

  }

  function previousQuestion() {

    if (currentQuestion > 0) {

      setCurrentQuestion(

        currentQuestion - 1

      );

    }

  }

  if (!test) {

    return (

      <div className="text-center py-24">

        Loading Test...

      </div>

    );

  }

  const question =
    test.questions[currentQuestion];

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

return (

  <div className="max-w-5xl mx-auto space-y-8">

    {/* Header */}

    <div className="card-theme rounded-2xl p-8">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">

            {test.title}

          </h1>

          <p className="mt-2 text-theme-muted">

            Question {currentQuestion + 1} of {test.questions.length}

          </p>

        </div>

        <div className="text-right">

          <p className="text-theme-muted">

            Time Left

          </p>

          <h2 className="text-3xl font-bold text-red-500">

            {String(minutes).padStart(2, "0")}:

            {String(seconds).padStart(2, "0")}

          </h2>

        </div>

      </div>

    </div>

    {/* Question Navigator */}

    <div className="flex flex-wrap gap-3">

      {test.questions.map((_, index) => (

        <button

          key={index}

          onClick={() => setCurrentQuestion(index)}

          className={`

            w-10

            h-10

            rounded-full

            font-bold

            transition

            ${

              currentQuestion === index

                ? "bg-blue-600 text-white"

                : answers[index]

                ? "bg-green-500 text-white"

                : "bg-gray-200 text-black"

            }

          `}

        >

          {index + 1}

        </button>

      ))}

    </div>

    {/* Question */}

    <div className="card-theme rounded-2xl p-8">

      <h2 className="text-2xl font-bold mb-8">

        {question.question}

      </h2>

      <div className="space-y-4">

        {question.options.map((option, index) => (

          <label

            key={index}

            className="

              flex

              items-center

              gap-4

              border

              border-theme

              rounded-xl

              p-4

              cursor-pointer

              hover:bg-theme-hover

            "

          >

            <input

              type="radio"

              name="answer"

              checked={answers[currentQuestion] === option}

              onChange={() =>

                setAnswers({

                  ...answers,

                  [currentQuestion]: option,

                })

              }

            />

            <span>

              {option}

            </span>

          </label>

        ))}

      </div>

    </div>

        {/* Navigation */}

    <div className="flex justify-between">

      <button

        onClick={previousQuestion}

        disabled={currentQuestion === 0}

        className="btn-primary px-6 py-3 rounded-xl disabled:opacity-50"

      >

        Previous

      </button>

      {currentQuestion === test.questions.length - 1 ? (

        <button

          onClick={submitTest}

          className="btn-primary px-8 py-3 rounded-xl"

        >

          Submit Test

        </button>

      ) : (

        <button

          onClick={nextQuestion}

          className="btn-primary px-6 py-3 rounded-xl"

        >

          Next

        </button>

      )}

    </div>

  </div>

);

}

export default TestAttempt;