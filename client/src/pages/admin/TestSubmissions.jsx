import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { Users, Trophy, Clock, FileCheck } from "lucide-react";

function TestSubmissions() {
  const { id } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const q = query(
          collection(db, "testSubmissions"),
          where("testId", "==", id)
        );

        const snapshot = await getDocs(q);

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubmissions(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [id]);

  function formatDate(value) {
    if (!value) return "Not available";

    if (value.toDate) {
      return value.toDate().toLocaleString();
    }

    return new Date(value).toLocaleString();
  }

  if (loading) {
    return <div className="p-10 text-center">Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl primary-soft flex items-center justify-center">
          <Users className="primary-text" size={24} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Test Submissions</h1>
          <p className="text-theme-muted">Students who attempted this test</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="card-theme rounded-2xl p-12 text-center border border-theme">
          <FileCheck size={48} className="mx-auto text-theme-muted mb-4" />

          <h2 className="text-xl font-bold mb-2">No submissions yet</h2>

          <p className="text-theme-muted">
            Students have not attempted this test.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => {
            const obtainedMarks = Number(submission.obtainedMarks ?? 0);
            const totalMarks = Number(submission.totalMarks ?? 1);

            const percentage =
              totalMarks > 0
                ? Math.round((obtainedMarks / totalMarks) * 100)
                : 0;

            const attempted = Object.keys(submission.answers || {}).length;

            return (
              <div
                key={submission.id}
                className="card-theme rounded-2xl p-6 border border-theme shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">
                      {submission.studentName || "Unknown Student"}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-theme-muted">
                      {/* Marks */}
                      <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-500" />
                        <span>
                          Marks: <strong>{obtainedMarks}</strong> /{" "}
                          <strong>{totalMarks}</strong>
                        </span>
                      </div>

                      {/* Questions Attempted */}
                      <div className="flex items-center gap-2">
                        <FileCheck size={16} className="text-green-500" />
                        <span>
                          Attempted: <strong>{attempted}</strong> /{" "}
                          <strong>{submission.totalQuestions}</strong>
                        </span>
                      </div>

                      {/* Correct Questions */}
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        <span>
                          Correct: <strong>{submission.score}</strong>
                        </span>
                      </div>

                      {/* Submission Time */}
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-purple-500" />
                        <span>{formatDate(submission.submittedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="text-2xl font-bold primary-text">
                      {percentage}%
                    </div>
                    <div className="text-sm text-theme-muted">Percentage</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TestSubmissions;
