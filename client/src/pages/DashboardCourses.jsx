import { useState } from "react";
import { FolderOpen } from "lucide-react";

import MyCourses from "../components/dashboard/MyCourses";
import ExploreCourses from "../components/dashboard/ExploreCourses";

function DashboardCourses() {
  const [activeTab, setActiveTab] = useState("my");

  return (
    <section>

      <div className="flex items-center gap-3 mb-8">

        <FolderOpen
          size={50}
          className="text-blue-600"
        />

        <p className="text-4xl font-bold">
          Courses
        </p>

      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">

        <button
          onClick={() => setActiveTab("my")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            activeTab === "my"
              ? "bg-blue-600 text-white"
              : "card-theme border"
          }`}
        >
          My Courses
        </button>

        <button
          onClick={() => setActiveTab("explore")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            activeTab === "explore"
              ? "bg-blue-600 text-white"
              : "card-theme border"
          }`}
        >
          Explore Courses
        </button>

      </div>

      {activeTab === "my" ? <MyCourses /> : <ExploreCourses />}

    </section>
  );
}

export default DashboardCourses;