import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import {
  BookOpen,
  CalendarDays,
  Download,
  Upload,
  FileText,
  CheckCircle2,
  Star,
  X,
} from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { uploadAssignment } from "../services/cloudinary";

function AssignmentDetails() {

  const { id } = useParams();
  const { user, userData } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    async function fetchData() {

      try {

        // Assignment

        const assignmentRef = doc(
          db,
          "assignments",
          id
        );

        const assignmentSnap =
          await getDoc(assignmentRef);

        if (assignmentSnap.exists()) {

          setAssignment({

            id: assignmentSnap.id,

            ...assignmentSnap.data(),

          });

        }

        // Student Submission

        if (user) {

          const submissionRef = doc(
            db,
            "assignmentSubmissions",
            `${user.uid}_${id}`
          );

          const submissionSnap =
            await getDoc(submissionRef);

          if (submissionSnap.exists()) {

            setSubmission({

              id: submissionSnap.id,

              ...submissionSnap.data(),

            });

          }

        }

      }

      catch (err) {

        console.error(err);

      }

    }

    fetchData();

  }, [id, user]);

  async function handleSubmit() {

    if (!selectedFile) {

      alert("Please select a file.");

      return;

    }

    try {

      setUploading(true);

      // Upload to Cloudinary

      const upload =
        await uploadAssignment(selectedFile);

      const submissionData = {

        assignmentId: assignment.id,

        courseId: assignment.courseId,

        userId: user.uid,

        studentName:
          userData?.name ||
          user.displayName,

        fileUrl: upload.secure_url,

        fileName: selectedFile.name,

        submittedAt: serverTimestamp(),

        status: "Submitted",

        marks: null,

        feedback: "",

      };

      await setDoc(

        doc(
          db,
          "assignmentSubmissions",
          `${user.uid}_${assignment.id}`
        ),

        submissionData

      );

      setSubmission({

        ...submissionData,

        submittedAt: new Date(),

      });

      setSelectedFile(null);

      alert("Assignment submitted successfully!");

    }

    catch (err) {

      console.error(err);

      alert("Upload failed.");

    }

    finally {

      setUploading(false);

    }

  }

  if (!assignment) {

    return (

      <div className="text-center py-24">

        Loading Assignment...

      </div>

    );

  }

  const dueDate = assignment?.dueDate?.toDate();

  const today = new Date();

  const diffTime =
    dueDate
      ? dueDate - today
      : 0;

  const daysLeft =
    Math.ceil(
      diffTime /
      (1000 * 60 * 60 * 24)
    );

  const isExpired =
    daysLeft < 0;
    return (

    <div className="space-y-8">

      {/* Header */}

      <div className="card-theme rounded-2xl shadow p-8">

        <h1 className="text-4xl font-bold">

          {assignment.title}

        </h1>

        <div className="mt-6 space-y-5">

          <div className="flex items-center gap-3 text-theme-muted">

            <BookOpen size={18} />

            <span>

              {assignment.courseName}

            </span>

          </div>

          <div className="flex items-center gap-3 text-theme-muted">

            <CalendarDays size={18} />

            <span>

              Due Date :

              <span className="ml-2 font-semibold text-theme">

                {assignment.dueDate
                  ?.toDate()
                  .toLocaleString()}

              </span>

            </span>

          </div>

          <div>

            {daysLeft > 0 && (

              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">

                {daysLeft} Days Left

              </span>

            )}

            {daysLeft === 0 && (

              <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">

                Last Day

              </span>

            )}

            {isExpired && (

              <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">

                Overdue

              </span>

            )}

          </div>

        </div>

      </div>

      {/* Description */}

      <div className="card-theme rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-5">

          Assignment Description

        </h2>

        <p className="leading-8 text-theme-muted">

          {assignment.description}

        </p>

      </div>

      {/* Submission Status */}

      <div className="card-theme rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">

          Submission Status

        </h2>

        {!submission ? (

          <div className="flex items-center gap-3">

            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>

            <span className="font-semibold">

              Pending Submission

            </span>

          </div>

        ) : (

          <div className="space-y-6">

            <div className="flex items-center gap-3">

              <div
                className={`

                  w-4
                  h-4
                  rounded-full

                  ${
                    submission.status === "Submitted"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }

                `}
              ></div>

              <span className="font-bold text-lg">

                {submission.status}

              </span>

            </div>

            <div>

              <p className="text-theme-muted">

                Submitted On

              </p>

              <h3 className="font-semibold mt-2">

                {submission.submittedAt?.toDate

                  ? submission.submittedAt
                      .toDate()
                      .toLocaleString()

                  : new Date(
                      submission.submittedAt
                    ).toLocaleString()}

              </h3>

            </div>

          </div>

        )}

      </div>

      {/* Download Assignment */}

      <div className="card-theme rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">

          Assignment File

        </h2>

        {assignment.attachment ? (

          <a

            href={assignment.attachment}

            target="_blank"

            rel="noreferrer"

            className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2"

          >

            <Download size={18} />

            Download Assignment

          </a>

        ) : (

          <p className="text-theme-muted">

            No assignment file available.

          </p>

        )}

      </div>
            {/* Submit Assignment */}

      <div className="card-theme rounded-2xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">

          Submit Assignment

        </h2>

        {submission && !isExpired ? (

          <>
            <div className="rounded-xl border border-theme bg-theme p-5">

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-bold text-green-600">
                    Assignment Submitted
                  </h3>

                  <p>{submission.fileName}</p>

                </div>

                <button
                  onClick={()=>{
                    setSubmission(null);
                    setSelectedFile(null);
                  }}
                  className="text-blue-600 font-semibold cursor-pointer"
                >
                  Re-submit
                </button>

              </div>

            </div>

            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-4 inline-flex px-6 py-3 rounded-xl"
            >
              View Submission
            </a>

          </>

        ) : submission && isExpired ? (

          <>
            <div className="rounded-xl border border-green-500 bg-green-50 p-5">

              <h3 className="font-bold text-green-600">
                Assignment Submitted
              </h3>

              <p>{submission.fileName}</p>

            </div>

          </>

        ) : (

          <>

            <input

              type="file"

              disabled={isExpired}

              onChange={(e) =>
                setSelectedFile(
                  e.target.files[0]
                )
              }

              className="w-full border border-theme rounded-xl p-4 cursor-pointer disabled:opacity-50"

            />

            {selectedFile && (

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-theme
                  p-4
                  flex
                  justify-between
                  items-center
                "
              >

                <div className="flex items-center gap-3">

                  <FileText
                    className="primary-text"
                  />

                  <div>

                    <p className="font-semibold">

                      {selectedFile.name}

                    </p>

                    <p className="text-sm text-theme-muted">

                      {selectedFile.type}

                    </p>

                    <p className="text-sm text-theme-muted">

                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB

                    </p>

                  </div>

                </div>

                <button

                  disabled={uploading}

                  onClick={() =>
                    setSelectedFile(null)
                  }

                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-50"

                >

                  <X
                    size={18}
                    className="text-red-500"
                  />

                </button>

              </div>

            )}

            {isExpired && (

              <p className="mt-5 text-red-500 font-semibold">

                Submission has been closed because the due date has passed.

              </p>

            )}

            <button

              disabled={
                uploading ||
                isExpired
              }

              onClick={handleSubmit}

              className="btn-primary mt-6 px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"

            >

              <Upload size={18} />

              {uploading
                ? "Uploading..."
                : "Submit Assignment"}

            </button>

          </>

        )}

      </div>

      {/* Evaluation */}

      {submission?.status === "Reviewed" && (

        <div className="card-theme rounded-2xl shadow p-8">

          <div className="flex items-center gap-3">

            <CheckCircle2
              className="text-green-600"
            />

            <h2 className="text-2xl font-bold">

              Evaluation

            </h2>

          </div>

          <div className="mt-8 space-y-6">

            <div className="flex items-center gap-3">

              <Star
                className="text-yellow-500"
              />

              <span className="font-semibold">

                Marks :

              </span>

              <span className="text-2xl font-bold">

                {submission.marks ?? 0}

                /

                {assignment.maxMarks}

              </span>

            </div>

            <div>

              <h3 className="font-semibold mb-2">

                Feedback

              </h3>

              <p className="text-theme-muted leading-8">

                {submission.feedback ||

                  "No feedback available yet."}

              </p>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default AssignmentDetails;