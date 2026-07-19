import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { ClipboardCheck, Search, FileX2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import { db } from "../firebase/firebase";

import TestCard from "../components/tests/TestCard";
import TestStats from "../components/tests/TestStats";

function Tests() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTests() {
      try {
        if (!user) return;

        // 1. Get student's enrollments
        const enrollmentQuery = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );

        const enrollmentSnap = await getDocs(enrollmentQuery);

        // 2. Extract enrolled course IDs
        const enrolledCourseIds = enrollmentSnap.docs.map(
          (doc) => doc.data().courseId
        );

        // 3. If not enrolled in any course
        if (enrolledCourseIds.length === 0) {
          setTests([]);
          return;
        }

        // 4. Fetch all tests
        const testQuery = query(
          collection(db, "tests"),
          orderBy("createdAt", "desc")
        );

        const testSnap = await getDocs(testQuery);

        // 5. Keep only tests for enrolled courses
        const filteredTests = testSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((test) => enrolledCourseIds.includes(test.courseId));

        setTests(filteredTests);
      } catch (err) {
        console.error("Fetch Tests Error:", err);
      }
    }

    fetchTests();
  }, [user]);

  const filteredTests = tests.filter((test) => {
    const keyword = search.toLowerCase();

    return (
      test.title?.toLowerCase().includes(keyword) ||
      test.courseName?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-8">
      {/* Heading */}

      <div className="flex items-center gap-3">
        <ClipboardCheck size={34} className="primary-text" />

        <div>
          <h1 className="text-4xl font-bold">Tests</h1>

          <p className="text-theme-muted">
            Attempt online tests and view your results.
          </p>
        </div>
      </div>

      {/* Stats */}

      <TestStats tests={tests} />

      {/* Search */}

      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
        />

        <input
          type="text"
          placeholder="Search Tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-12
            pr-4
            py-4
            rounded-xl
            border
            border-theme
            bg-theme
            text-theme
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>

      {filteredTests.length === 0 ? (
        <div className="card-theme rounded-2xl p-16 text-center">
          <FileX2 size={60} className="mx-auto mb-5 text-theme-muted" />

          <h2 className="text-2xl font-bold mb-3">No Tests Available</h2>

          <p className="text-theme-muted max-w-md mx-auto">
            Tests will appear here only for the courses you have enrolled in.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tests;
