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

            <Badge>
              Learning Management System
            </Badge>

            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight text-theme">

              Modern Learning

              <br />

              Made

              <span className="primary-text">

                {" "}Simple

              </span>

            </h1>

            <p className="mt-8 text-lg leading-8 text-theme-muted max-w-xl">

              Access courses, complete assignments, attempt online tests,
              read announcements, manage notes and track your learning —
              everything in one modern platform.

            </p>

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

              <h3 className="text-2xl font-bold">

                Platform Features

              </h3>

              <p className="mt-2 text-theme-muted">

                Everything you need to learn efficiently.

              </p>

              <div className="mt-10 space-y-5">

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-theme-secondary">

                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

                    <GraduationCap
                      className="text-blue-600"
                      size={28}
                    />

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

                    <ClipboardCheck
                      className="text-green-600"
                      size={28}
                    />

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

                    <BookOpen
                      className="text-purple-600"
                      size={28}
                    />

                  </div>

                  <div>

                    <h4 className="font-semibold text-lg">

                      Learn Anytime

                    </h4>

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