import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

import {
  Award,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

function Certificates() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadCertificates() {

      if (!user) return;

      try {

        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid),
          where("certificateUnlocked", "==", true)
        );

        const snapshot = await getDocs(q);

        const certificateList = [];

        for (const enrollmentDoc of snapshot.docs) {

          const enrollment = enrollmentDoc.data();

          const courseSnap = await getDoc(
            doc(db, "courses", enrollment.courseId)
          );

          if (courseSnap.exists()) {

            certificateList.push({
              id: enrollment.courseId,
              ...courseSnap.data(),
              completedAt: enrollment.completedAt,
            });

          }

        }

        setCertificates(certificateList);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadCertificates();

  }, [user]);

  if (loading) {

    return (

      <div className="flex justify-center items-center h-80">

        <h2 className="text-xl">
          Loading Certificates...
        </h2>

      </div>

    );

  }

  if (certificates.length === 0) {

    return (

      <div className="flex flex-col items-center justify-center h-[70vh]">

        <Award
          size={80}
          className="text-gray-400"
        />

        <h1 className="text-3xl font-bold mt-6">
          No Certificates Yet
        </h1>

        <p className="text-theme-muted mt-3">
          Complete a course to unlock your first certificate.
        </p>

      </div>

    );

  }

  return (

    <div>

      <h1 className="text-4xl font-bold mb-8">
        My Certificates
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {certificates.map((course) => (

          <div
            key={course.id}
            className="card-theme rounded-2xl shadow-md overflow-hidden"
          >

            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-contain"
            />

            <div className="p-6">

              <div className="flex items-center gap-2">

                <Award
                  className="text-yellow-500"
                  size={24}
                />

                <h2 className="text-xl font-bold">
                  {course.title}
                </h2>

              </div>

              <div className="flex items-center gap-2 mt-5 text-theme-muted">

                <CalendarDays size={18} />

                <span>

                  {course.completedAt?.toDate
                    ? course.completedAt
                        .toDate()
                        .toLocaleDateString()
                    : "-"}

                </span>

              </div>

              <button
                onClick={() =>
                  navigate(`/dashboard/certificate/${course.id}`)
                }
                className="btn-primary w-full mt-6 py-3 rounded-xl flex items-center justify-center gap-2"
              >

                View Certificate

                <ArrowRight size={18} />

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Certificates;