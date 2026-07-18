import {
  CheckCircle2,
  XCircle,
  Percent,
  Flame,
} from "lucide-react";

function AttendanceStats() {

  const stats = [
    {
      title: "Present Days",
      value: 22,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Absent Days",
      value: 2,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Attendance",
      value: "92%",
      icon: Percent,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Current Streak",
      value: "14 Days",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (

    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (

          <div
            key={stat.title}
            className="card-theme rounded-2xl shadow p-5 hover-theme transition"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-theme-muted text-sm">
                  {stat.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stat.value}
                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}
              >

                <Icon
                  size={28}
                  className={stat.color}
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default AttendanceStats;