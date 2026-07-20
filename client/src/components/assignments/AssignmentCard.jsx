import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { doc, getDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import {
  CalendarDays,
  BookOpen,
  Clock3,
  CheckCircle2,
  Star,
  ArrowRight,
} from "lucide-react";

function AssignmentCard({
  assignment,

  user,
}) {
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const attachmentLink =
    assignment.attachmentUrl || assignment.attachment || "";

  useEffect(() => {
    async function fetchSubmission() {
      if (!user) return;

      const ref = doc(
        db,
        "assignmentSubmissions",
        `${user.uid}_${assignment.id}`
      );

      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setSubmission(snap.data());
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchSubmission();
  }, [assignment.id, user]);

  function getStatusBadge() {
    if (!submission) {
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
          Pending
        </span>
      );
    }

    if (submission.status === "Submitted") {
      return (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          Submitted
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
        Reviewed
      </span>
    );
  }

  return (
    <div className="card-theme rounded-2xl shadow-lg hover-theme transition-all duration-300 p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{assignment.title}</h2>

          {getStatusBadge()}
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-theme-muted">
            <BookOpen size={18} />

            <span>{assignment.courseName}</span>
          </div>

          <div className="flex items-center gap-3 text-theme-muted">
            <CalendarDays size={18} />
            <span>
              Due:{" "}
              {assignment.dueDate &&
              typeof assignment.dueDate === "object" &&
              assignment.dueDate.toDate
                ? assignment.dueDate.toDate().toLocaleDateString("en-IN")
                : assignment.dueDate}
            </span>
          </div>

          {submission && (
            <div className="flex items-center gap-3 text-theme-muted">
              <Clock3 size={18} />
              Submitted :{" "}
              {submission.submittedAt?.toDate
                ? submission.submittedAt.toDate().toLocaleDateString()
                : "Just Now"}
            </div>
          )}

          {submission?.status === "Reviewed" && (
            <div className="flex items-center gap-3 text-green-600 font-semibold">
              <Star size={18} />
              {submission.marks}/100
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate(`/dashboard/assignments/${assignment.id}`)}
        className="btn-primary mt-8 flex items-center justify-center gap-2 py-3 rounded-xl"
      >
        View Assignment
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default AssignmentCard;
