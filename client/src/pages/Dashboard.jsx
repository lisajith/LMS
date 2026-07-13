import DashboardLayout from "../components/dashboard/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold">
        Student Dashboard 🎉
      </h1>

      <p className="mt-4 text-gray-600">
        Welcome to your LMS Dashboard.
      </p>

    </DashboardLayout>
  );
}

export default Dashboard;