import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-theme flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] lg:text-[220px] font-black leading-none select-none bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
            404
          </h1>

          {/* Floating icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-theme border border-theme shadow-2xl flex items-center justify-center animate-bounce">
              <Search className="text-blue-600" size={36} />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card-theme rounded-3xl border border-theme shadow-2xl p-8 sm:p-10 backdrop-blur-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-theme mb-4">
            Oops! Page Not Found
          </h2>

          <p className="text-theme-muted text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            The page you’re looking for may have been moved, deleted, or the
            URL might be incorrect. Don’t worry — let’s get you back to SyVa.
          </p>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-theme hover:bg-theme-hover transition-all duration-300 hover:-translate-y-1 font-semibold text-theme"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Home size={20} />
              Dashboard
            </button>
          </div>

          {/* Helpful links */}
          <div className="pt-6 border-t border-theme">
            <p className="text-sm text-theme-muted mb-3">
              Popular destinations
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-theme hover:bg-theme-hover transition text-sm font-medium"
              >
                Courses
              </button>

              <button
                onClick={() => navigate("/dashboard/tests")}
                className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-theme hover:bg-theme-hover transition text-sm font-medium"
              >
                Tests
              </button>

              <button
                onClick={() => navigate("/dashboard/profile")}
                className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-theme hover:bg-theme-hover transition text-sm font-medium"
              >
                Profile
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-theme-muted">
          Error 404 • SyVa Learning Management System
        </p>
      </div>
    </div>
  );
}

export default NotFound;