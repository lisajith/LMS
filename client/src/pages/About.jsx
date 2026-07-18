import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Bell,
  FileText,
  ShieldCheck,
} from "lucide-react";

function About() {
  return (
    <section className="bg-theme py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <h2 className="text-5xl font-bold text-theme">

            About Our Platform

          </h2>

          <p className="mt-6 text-lg text-theme-muted leading-8">

            Our Learning Management System provides everything a learner
            needs in one place — from interactive courses and study notes
            to assignments, online tests, and important announcements.

          </p>

        </div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          <div className="card-theme rounded-3xl p-8 shadow-lg hover-theme transition">

            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

              <GraduationCap
                className="text-blue-600"
                size={28}
              />

            </div>

            <h3 className="text-2xl font-bold mt-6">

              Interactive Learning

            </h3>

            <p className="mt-4 text-theme-muted leading-7">

              Learn through structured lessons designed to make concepts
              easier to understand and practice.

            </p>

          </div>

          <div className="card-theme rounded-3xl p-8 shadow-lg hover-theme transition">

            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

              <BookOpen
                className="text-green-600"
                size={28}
              />

            </div>

            <h3 className="text-2xl font-bold mt-6">

              Study Resources

            </h3>

            <p className="mt-4 text-theme-muted leading-7">

              Access organized course materials, notes, and reference
              content anytime from your dashboard.

            </p>

          </div>

          <div className="card-theme rounded-3xl p-8 shadow-lg hover-theme transition">

            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">

              <ClipboardCheck
                className="text-purple-600"
                size={28}
              />

            </div>

            <h3 className="text-2xl font-bold mt-6">

              Assignments & Tests

            </h3>

            <p className="mt-4 text-theme-muted leading-7">

              Complete assignments and online assessments while tracking
              your progress throughout the course.

            </p>

          </div>

          <div className="card-theme rounded-3xl p-8 shadow-lg hover-theme transition">

            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">

              <Bell
                className="text-orange-600"
                size={28}
              />

            </div>

            <h3 className="text-2xl font-bold mt-6">

              Instant Updates

            </h3>

            <p className="mt-4 text-theme-muted leading-7">

              Never miss important announcements, deadlines, or learning
              updates from instructors.

            </p>

          </div>

          <div className="card-theme rounded-3xl p-8 shadow-lg hover-theme transition">

            <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center">

              <FileText
                className="text-pink-600"
                size={28}
              />

            </div>

            <h3 className="text-2xl font-bold mt-6">

              Organized Learning

            </h3>

            <p className="mt-4 text-theme-muted leading-7">

              Keep your lessons, assignments, tests, and study materials
              organized in one modern workspace.

            </p>

          </div>

          <div className="card-theme rounded-3xl p-8 shadow-lg hover-theme transition">

            <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">

              <ShieldCheck
                className="text-cyan-600"
                size={28}
              />

            </div>

            <h3 className="text-2xl font-bold mt-6">

              Secure Platform

            </h3>

            <p className="mt-4 text-theme-muted leading-7">

              User authentication and cloud storage ensure your learning
              data remains protected and accessible.

            </p>

          </div>

        </div>

        {/* Bottom Section */}

        <div className="mt-24 card-theme rounded-3xl p-12 text-center shadow-lg">

          <h2 className="text-4xl font-bold">

            Built for Better Learning

          </h2>

          <p className="mt-6 text-lg text-theme-muted max-w-4xl mx-auto leading-8">

            This platform is designed to simplify online education by
            bringing together courses, notes, assignments, tests, and
            announcements into one seamless experience. Whether you're
            learning a new skill or managing your coursework, everything
            you need is just a few clicks away.

          </p>

        </div>

      </div>

    </section>
  );
}

export default About;