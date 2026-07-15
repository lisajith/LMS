function UpcomingClass() {
  return (
    <div className="card-theme rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        📅 Upcoming Live Class
      </h2>

      <div className="space-y-4">

        <h3 className="text-xl font-semibold">
          Python Full Stack - Module 4
        </h3>

        <p className="text-theme-muted">
          👨‍🏫 Instructor: baby
        </p>

        <p className="text-theme-muted">
          🗓️ 15 July 2026
        </p>

        <p className="text-theme-muted">
          🕖 7:00 PM
        </p>

        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition">
          🎥 Join Class
        </button>

      </div>

    </div>
  );
}

export default UpcomingClass;