const activities = [
  {
    id: 1,
    icon: "✅",
    title: "Completed Introduction to Python",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: "📝",
    title: "Submitted Assignment 2",
    time: "Yesterday",
  },
  {
    id: 3,
    icon: "🏆",
    title: "Earned React Certificate",
    time: "3 days ago",
  },
  {
    id: 4,
    icon: "🎯",
    title: "Passed Quiz 1 (95%)",
    time: "Last Week",
  },
];

function RecentActivity() {
  return (
    <div className="card-theme rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        📋 Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex justify-between items-center border-b pb-4 last:border-none"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{activity.icon}</span>

              <p className="font-medium">
                {activity.title}
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {activity.time}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentActivity;