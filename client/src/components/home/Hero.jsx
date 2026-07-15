import Badge from "../common/Badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>

            <Badge>
              🔥LIVE PYTHON BATCH
            </Badge>

            <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-theme leading-tight">
              Learn<span className="text-3xl">...</span>
              <br />
              Build<span className="text-3xl">...</span>
              <br />
              Grow<span className="text-3xl">...</span>
            </h1>

            <p className="mt-6 text-lg text-theme-muted leading-8">
              Master Python through live classes, real-world projects,
              mentorship, and industry-focused learning that prepares
              you for your career.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={handleStartLearning}
                className="btn-primary text-white px-7 py-3 rounded-xl transition duration-300"
              >
                🚀 Start Learning
              </button>

              <button className="border border-theme hover-theme text-theme px-7 py-3 rounded-xl transition duration-300">
                📚 Explore Courses
              </button>

            </div>

            <div className="mt-10 flex items-center gap-3">

              <span className="text-theme-muted text-xl">
                ⭐⭐⭐⭐⭐
              </span>

              <p className="text-theme-muted">
                Trusted by aspiring learners.
              </p>

            </div>

          </div>

          {/* Right Side */}
          <div className="flex justify-center">

            <div className="w-96 h-96 rounded-full flex items-center justify-center shadow-2xl" style={{background:"color-mix(in srgb,var(--primary) 20%,white)"}}>

              <span className="text-8xl">
                blaa
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;