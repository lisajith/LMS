import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

import Badge from "../common/Badge";

function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleStartLearning() {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }

  return (
    <section className="bg-theme">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT */}

          <div>
            <Badge>Synergy Virtual Academy</Badge>

            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight text-theme">
              Learn in
              <span className="primary-text"> Synergy</span>
              <br />
              Grow Beyond
              <span className="primary-text"> Boundaries</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-theme-muted max-w-xl">
              SyVA brings courses, assignments, online examinations,
              announcements, attendance, certificates, and progress tracking
              together in one intelligent virtual learning ecosystem designed
              for students and educators.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-full border border-theme px-4 py-2 bg-theme-secondary">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-theme-muted font-medium">
                  Live Learning Platform
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-theme px-4 py-2 bg-theme-secondary">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse">
                  {" "}
                </div>
                <span className="text-theme-muted font-medium">
                  Secure Online Exams
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-theme px-4 py-2 bg-theme-secondary">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-theme-muted font-medium">
                  Progress & Certificates
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-5">
              <button
                onClick={handleStartLearning}
                className="btn-primary px-7 py-3 rounded-xl flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/courses")}
                className="border border-theme hover-theme px-7 py-3 rounded-xl flex items-center gap-2"
              >
                <BookOpen size={18} />
                Explore Courses
              </button>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            <div className="card-theme rounded-4xl p-10 shadow-2xl border border-theme">
              <h3 className="text-2xl font-bold">Why Students Choose SyVA</h3>

              <p className="mt-2 text-theme-muted">
                A complete virtual academy built around collaboration,
                assessment, and measurable learning outcomes.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-theme-secondary">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                    <GraduationCap className="text-blue-600" size={28} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg">
                      Interactive Courses
                    </h4>

                    <p className="text-theme-muted text-sm">
                      Structured lessons with notes and resources.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-theme-secondary">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                    <ClipboardCheck className="text-green-600" size={28} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg">
                      Assignments & Tests
                    </h4>

                    <p className="text-theme-muted text-sm">
                      Practice your skills with assessments.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-theme-secondary">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                    <BookOpen className="text-purple-600" size={28} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg">Learn Anytime</h4>

                    <p className="text-theme-muted text-sm">
                      Access your learning materials whenever you need.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
