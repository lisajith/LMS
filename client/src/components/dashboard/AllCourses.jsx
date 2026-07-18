import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";
import { db } from "../../firebase/firebase";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  LoaderCircle,
  Search,
  BookOpen,
  FolderOpen,
} from "lucide-react";

function AllCourses() {

  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [lessonCounts, setLessonCounts] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchData() {

    try {

      // ==========================
      // Fetch Courses
      // ==========================

      const courseSnapshot = await getDocs(
        collection(db, "courses")
      );

      const courseList = courseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(courseList);

      // ==========================
      // Fetch Lesson Counts
      // ==========================

      const lessonSnapshot = await getDocs(
        collection(db, "lessons")
      );

      const counts = {};

      lessonSnapshot.forEach((doc) => {

        const lesson = doc.data();

        counts[lesson.courseId] =
          (counts[lesson.courseId] || 0) + 1;

      });

      setLessonCounts(counts);

      // ==========================
      // Fetch User Enrollments
      // ==========================

      if (user) {

        const enrollmentQuery = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );

        const enrollmentSnapshot =
          await getDocs(enrollmentQuery);

        const enrolledIds =
          enrollmentSnapshot.docs.map(
            (doc) => doc.data().courseId
          );

        setEnrolledCourses(enrolledIds);

      } else {

        setEnrolledCourses([]);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchData();

  }, [user]);

  if (loading) {

    return (

      <div className="flex justify-center items-center py-24">

        <p className="text-theme-muted text-lg">
          Loading courses...
        </p>

      </div>

    );

  }

  if (courses.length === 0) {

    return (

      <div className="card-theme rounded-2xl p-12 text-center">

        <h2 className="text-2xl font-bold text-theme">
          No Courses Available
        </h2>

        <p className="mt-3 text-theme-muted">
          New courses will appear here soon.
        </p>

      </div>

    );

  }

  const filteredCourses = courses.filter((course) => {
    const keyword = search.toLowerCase();

    return (
      course.title.toLowerCase().includes(keyword) ||
      course.instructor.toLowerCase().includes(keyword)
    );
  });

  return (
    <>
      <div className="relative mb-8">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
        />
        <input
          type="text"
          placeholder="Search by course or instructor..."
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

      {filteredCourses.length === 0 ? (
        <div className="card-theme rounded-2xl p-16 text-center">
          <FolderOpen
            size={55}
            className="mx-auto mb-5 text-theme-muted"
          />
          <h2 className="text-2xl font-bold mb-2">
            No Courses Found
          </h2>
          <p className="text-theme-muted">
            Try searching with another course or instructor.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              lessonCount={lessonCounts[course.id] || 0}
              enrolled={enrolledCourses.includes(course.id)}
              refreshCourses={fetchData}
            />
          ))}
        </div>
      )}
    </>

  );

}

export default AllCourses;