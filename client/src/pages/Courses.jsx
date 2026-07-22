import { FolderOpen } from "lucide-react";
import AllCourses from "../components/dashboard/AllCourses";
import PageReveal from "../components/common/PageReveal";

function Courses() {
  return (
    <PageReveal>
    <section className="max-w-7xl mx-auto px-6 py-16 bg-theme min-h-screen">

      <div className="flex items-center gap-3 mb-10">

        <FolderOpen
          size={46}
          className="primary-text"
        />

        <h1 className="text-4xl font-bold text-theme">
          Courses
        </h1>

      </div>

      <AllCourses />

    </section>
    </PageReveal>
  );
}

export default Courses;