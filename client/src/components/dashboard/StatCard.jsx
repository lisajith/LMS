function StatCard({ icon, title, value, color }) {
  return (
    <div className="card-theme rounded-2xl shadow-md p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${color}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-slate-500 text-sm font-medium">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold text-theme">
        {value}
      </p>

    </div>
  );
}

export default StatCard;