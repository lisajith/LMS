import { Compass } from "lucide-react";
import AllCourses from "./AllCourses";

function ExploreCourses() {
  return (
    <section>

      <div className="flex items-center gap-3 mb-8">

        <Compass
          size={30}
          className="text-blue-600"
        />

        <div>
          <h2 className="text-3xl font-bold text-theme">
            Explore Courses
          </h2>

          <p className="text-slate-500">
            Discover new courses and expand your skills.
          </p>
        </div>

      </div>

      <AllCourses />

    </section>
  );
}

export default ExploreCourses;