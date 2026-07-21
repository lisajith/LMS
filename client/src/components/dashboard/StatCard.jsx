function StatCard({ icon, title, value, color }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-theme bg-theme p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Glow background */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${color}`}
      ></div>

      {/* Top Row */}
      <div className="relative flex items-center justify-between">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${color}`}
        >
          <div className="text-white">{icon}</div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-theme-hover flex items-center justify-center opacity-70 group-hover:opacity-100 transition">
          <svg
            className="w-5 h-5 text-theme-muted group-hover:text-theme transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H9M17 7V15"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative mt-6">
        <p className="text-sm font-medium text-theme-muted tracking-wide uppercase">
          {title}
        </p>

        <div className="flex items-end gap-2 mt-3">
          <h3 className="text-4xl font-black text-theme leading-none">
            {value}
          </h3>
        </div>
      </div>

      {/* Bottom accent */}
      <div className={`absolute bottom-0 left-0 h-1 w-full ${color}`}></div>
    </div>
  );
}

export default StatCard;
