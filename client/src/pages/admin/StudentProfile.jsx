import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
doc,
getDoc,
collection,
getDocs,
query,
where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';

import {
ArrowLeft,
User,
Mail,
Phone,
GraduationCap,
Award,
ClipboardCheck,
BookOpen,
BarChart3,
CheckCircle2,
XCircle,
} from 'lucide-react';

import AdminPageHeader from '../../components/admin/AdminPageHeader';

function StudentProfile() {
const { id } = useParams();

const [student, setStudent] = useState(null);
const [enrollments, setEnrollments] = useState([]);
const [attendanceStats, setAttendanceStats] = useState({
total: 0,
present: 0,
percentage: 0,
});
const [testStats, setTestStats] = useState({
totalTests: 0,
averagePercentage: 0,
});
const [loading, setLoading] = useState(true);

useEffect(() => {
loadProfile();
}, [id]);

async function loadProfile() {
try {
// User
const userSnap = await getDoc(doc(db, 'users', id));

  if (userSnap.exists()) {
    setStudent({
      id: userSnap.id,
      ...userSnap.data(),
    });
  }

  // Enrollments
  const enrollQuery = query(
    collection(db, 'enrollments'),
    where('userId', '==', id)
  );

  const enrollSnap = await getDocs(enrollQuery);

  const enrollmentList = enrollSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  setEnrollments(enrollmentList);

  // Attendance
  const attendanceQuery = query(
    collection(db, 'attendance'),
    where('studentId', '==', id)
  );

  const attendanceSnap = await getDocs(attendanceQuery);

  const attendanceRecords = attendanceSnap.docs.map((d) => d.data());

  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(
    (a) => a.status === 'Present' || a.status === 'Late'
  ).length;

  const percentage = total > 0
    ? Math.round((present / total) * 100)
    : 0;

  setAttendanceStats({
    total,
    present,
    percentage,
  });

  // Test submissions
  const testQuery = query(
    collection(db, 'testSubmissions'),
    where('studentId', '==', id)
  );

  const testSnap = await getDocs(testQuery);

  const testRecords = testSnap.docs.map((d) => d.data());

  let avg = 0;

  if (testRecords.length > 0) {
    const percentages = testRecords.map((t) =>
      t.totalQuestions
        ? (t.score / t.totalQuestions) * 100
        : 0
    );

    avg = Math.round(
      percentages.reduce((a, b) => a + b, 0) / percentages.length
    );
  }

  setTestStats({
    totalTests: testRecords.length,
    averagePercentage: avg,
  });
} catch (err) {
  console.error(err);
} finally {
  setLoading(false);
}

}

if (loading) {
return ( <div className="p-10 text-center">Loading student profile...</div>
);
}

if (!student) {
return ( <div className="p-10 text-center">Student not found</div>
);
}

return ( <div className="space-y-6">
{/* Back */} <Link
     to="/admin/students"
     className="inline-flex items-center gap-2 text-theme-muted hover:text-theme transition"
   > <ArrowLeft size={18} />
Back to Students </Link>

  {/* Hero */}
  <AdminPageHeader
    icon={<User size={30} />}
    title={student.name || 'Student'}
    description="Complete student profile, progress, attendance, and performance analytics."
  />

  {/* Profile Card */}
  <div className="card-theme rounded-3xl p-8 border border-theme shadow-lg">
    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
        {student.photoURL ? (
          <img
            src={student.photoURL?.replace("http://", "https://")}
            alt={student.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black">
            {student.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-3xl font-black">
            {student.name}
          </h2>

          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            student.role === 'admin'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {student.role}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-5 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-theme-muted" />
            <span>{student.email || 'No email'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className="text-theme-muted" />
            <span>{student.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Analytics */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <StatCard
      icon={<GraduationCap size={24} />}
      title="Enrolled Courses"
      value={enrollments.length}
      color="blue"
    />

    <StatCard
      icon={<ClipboardCheck size={24} />}
      title="Attendance"
      value={`${attendanceStats.percentage}%`}
      color="green"
    />

    <StatCard
      icon={<BarChart3 size={24} />}
      title="Test Average"
      value={`${testStats.averagePercentage}%`}
      color="purple"
    />

    <StatCard
      icon={<Award size={24} />}
      title="Certificates"
      value={enrollments.filter((e) => e.certificateUnlocked).length}
      color="yellow"
    />
  </div>

  {/* Courses */}
  <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
    <div className="flex items-center gap-3 mb-5">
      <BookOpen className="text-blue-600" size={22} />
      <h3 className="text-xl font-bold">Enrolled Courses</h3>
    </div>

    {enrollments.length === 0 ? (
      <p className="text-theme-muted">No course enrollments.</p>
    ) : (
      <div className="space-y-4">
        {enrollments.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl border border-theme p-5"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-bold text-lg">
                  {course.courseTitle}
                </h4>
                <p className="text-sm text-theme-muted mt-1">
                  Progress: {course.progress || 0}%
                </p>
              </div>

              {course.certificateUnlocked ? (
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                  <CheckCircle2 size={16} />
                  Certificate Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold">
                  <XCircle size={16} />
                  In Progress
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${course.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

);
}

function StatCard({ icon, title, value, color }) {
const colors = {
blue: 'bg-blue-100 text-blue-700',
green: 'bg-green-100 text-green-700',
purple: 'bg-purple-100 text-purple-700',
yellow: 'bg-yellow-100 text-yellow-700',
};

return ( <div className="card-theme rounded-3xl p-6 border border-theme shadow-sm"> <div className="flex items-center justify-between mb-4">
<div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
{icon} </div> </div>

  <p className="text-theme-muted text-sm font-medium">{title}</p>
  <p className="text-3xl font-black mt-2">{value}</p>
</div>

);
}

export default StudentProfile;
