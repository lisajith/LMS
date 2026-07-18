import { useEffect, useState } from "react";
import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";
import { BookOpen, FolderOpen } from "lucide-react";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMyCourses() {
      if (!user) return;

      try {
        // Get enrollments of the current user
        const enrollmentsQuery = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid)
        );

        const enrollmentSnapshot = await getDocs(enrollmentsQuery);

        const enrollmentMap = {};
          enrollmentSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            enrollmentMap[data.courseId] = {
              progress: data.progress || 0,
              completedLessons: data.completedLessons || [],
            };
          });

        const courseIds = enrollmentSnapshot.docs.map(
          (doc) => doc.data().courseId
        );

        if (courseIds.length === 0) {
          setCourses([]);
          return;
        }

        // Get only enrolled courses
        const coursesQuery = query(
          collection(db, "courses"),
          where(documentId(), "in", courseIds)
        );

        const courseSnapshot = await getDocs(coursesQuery);

        const courseList = courseSnapshot.docs.map((doc) => {
          const course = doc.data();
          const enrollment = enrollmentMap[doc.id];

          return {
            id: doc.id,
            ...course,

            // Override with user's progress
            progress: enrollment?.progress || 0,

            completedLessons:
              enrollment?.completedLessons || [],
          };
        });

        setCourses(courseList);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMyCourses();
  }, [user]);

  return (
    <section>

      <div className="flex items-center gap-3 mb-8">

        <BookOpen
          size={30}
          className="text-blue-600"
        />

        <div>
          <h2 className="text-3xl font-bold text-theme">
            My Courses
          </h2>

          <p className="text-slate-500">
            Continue learning where you left off.
          </p>
        </div>

      </div>

      {courses.length === 0 ? (
        <div className="card-theme rounded-2xl shadow-md border p-10 text-center">

          <FolderOpen
            size={60}
            className="mx-auto text-slate-400 mb-5"
          />

          <h3 className="text-2xl font-bold text-theme">
            No Enrolled Courses
          </h3>

          <p className="mt-3 text-slate-500">
            Browse available courses and enroll to begin your learning journey.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              showProgress={true}
              myCourse={true}
            />
          ))}
        </div>
      )}

    </section>
  );
}

export default MyCourses;