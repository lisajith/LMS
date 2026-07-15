import { useAuth } from "../../context/AuthContext";

function DashboardHero() {
  const { user, userData } = useAuth();

  return (
    <section className="card-theme rounded-2xl shadow-md p-8">

      <h1 className="text-3xl font-bold">
        👋 Welcome Back,
        <span className="text-blue-600">
          {" "}
          {userData?.displayName || "Student"}
        </span>
      </h1>

      <p className="mt-3 text-theme-muted">
        Ready to continue your learning journey today?
      </p>

    </section>
  );
}

export default DashboardHero;