import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { ClipboardList, Search, FileX2 } from "lucide-react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import AssignmentStats from "../components/assignments/AssignmentStats";
import AssignmentCard from "../components/assignments/AssignmentCard";

function Assignments() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [assignments, setAssignments] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    submitted: 0,
    reviewed: 0,
  });

  useEffect(() => {
    if (!user) return;

    fetchAssignments();
  }, [user]);

  async function fetchAssignments() {
    try {
      const q = query(
        collection(db, "assignments"),

        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      let pending = 0;
      let submitted = 0;
      let reviewed = 0;

      const assignmentList = [];

      for (const document of snapshot.docs) {
        const assignment = {
          id: document.id,

          ...document.data(),

          status: "Pending",
        };

        const submissionRef = doc(
          db,

          "assignmentSubmissions",

          `${user.uid}_${assignment.id}`
        );

        const submissionSnap = await getDoc(submissionRef);

        if (submissionSnap.exists()) {
          const submission = submissionSnap.data();

          assignment.status = submission.status;

          assignment.submission = submission;
        }

        if (assignment.status === "Pending") {
          pending++;
        } else if (assignment.status === "Submitted") {
          submitted++;
        } else if (assignment.status === "Reviewed") {
          reviewed++;
        }

        assignmentList.push(assignment);
      }

      setAssignments(assignmentList);

      setStats({
        total: assignmentList.length,

        pending,

        submitted,

        reviewed,
      });
    } catch (err) {
      console.error(err);
    }
  }
  const filteredAssignments = assignments.filter((assignment) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      assignment.title.toLowerCase().includes(keyword) ||
      assignment.courseName?.toLowerCase().includes(keyword);

    if (!matchesSearch) return false;

    if (filter === "All") return true;

    return assignment.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Heading */}

      <div className="flex items-center gap-3">
        <ClipboardList size={34} className="primary-text" />

        <div>
          <h1 className="text-4xl font-bold">Assignments</h1>

          <p className="text-theme-muted">
            Complete and submit your assignments before the due date.
          </p>
        </div>
      </div>

      {/* Stats */}

      <AssignmentStats
        total={stats.total}
        pending={stats.pending}
        submitted={stats.submitted}
        reviewed={stats.reviewed}
      />

      {/* Search */}

      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
        />

        <input
          type="text"
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-theme bg-theme text-theme outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter */}

      <div className="flex gap-3 flex-wrap">
        {["All", "Pending", "Submitted", "Reviewed"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`

              px-5 py-2 rounded-xl font-medium transition

              ${
                filter === item
                  ? "btn-primary"
                  : "border border-theme hover-theme"
              }

            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Cards */}

      {filteredAssignments.length === 0 ? (
        <div className="card-theme rounded-2xl p-16 text-center">
          <FileX2 size={55} className="mx-auto mb-5 text-theme-muted" />

          <h2 className="text-2xl font-bold">No Assignments Found</h2>

          <p className="text-theme-muted mt-2">Try another search keyword.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Assignments;
