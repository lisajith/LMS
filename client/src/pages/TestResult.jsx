import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {

  doc,

  getDoc,

} from "firebase/firestore";

import {

  Trophy,

  CheckCircle2,

  XCircle,

  Award,

  Clock3,

  ArrowLeft,

} from "lucide-react";

import { db } from "../firebase/firebase";

function TestResult() {

  const { user } = useAuth();

  const { id } = useParams();

  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);

  const [test, setTest] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchResult() {

      if (!user) return;

      try {

        const submissionSnap = await getDoc(

          doc(

            db,

            "testSubmissions",

            `${user.uid}_${id}`

          )

        );

        if (submissionSnap.exists()) {

          setSubmission(submissionSnap.data());

        }

        const testSnap = await getDoc(

          doc(db, "tests", id)

        );

        if (testSnap.exists()) {

          setTest({

            id: testSnap.id,

            ...testSnap.data(),

          });

        }

      }

      catch (error) {

        console.error(error);

      }

      finally {

        setLoading(false);

      }

    }

    fetchResult();

  }, [id, user]);

  if (loading) {

    return (

      <div className="text-center py-32">

        Loading Result...

      </div>

    );

  }

  if (!submission || !test) {

    return (

      <div className="text-center py-32">

        Result Not Found

      </div>

    );

  }

  const percentage = Math.round(

    (submission.obtainedMarks /

      submission.totalMarks) * 100

  );

  const correct = submission.score;

  const wrong = submission.totalQuestions - submission.score;

  let grade = "F";

  let gradeColor = "text-red-500";

  if (percentage >= 90) {

    grade = "A+";

    gradeColor = "text-green-500";

  }

  else if (percentage >= 80) {

    grade = "A";

    gradeColor = "text-green-500";

  }

  else if (percentage >= 70) {

    grade = "B";

    gradeColor = "text-blue-500";

  }

  else if (percentage >= 60) {

    grade = "C";

    gradeColor = "text-yellow-500";

  }

  else if (percentage >= 50) {

    grade = "D";

    gradeColor = "text-orange-500";

  }
  return (

  <div className="max-w-7xl mx-auto space-y-8">

    {/* Top Bar */}

    <div className="flex justify-between items-center">

      <button

        onClick={()=>navigate("/dashboard/tests")}

        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-theme hover:bg-theme-hover transition"

      >

        <ArrowLeft size={18}/>

        Back to Tests

      </button>

      <div className="flex items-center gap-2 text-theme-muted">

        <Clock3 size={18}/>

        {submission.submittedAt?.toDate()?.toLocaleString()}

      </div>

    </div>

    {/* Hero Header */}

    <div className="card-theme rounded-3xl p-8 shadow-xl border border-theme overflow-hidden relative">

      <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"/>

      <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">

        <div className="flex-1 text-center lg:text-left">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full primary-soft primary-border border mb-4">

            <Trophy className="primary-text" size={18}/>

            <span className="text-sm font-semibold primary-text">

              Test Completed

            </span>

          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">

            {test.title}

          </h1>

          <p className="text-theme-muted mt-4 text-lg max-w-2xl">

            Your submission has been evaluated successfully. Review your performance and question-wise analysis below.

          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">

            <div className="surface-secondary rounded-xl px-4 py-3">

              <p className="text-xs text-theme-muted">Questions</p>

              <p className="text-xl font-bold">{submission.totalQuestions}</p>

            </div>

            <div className="surface-secondary rounded-xl px-4 py-3">

              <p className="text-xs text-theme-muted">Marks Earned</p>

              <p className="text-xl font-bold primary-text">{submission.obtainedMarks}</p>

            </div>

            <div className="surface-secondary rounded-xl px-4 py-3">

              <p className="text-xs text-theme-muted">Grade</p>

              <p className={`text-xl font-bold ${gradeColor}`}>{grade}</p>

            </div>

          </div>

        </div>

        {/* Circular Percentage Badge */}

        <div className="relative flex items-center justify-center">

          <div className="w-56 h-56 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-theme shadow-2xl">

            <div className="w-44 h-44 rounded-full bg-theme flex flex-col items-center justify-center shadow-inner border border-theme">

              <div className="text-5xl font-extrabold primary-text">

                {percentage}%

              </div>

              <div className="text-sm text-theme-muted mt-2 font-medium">

                Overall Score

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    {/* Performance Cards */}

    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      <div className="card-theme rounded-2xl p-6 border border-theme shadow-lg hover:shadow-xl transition-all duration-300">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-theme-muted">Obtained Marks</p>

            <h2 className="text-4xl font-bold primary-text mt-2">

              {submission.obtainedMarks}

            </h2>

            <p className="text-sm text-theme-muted mt-1">

              out of {submission.totalMarks}

            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl primary-soft flex items-center justify-center">

            <Award className="primary-text" size={28}/>

          </div>

        </div>

      </div>

      <div className="card-theme rounded-2xl p-6 border border-theme shadow-lg hover:shadow-xl transition-all duration-300">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-theme-muted">Correct Answers</p>

            <h2 className="text-4xl font-bold text-green-500 mt-2">

              {correct}

            </h2>

            <p className="text-sm text-theme-muted mt-1">

              answered correctly

            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">

            <CheckCircle2 className="text-green-500" size={28}/>

          </div>

        </div>

      </div>

      <div className="card-theme rounded-2xl p-6 border border-theme shadow-lg hover:shadow-xl transition-all duration-300">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-theme-muted">Wrong Answers</p>

            <h2 className="text-4xl font-bold text-red-500 mt-2">

              {wrong}

            </h2>

            <p className="text-sm text-theme-muted mt-1">

              need improvement

            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">

            <XCircle className="text-red-500" size={28}/>

          </div>

        </div>

      </div>

      <div className="card-theme rounded-2xl p-6 border border-theme shadow-lg hover:shadow-xl transition-all duration-300">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-theme-muted">Grade</p>

            <h2 className={`text-4xl font-bold mt-2 ${gradeColor}`}>

              {grade}

            </h2>

            <p className="text-sm text-theme-muted mt-1">

              final evaluation

            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">

            <Trophy className="text-purple-500" size={28}/>

          </div>

        </div>

      </div>

    </div>

    {/* Question Review Section */}

    <div className="card-theme rounded-3xl p-8 shadow-xl border border-theme">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold">

            Question Review

          </h2>

          <p className="text-theme-muted mt-2">

            Compare your answers with the correct answers and identify improvement areas.

          </p>

        </div>

        <div className="surface-secondary rounded-xl px-4 py-3 text-center">

          <p className="text-xs text-theme-muted">Reviewed</p>

          <p className="text-2xl font-bold primary-text">

            {test.questions.length}

          </p>

        </div>

      </div>

      <div className="space-y-8">
        {test.questions.map((question,index)=>{

  const studentAnswer=submission.answers[index];

  const isCorrect=studentAnswer===question.answer;

  const marksEarned=isCorrect

    ? (question.marks||1)

    : 0;

  return(

    <div

      key={index}

      className={`

        rounded-2xl

        border

        p-6

        transition-all

        duration-300

        ${

          isCorrect

          ?

          "border-green-500/30 bg-green-500/5"

          :

          "border-red-500/30 bg-red-500/5"

        }

      `}

    >

      {/* Question Header */}

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

        <div className="flex items-start gap-4 flex-1">

          <div className={`

            w-12

            h-12

            rounded-xl

            flex

            items-center

            justify-center

            shrink-0

            ${

              isCorrect

              ?

              "bg-green-500/10 text-green-500"

              :

              "bg-red-500/10 text-red-500"

            }

          `}>

            {isCorrect

              ?

              <CheckCircle2 size={24}/>

              :

              <XCircle size={24}/>

            }

          </div>

          <div className="flex-1">

            <div className="flex items-center gap-3 mb-2">

              <span className="primary-soft primary-text px-3 py-1 rounded-full text-sm font-semibold">

                Question {index+1}

              </span>

              <span className="text-sm text-theme-muted">

                {question.marks||1} mark{(question.marks||1)>1 ? "s" : ""}

              </span>

            </div>

            <h3 className="text-xl font-bold leading-8">

              {question.question}

            </h3>

          </div>

        </div>

        {/* Marks Badge */}

        <div className="text-center lg:text-right min-w-30">

          <p className="text-sm text-theme-muted">Marks Earned</p>

          <p className={`text-3xl font-bold mt-1 ${

            isCorrect ? "text-green-500" : "text-red-500"

          }`}>

            {marksEarned}/{question.marks||1}

          </p>

        </div>

      </div>

      {/* Options */}

      <div className="space-y-3">

        {question.options.map((option,optionIndex)=>{

          const isCorrectOption=option===question.answer;

          const isStudentOption=option===studentAnswer;

          return(

            <div

              key={optionIndex}

              className={`

                rounded-xl

                p-4

                border

                transition-all

                duration-300

                ${

                  isCorrectOption

                  ?

                  "bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300 shadow-sm"

                  :

                  isStudentOption && !isCorrect

                  ?

                  "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-300 shadow-sm"

                  :

                  "card-theme border-theme text-theme"

                }

              `}

            >

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3 flex-1">

                  <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-theme-muted shrink-0">

                    {String.fromCharCode(65+optionIndex)}

                  </span>

                  <span className="font-medium leading-7">

                    {option}

                  </span>

                </div>

                <div className="flex items-center gap-2 shrink-0">

                  {isCorrectOption && (

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-semibold">

                      <CheckCircle2 size={14}/>

                      Correct

                    </span>

                  )}

                  {isStudentOption && !isCorrect && (

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-semibold">

                      <XCircle size={14}/>

                      Your Answer

                    </span>

                  )}

                </div>

              </div>

            </div>

          );

        })}

      </div>

      {/* Summary */}

      <div className="mt-6 grid md:grid-cols-2 gap-4">

        <div className="surface-secondary rounded-xl p-4">

          <p className="text-sm text-theme-muted mb-1">

            Your Response

          </p>

          <p className={`font-semibold ${

            studentAnswer

              ? (isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")

              : "text-theme-muted"

          }`}>

            {studentAnswer || "Not Answered"}

          </p>

        </div>

        <div className="surface-secondary rounded-xl p-4">

          <p className="text-sm text-theme-muted mb-1">

            Correct Answer

          </p>

          <p className="font-semibold text-green-600 dark:text-green-400">

            {question.answer}

          </p>

        </div>

      </div>

      {/* Result Banner */}

      <div className={`mt-6 rounded-xl p-4 border ${

        isCorrect

          ? "border-green-500/30 bg-green-500/10"

          : "border-red-500/30 bg-red-500/10"

      }`}>

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            {isCorrect

              ?

              <CheckCircle2 className="text-green-500" size={22}/>

              :

              <XCircle className="text-red-500" size={22}/>

            }

            <div>

              <p className={`font-bold ${

                isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"

              }`}>

                {isCorrect ? "Correct Answer" : "Incorrect Answer"}

              </p>

              <p className="text-sm text-theme-muted">

                {isCorrect

                  ? "Excellent! You selected the right option."

                  : studentAnswer

                    ? "Review this concept and compare your answer with the correct one."

                    : "This question was skipped. Consider attempting similar questions for practice."}

              </p>

            </div>

          </div>

          <div className={`px-4 py-2 rounded-xl font-bold ${

            isCorrect

              ? "bg-green-500/15 text-green-600 dark:text-green-400"

              : "bg-red-500/15 text-red-600 dark:text-red-400"

          }`}>

            {isCorrect ? "+" : ""}{marksEarned} Mark{marksEarned!==1 ? "s" : ""}

          </div>

        </div>

      </div>

    </div>

  );

})}

      </div>

    </div>

  </div>

);

}

export default TestResult;