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
          <Route path="announcements" element={<Announcements />} />
          <Route path="courses" element={<DashboardCourses />} />
          <Route path="course/:id" element={<CourseDetails />} />
          <Route path="notes" element={<Notes />} />
          <Route path="course/:id/notes" element={<CourseNotes />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/:id" element={<AssignmentDetails />} />
          <Route path="tests" element={<Tests />} />
          <Route path="tests/instructions/:id" element={<TestInstructions /> }/>
          <Route path="tests/:id" element={<TestAttempt />} />
          <Route path="tests/result/:id" element={<TestResult />} />
          <Route path="certificate/:id" element={<Certificate />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
