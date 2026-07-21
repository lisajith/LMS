import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import PublicRoute from "./PublicRoute";

import Home from "../pages/Home";
import About from "../pages/About";
import Courses from "../pages/Courses";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import DashboardCourses from "../pages/DashboardCourses";
import CourseDetails from "../pages/CourseDetails";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/Profile";
import Certificate from "../pages/Certificate";
import Certificates from "../pages/Certificates";
import Notes from "../pages/Notes";
import CourseNotes from "../pages/CourseNotes";
import Announcements from "../pages/Announcements";
import Attendance from "../pages/Attendance";
import Assignments from "../pages/Assignments";
import AssignmentDetails from "../pages/AssignmentDetails";
import Tests from "../pages/Tests";
import TestInstructions from "../pages/TestInstructions";
import TestAttempt from "../pages/TestAttempt";
import TestResult from "../pages/TestResult";
import Practice from "../pages/Practice";
import UpcomingClasses from "../pages/UpcomingClasses";

{/*Admin Imports*/}

import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminLessons from "../pages/admin/AdminLessons";
import AdminAssignments from '../pages/admin/AdminAssignments';
import CreateAssignment from '../pages/admin/CreateAssignment';
import EditAssignment from "../pages/admin/EditAssignment";
import AdminTests from '../pages/admin/AdminTests';
import CreateTest from '../pages/admin/CreateTest';
import EditTest from '../pages/admin/EditTest';
import TestSubmissions from '../pages/admin/TestSubmissions';
import AdminClasses from "../pages/admin/AdminClasses";
import CreateClass from "../pages/admin/CreateClass";
import EditClass from "../pages/admin/EditClass";
import AdminAttendance from "../pages/admin/AdminAttendance";
import AdminStudents from "../pages/admin/AdminStudents";
import StudentProfile from "../pages/admin/StudentProfile";
import AdminAnnouncements from "../pages/admin/AdminAnnouncements";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<Dashboard />} />
          <Route path="courses" element={<DashboardCourses />} />
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="notes" element={<Notes />} />
          <Route path="course/:id/notes" element={<CourseNotes />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="classes" element={<UpcomingClasses />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/:id" element={<AssignmentDetails />} />
          <Route path="tests" element={<Tests />} />
          <Route path="tests/instructions/:id" element={<TestInstructions />} />
          <Route path="tests/attempt/:id" element={<TestAttempt />} />
          <Route path="tests/result/:id" element={<TestResult />} />
          <Route path="practice" element={<Practice />} />
          <Route path="certificate/:id" element={<Certificate />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<Profile />} />

        </Route>
      </Route>

        {/* Admin */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="assignments/create" element={<CreateAssignment />} />
          <Route path="assignments/edit/:id" element={<EditAssignment />} />
          <Route path="tests" element={<AdminTests />} />
          <Route path="tests/create" element={<CreateTest />} />
          <Route path="tests/edit/:id" element={<EditTest />} />
          <Route path="tests/submissions/:id" element={<TestSubmissions />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="classes/create" element={<CreateClass />} />
          <Route path="classes/edit/:id" element={<EditClass />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
        </Route>
    </Routes>
  );
}

export default AppRoutes;
