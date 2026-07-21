import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import {
  Search,
  Users,
  GraduationCap,
  Mail,
  Phone,
  Award,
  CheckCircle2,
  XCircle,
  Edit,
  Shield,
  Trash2,
  Save,
  X,
  Eye,
} from "lucide-react";

import AdminPageHeader from "../../components/admin/AdminPageHeader";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch all users
      const usersSnap = await getDocs(collection(db, "users"));

      const studentUsers = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch courses
      const coursesSnap = await getDocs(collection(db, "courses"));

      const courseList = coursesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(courseList);

      // Fetch enrollments and attendance for each student
      const enrichedStudents = await Promise.all(
        studentUsers.map(async (student) => {
          // Enrollments
          const enrollQuery = query(
            collection(db, "enrollments"),
            where("userId", "==", student.id)
          );

          const enrollSnap = await getDocs(enrollQuery);

          const enrolledCourses = enrollSnap.docs.map((d) => d.data());

          // Attendance
          const attendanceQuery = query(
            collection(db, "attendance"),
            where("studentId", "==", student.id)
          );

          const attendanceSnap = await getDocs(attendanceQuery);

          const attendanceRecords = attendanceSnap.docs.map((d) => d.data());

          const totalAttendance = attendanceRecords.length;

          const presentCount = attendanceRecords.filter(
            (a) => a.status === "Present" || a.status === "Late"
          ).length;

          const attendancePercentage =
            totalAttendance > 0
              ? Math.round((presentCount / totalAttendance) * 100)
              : 0;

          return {
            ...student,
            enrolledCourses,
            courseCount: enrolledCourses.length,
            attendancePercentage,
            totalAttendance,
          };
        })
      );

      setStudents(enrichedStudents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(student) {
    setSelectedStudent(student);

    setEditForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      role: student.role || "student",
    });
  }

  async function saveStudent() {
    if (!selectedStudent) return;

    try {
      setSaving(true);

      await updateDoc(doc(db, "users", selectedStudent.id), {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
      });

      // Update local state
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id ? { ...s, ...editForm } : s
        )
      );

      setSelectedStudent(null);
      alert("User updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(studentId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", studentId));

      setStudents((prev) => prev.filter((s) => s.id !== studentId));

      alert("User deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.email?.toLowerCase().includes(search.toLowerCase());

      const matchesCourse =
        selectedCourse === "all" ||
        student.enrolledCourses.some((c) => c.courseId === selectedCourse);

      return matchesSearch && matchesCourse;
    });
  }, [students, search, selectedCourse]);

  // Stats
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.courseCount > 0).length;
    const certificateEligible = students.filter(
      (s) => s.attendancePercentage >= 75 && s.courseCount > 0
    ).length;

    return {
      totalStudents,
      activeStudents,
      certificateEligible,
    };
  }, [students]);

  if (loading) {
    return <div className="p-10 text-center">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={<Users size={30} />}
        title="Student Management"
        description="Manage enrollments, attendance, and student progress."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-theme-muted text-sm">Total Students</p>
              <p className="text-3xl font-black mt-1">{stats.totalStudents}</p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Users className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-theme-muted text-sm">Active Students</p>
              <p className="text-3xl font-black mt-1">{stats.activeStudents}</p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <GraduationCap className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-theme-muted text-sm">Certificate Eligible</p>
              <p className="text-3xl font-black mt-1">
                {stats.certificateEligible}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Award className="text-purple-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
              size={20}
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-theme bg-theme pl-12 pr-4 py-3"
            />
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-2xl border border-theme bg-theme px-4 py-3"
          >
            <option value="all">All Courses</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="card-theme rounded-3xl border border-theme shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-theme-hover">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">User</th>
                <th className="text-left px-6 py-4 font-semibold">Contact</th>
                <th className="text-center px-6 py-4 font-semibold">Role</th>
                <th className="text-center px-6 py-4 font-semibold">Courses</th>
                <th className="text-center px-6 py-4 font-semibold">
                  Attendance
                </th>
                <th className="text-center px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-theme">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-theme-muted"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-theme-hover transition"
                  >
                    {/* User */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center overflow-hidden">
                          {student.photoURL ? (
                            <img
                              src={student.photoURL}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-bold text-indigo-700">
                              {student.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-lg">
                            {student.name || "Unnamed User"}
                          </p>
                          <p className="text-sm text-theme-muted">
                            ID: {student.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-theme-muted" />
                          <span>{student.email || "No email"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-theme-muted" />
                          <span>{student.phone || "Not provided"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="text-center px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          student.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <Shield size={16} />
                        {student.role === "admin" ? "Admin" : "Student"}
                      </span>
                    </td>

                    {/* Courses */}
                    <td className="text-center px-6 py-5">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg">
                        {student.courseCount}
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="text-center px-6 py-5">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full border-4 border-green-200 flex items-center justify-center">
                          <span className="font-black text-green-700">
                            {student.attendancePercentage}%
                          </span>
                        </div>

                        <span className="text-xs text-theme-muted">
                          {student.totalAttendance} records
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="text-center px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="p-2 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                          title="View Profile"
                        >
                          <Eye size={18} />
                        </Link>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(student)}
                          className="p-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-theme w-full max-w-2xl rounded-3xl p-6 border border-theme shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Edit className="text-blue-600" size={26} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">Edit User</h2>
                  <p className="text-theme-muted text-sm">
                    Manage all user information and permissions
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl hover:bg-theme-hover transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-theme bg-theme px-4 py-3"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full rounded-2xl border border-theme bg-theme px-4 py-3"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full rounded-2xl border border-theme bg-theme px-4 py-3"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  User Role
                </label>

                <div className="relative">
                  <Shield
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
                    size={18}
                  />

                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full rounded-2xl border border-theme bg-theme pl-11 pr-4 py-3"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-theme">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-3 rounded-2xl border border-theme hover:bg-theme-hover transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={saveStudent}
                disabled={saving}
                className="btn-primary px-6 py-3 rounded-2xl flex items-center gap-2 disabled:opacity-50 font-semibold"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudents;
