import {
  BookOpen,
  FileText,
  ClipboardList,
  Calendar,
} from "lucide-react";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Courses",
      value: "0",
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Lessons",
      value: "0",
      icon: FileText,
      color: "green",
    },
    {
      title: "Tests",
      value: "0",
      icon: ClipboardList,
      color: "purple",
    },
    {
      title: "Upcoming Classes",
      value: "0",
      icon: Calendar,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-theme-muted mt-2">
          Manage courses, lessons, tests, classes and students
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="card-theme rounded-3xl p-6 border border-theme shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-theme-muted text-sm">{stat.title}</p>
                  <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Icon className="text-blue-500" size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-theme rounded-3xl p-6 border border-theme">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary py-3 rounded-2xl">
              + Create Course
            </button>
            <button className="btn-primary py-3 rounded-2xl">
              + Create Test
            </button>
            <button className="btn-primary py-3 rounded-2xl">
              + Schedule Class
            </button>
            <button className="btn-primary py-3 rounded-2xl">
              + Announcement
            </button>
          </div>
        </div>

        <div className="card-theme rounded-3xl p-6 border border-theme">
          <h2 className="text-xl font-bold mb-4">System Status</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Authentication</span>
              <span className="text-green-500 font-semibold">Active</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Firestore</span>
              <span className="text-green-500 font-semibold">Connected</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Code Lab</span>
              <span className="text-green-500 font-semibold">Running</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Exam System</span>
              <span className="text-green-500 font-semibold">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;