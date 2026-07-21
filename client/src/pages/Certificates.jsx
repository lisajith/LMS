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

import { Award, CalendarDays, ArrowRight, ShieldCheck } from "lucide-react";

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
              certificateNumber: `LMS-${enrollment.courseId
                .slice(0, 4)
                .toUpperCase()}-${user.uid.slice(0, 6).toUpperCase()}`,
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
        <h2 className="text-xl">Loading Certificates...</h2>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Award size={80} className="text-gray-400" />

        <h1 className="text-3xl font-bold mt-6">No Certificates Yet</h1>

        <p className="text-theme-muted mt-3 text-center max-w-md">
          Complete your enrolled courses to unlock professional certificates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-linear-to-r from-yellow-500 to-orange-500 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center">
            <Award size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-black">My Certificates</h1>
            <p className="text-white/90 mt-1">
              Your verified course completion achievements
            </p>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {certificates.map((course) => (
          <div
            key={course.id}
            className="card-theme rounded-3xl border border-theme shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative bg-linear-to-br from-yellow-50 to-orange-50 p-8">
              <div className="absolute top-4 right-4">
                <ShieldCheck className="text-green-600" size={24} />
              </div>

              <div className="w-20 h-20 rounded-full bg-yellow-100 mx-auto flex items-center justify-center border-4 border-yellow-300">
                <Award className="text-yellow-600" size={36} />
              </div>

              <div className="text-center mt-5">
                <h2 className="text-2xl font-black">{course.title}</h2>
                <p className="text-sm text-theme-muted mt-2">
                  Verified Completion Certificate
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-theme-muted">
                <CalendarDays size={18} />

                <span className="font-medium">
                  {course.completedAt?.toDate
                    ? course.completedAt.toDate().toLocaleDateString()
                    : "-"}
                </span>
              </div>

              <div className="rounded-2xl bg-theme-hover p-4">
                <p className="text-xs text-theme-muted font-semibold uppercase tracking-wide">
                  Certificate Number
                </p>
                <p className="font-black mt-1 tracking-wide">
                  {course.certificateNumber}
                </p>
              </div>

              <button
                onClick={() => navigate(`/dashboard/certificate/${course.id}`)}
                className="btn-primary w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold"
              >
                View & Download
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
