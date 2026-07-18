import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

import { doc, getDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";

function TestCard({ test, user }) {
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    async function fetchSubmission() {
      if (!user) return;

      try {
        const ref = doc(db, "testSubmissions", `${user.uid}_${test.id}`);

        const snap = await getDoc(ref);

        if (snap.exists()) {
          setSubmission(snap.data());
        } else {
          setSubmission(null);
        }
      } catch (error) {
        console.error("Submission Fetch Error:", error);

        setSubmission(null);
      }
    }

    fetchSubmission();
  }, [user, test.id]);

  const now = new Date();

  const startDate = test.startDate?.toDate();
  const endDate = test.endDate?.toDate();

  let status = "Upcoming";

  if (now >= startDate && now <= endDate) {
    status = submission ? "Completed" : "Active";
  } else if (now > endDate) {
    status = submission ? "Completed" : "Ended";
  }

  return (
    <div className="card-theme rounded-2xl shadow-lg hover-theme transition-all duration-300 p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{test.title}</h2>

          {status === "Upcoming" && (
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
              Upcoming
            </span>
          )}

          {status === "Active" && (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
              Active
            </span>
          )}

          {status === "Completed" && (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              Completed
            </span>
          )}

          {status === "Ended" && (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
              Ended
            </span>
          )}
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-theme-muted">
            <BookOpen size={18} />

            {test.courseName}
          </div>

          <div className="flex items-center gap-3 text-theme-muted">
            <Clock3 size={18} />
            {test.duration} Minutes
          </div>

          <div className="flex items-center gap-3 text-theme-muted">
            <ClipboardCheck size={18} />
            {test.totalMarks} Marks
          </div>

          <div className="flex items-center gap-3 text-theme-muted">
            <ClipboardCheck size={18} />
            {test.questions?.length || 0} Questions
          </div>

          <div className="flex items-center gap-3 text-theme-muted">
            <CalendarDays size={18} />
            Starts :{startDate?.toLocaleDateString()}
          </div>

          <div className="flex items-center gap-3 text-theme-muted">
            <CalendarDays size={18} />
            Ends :{endDate?.toLocaleDateString()}
          </div>
        </div>
      </div>

      <button
        disabled={status === "Upcoming"}
        onClick={() => {
          if (status === "Completed") {
            navigate(`/dashboard/tests/result/${test.id}`);
          } else if (status === "Active") {
            navigate(`/dashboard/tests/${test.id}`);
          }
        }}
        className="btn-primary mt-8 flex items-center justify-center gap-2 py-3 rounded-xl disabled:opacity-50"
      >
        {status === "Active" && "Attempt Test"}

        {status === "Completed" && "View Result"}

        {status === "Upcoming" && "Upcoming"}

        {status === "Ended" && "Test Closed"}

        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default TestCard;
