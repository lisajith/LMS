import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

import {
  Award,
  CalendarDays,
  BookOpen,
  User,
} from "lucide-react";

function Certificate() {

  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {

    async function loadCertificate() {

      const courseSnap = await getDoc(
        doc(db, "courses", id)
      );

      if (courseSnap.exists()) {
        setCourse(courseSnap.data());
      }

      const enrollmentSnap = await getDoc(
        doc(
          db,
          "enrollments",
          `${user.uid}_${id}`
        )
      );

      if (enrollmentSnap.exists()) {
        setEnrollment(enrollmentSnap.data());
      }

    }

    if (user) {
      loadCertificate();
    }

  }, [id, user]);

  if (!course || !enrollment) {

    return (
      <div className="p-20 text-center">
        Loading Certificate...
      </div>
    );

  }

  if (enrollment && !enrollment.certificateUnlocked) {
        return (
            <div className="text-center py-40">
                <Award
                    size={70}
                    className="mx-auto text-gray-400"
                />
                <h2 className="text-3xl mt-6 font-bold">
                    Certificate Locked
                </h2>
                <p className="mt-3 text-theme-muted">
                    Complete the course to unlock your certificate.
                </p>
            </div>
        );
    }

  return (

    <div className="max-w-5xl mx-auto py-16">

      <div className="card-theme rounded-3xl shadow-xl border-8 border-blue-500 p-14">

        <div className="text-center">

          <Award
            size={70}
            className="mx-auto text-yellow-500"
          />

          <h1 className="text-5xl font-bold mt-6">
            Certificate
          </h1>

          <p className="text-xl mt-2">
            of Completion
          </p>

        </div>

        <div className="text-center mt-16">

          <p className="text-lg">
            This certifies that
          </p>

          <h2 className="text-5xl font-bold mt-5 text-blue-600">
            {user.displayName}
          </h2>

          <p className="mt-8 text-lg">
            has successfully completed
          </p>

          <h3 className="text-4xl font-bold mt-4">
            {course.title}
          </h3>

        </div>

        <div className="grid md:grid-cols-3 gap-10 mt-20">

          <InfoCard
            icon={<BookOpen />}
            title="Course"
            value={course.title}
          />

          <InfoCard
            icon={<CalendarDays />}
            title="Completed"
            value={
              enrollment.completedAt?.toDate
                ? enrollment.completedAt
                    .toDate()
                    .toLocaleDateString()
                : "-"
            }
          />

          <InfoCard
            icon={<User />}
            title="Student"
            value={user.displayName}
          />

        </div>

      </div>

    </div>

  );

}

function InfoCard({
  icon,
  title,
  value,
}) {

  return (

    <div className="card-theme rounded-xl p-6 text-center">

      <div className="flex justify-center mb-4">

        {icon}

      </div>

      <p className="text-theme-muted">
        {title}
      </p>

      <h3 className="font-bold mt-2">
        {value}
      </h3>

    </div>

  );

}

export default Certificate;