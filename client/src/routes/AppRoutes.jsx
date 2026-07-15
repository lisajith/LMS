import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import DashboardLayout from "../components/dashboard/DashboardLayout"

import Home from "../pages/Home";
import About from "../pages/About";
import Courses from "../pages/Courses";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import DashboardCourses from "../pages/DashboardCourses"
import CourseDetails from "../pages/CourseDetails"
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/Profile";
import Certificate from "../pages/Certificate";
import Certificates from "../pages/Certificates";

function AppRoutes() {
  return (
      <Routes>
        <Route element={<MainLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<DashboardCourses />} />
            <Route path="course/:id" element={<CourseDetails />} />
            <Route path="certificate/:id" element={<Certificate />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile" element={<Profile />} />
          </Route>

        </Route>

      </Routes>
  );
}

export default AppRoutes;