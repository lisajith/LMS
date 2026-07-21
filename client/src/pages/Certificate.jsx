import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

import {
  Award,
  CalendarDays,
  BookOpen,
  User,
  ShieldCheck,
  Download,
} from "lucide-react";

function Certificate() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    async function loadCertificate() {
      if (!user) return;

      const courseSnap = await getDoc(doc(db, "courses", id));

      if (courseSnap.exists()) {
        setCourse(courseSnap.data());
      }

      const enrollmentSnap = await getDoc(
        doc(db, "enrollments", `${user.uid}_${id}`)
      );

      if (enrollmentSnap.exists()) {
        setEnrollment(enrollmentSnap.data());
      }
    }

    loadCertificate();
  }, [id, user]);

  function handleDownload() {
    window.print();
  }

  // Generate unique certificate number
  const certificateNumber = `LMS-${id
    .slice(0, 4)
    .toUpperCase()}-${user?.uid?.slice(0, 6).toUpperCase()}`;

  if (!course || !enrollment) {
    return <div className="p-20 text-center">Loading Certificate...</div>;
  }

  if (!enrollment.certificateUnlocked) {
    return (
      <div className="text-center py-40">
        <Award size={70} className="mx-auto text-gray-400" />
        <h2 className="text-3xl mt-6 font-bold">Certificate Locked</h2>
        <p className="mt-3 text-theme-muted">
          Complete the course to unlock your certificate.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 print:py-0">
      {/* Action Bar */}
      <div className="flex justify-end mb-6 print:hidden">
        <button
          onClick={handleDownload}
          className="btn-primary px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="relative overflow-hidden rounded-4xl border-10 border-blue-600 bg-white p-10 shadow-2xl print:shadow-none print:border-[6px]">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-br-full opacity-60" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full opacity-60" />

        {/* Header */}
        <div className="text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-yellow-100 mx-auto flex items-center justify-center border-4 border-yellow-300">
            <Award size={48} className="text-yellow-600" />
          </div>

          <h1 className="text-5xl font-black mt-6 text-gray-900">
            Certificate of Completion
          </h1>

          <p className="text-lg text-gray-600 mt-3">
            This is to proudly certify that
          </p>
        </div>

        {/* Student Name */}
        <div className="text-center mt-12 relative z-10">
          <h2 className="text-6xl font-black text-blue-700 tracking-wide">
            {user.displayName || "Student"}
          </h2>

          <div className="w-64 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4" />

          <p className="text-xl text-gray-700 mt-8">
            has successfully completed the course
          </p>

          <h3 className="text-4xl font-black mt-4 text-gray-900">
            {course.title}
          </h3>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 relative z-10">
          <InfoCard
            icon={<BookOpen className="text-blue-600" />}
            title="Course"
            value={course.title}
          />

          <InfoCard
            icon={<CalendarDays className="text-green-600" />}
            title="Completed On"
            value={
              enrollment.completedAt?.toDate
                ? enrollment.completedAt.toDate().toLocaleDateString()
                : new Date().toLocaleDateString()
            }
          />

          <InfoCard
            icon={<User className="text-purple-600" />}
            title="Student"
            value={user.displayName || "Student"}
          />
        </div>

        {/* Certificate Number */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-5 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Certificate Number
                </p>
                <p className="font-black text-lg tracking-wider text-gray-900">
                  {certificateNumber}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Verification</p>
              <p className="font-semibold text-green-700">Digitally Verified</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                Issued By
              </p>
              <p className="font-black text-2xl text-gray-900 mt-1">
                LMS Portal
              </p>
            </div>

            <div className="text-center">
              <div className="w-40 h-px bg-gray-400 mx-auto mb-3" />
              <p className="font-semibold text-gray-800">
                Authorized Signature
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                Issue Date
              </p>
              <p className="font-bold text-gray-900 mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>

      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
        {title}
      </p>

      <h3 className="font-bold mt-2 text-gray-900 text-lg">{value}</h3>
    </div>
  );
}

export default Certificate;
