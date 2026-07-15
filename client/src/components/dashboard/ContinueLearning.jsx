function ContinueLearning() {
  return (
    <div className="card-theme rounded-2xl shadow-md p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          📚 Continue Learning
        </h2>

        <span className="text-sm text-blue-600 font-semibold">
          75% Completed
        </span>

      </div>

      <h3 className="text-xl font-semibold">
        Python Full Stack Development
      </h3>

      <p className="text-slate-500 mt-2">
        15 of 20 lessons completed
      </p>

      {/* Progress Bar */}

      <div className="w-full h-3 bg-slate-200 rounded-full mt-6 overflow-hidden">

        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: "75%" }}
        ></div>

      </div>

      <button
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
      >
        ▶ Resume Course
      </button>

    </div>
  );
}

export default ContinueLearning;