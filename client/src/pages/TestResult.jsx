import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {

doc,

getDoc,

} from "firebase/firestore";

import { db } from "../firebase/firebase";

function TestResult() {

const { user } = useAuth();

const { id } = useParams();

const [submission,setSubmission]=useState(null);

const [test,setTest]=useState(null);

useEffect(()=>{

async function fetchResult(){
if (!user) return;

const submissionSnap=await getDoc(

doc(
    db,
    "testSubmissions",
    `${user.uid}_${id}`
)

);

if(submissionSnap.exists()){

setSubmission(submissionSnap.data());

}

const testSnap=await getDoc(

doc(

db,

"tests",

id

)

);

if(testSnap.exists()){

setTest({

id:testSnap.id,

...testSnap.data(),

});

}

}

fetchResult();

}, [id, user]);

if(!submission||!test){

return(

<div className="text-center py-24">

Loading Result...

</div>

);

}

const percentage = Math.round(

  (submission.obtainedMarks /
    submission.totalMarks) * 100

);

const wrong=

submission.totalQuestions-

submission.score;

return (

<div className="max-w-6xl mx-auto space-y-8">

    {/* Header */}

    <div className="card-theme rounded-2xl p-8">

        <h1 className="text-4xl font-bold">

            {test.title}

        </h1>

        <p className="text-theme-muted mt-2">

            Test Completed Successfully

        </p>

    </div>

    {/* Stats */}

    <div className="grid md:grid-cols-4 gap-6">

        <div className="card-theme rounded-2xl p-6 text-center">

            <h3 className="text-theme-muted">

                Score

            </h3>

            <h1 className="text-5xl font-bold text-blue-600 mt-3">

                {submission.obtainedMarks}

            </h1>

            <p className="mt-2">

                / {submission.totalMarks}

            </p>

        </div>

        <div className="card-theme rounded-2xl p-6 text-center">

            <h3 className="text-theme-muted">

                Percentage

            </h3>

            <h1 className="text-5xl font-bold text-green-600 mt-3">

                {percentage}%

            </h1>

        </div>

        <div className="card-theme rounded-2xl p-6 text-center">

            <h3 className="text-theme-muted">

                Correct

            </h3>

            <h1 className="text-5xl font-bold text-green-500 mt-3">

                {submission.score}

            </h1>

        </div>

        <div className="card-theme rounded-2xl p-6 text-center">

            <h3 className="text-theme-muted">

                Wrong

            </h3>

            <h1 className="text-5xl font-bold text-red-500 mt-3">

                {wrong}

            </h1>

        </div>

    </div>

    {/* Submission Time */}

    <div className="card-theme rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-3">

            Submission Details

        </h2>

        <p>

            Submitted On :

            <strong>

            {

                submission.submittedAt?.toDate()

                .toLocaleString()

            }

            </strong>

        </p>

    </div>

        {/* Question Review */}

    <div className="card-theme rounded-2xl p-8">

      <h2 className="text-2xl font-bold mb-8">

        Question Review

      </h2>

      <div className="space-y-8">

        {test.questions.map((question, index) => {

          const studentAnswer =
            submission.answers[index];

          const isCorrect = studentAnswer === question.answer;

          return (

            <div

              key={index}

              className="border border-theme rounded-2xl p-6"

            >

              <h3 className="font-bold text-lg mb-5">

                Q{index + 1}. {question.question}

              </h3>

              <div className="space-y-3">

                {question.options.map((option, optionIndex) => (

                  <div
                    key={optionIndex}
                    className={`
                        rounded-xl
                        p-3
                        border
                        transition-all
                        ${
                        option === question.answer
                            ? "primary-soft primary-border primary-text font-semibold"
                            : option === studentAnswer
                            ? "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400"
                            : "card-theme border-theme text-theme hover-theme"
                        }
                    `}
                    >
                    {option}
                    </div>
                ))}

              </div>

              <div className="mt-6 space-y-2">

                <p>

                  <strong>Your Answer :</strong>{" "}

                  {studentAnswer || "Not Answered"}

                </p>

                <p>

                  <strong>Correct Answer :</strong>{" "}

                  {question.answer}

                </p>

                <p

                  className={`font-bold ${

                    isCorrect

                      ? "text-green-600"

                      : "text-red-600"

                  }`}

                >

                  {isCorrect

                    ? "Correct"

                    : "Wrong"}

                </p>

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