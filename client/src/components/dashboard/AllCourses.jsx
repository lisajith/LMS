import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import CourseCard from "./CourseCard";

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const snapshot = await getDocs(collection(db, "courses"));

        const courseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCourses(courseList);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

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

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          {...course}
        />
      ))}
    </div>
  );
}

export default AllCourses;