function Hero() {
  return (
    <section className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>

            <p className="text-blue-600 font-semibold tracking-wide uppercase">
              Welcome to Our LMS
            </p>

            <h1 className="mt-4 text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight">
              Learn.
              <br />
              Build.
              <br />
              Grow.
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-8">
              Master Python through live classes, real-world projects,
              mentorship, and industry-focused learning that prepares
              you for your career.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button className="bg-blue-600 text-white px-7 py-3 rounded-xl hover:bg-blue-700 transition duration-300">
                🚀 Start Learning
              </button>

              <button className="border border-slate-300 px-7 py-3 rounded-xl hover:bg-white transition duration-300">
                📚 Explore Courses
              </button>

            </div>

            <div className="mt-10 flex items-center gap-3">

              <span className="text-yellow-500 text-xl">
                ⭐⭐⭐⭐⭐
              </span>

              <p className="text-slate-600">
                Trusted by aspiring learners.
              </p>

            </div>

          </div>

          {/* Right Side */}
          <div className="flex justify-center">

            <div className="w-96 h-96 rounded-full bg-blue-200 flex items-center justify-center shadow-2xl">

              <span className="text-8xl">
                👨‍💻
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;