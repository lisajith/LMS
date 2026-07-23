import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Bell,
  FileText,
  ShieldCheck,
  Sparkles,
  Users,
  Trophy,
} from "lucide-react";
import PageReveal from "../components/common/PageReveal";

function About() {
  const features = [
    {
      icon: GraduationCap,
      title: "Interactive Learning",
      description:
        "Engaging lessons, videos, and guided learning paths that make complex concepts easier to understand.",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description:
        "Access notes, reference materials, downloadable resources, and organized course content anytime.",
      color: "green",
    },
    {
      icon: ClipboardCheck,
      title: "Assignments & Tests",
      description:
        "Complete assignments, attempt secure online examinations, and receive instant performance tracking.",
      color: "purple",
    },
    {
      icon: Bell,
      title: "Instant Updates",
      description:
        "Stay informed with real-time announcements, deadlines, class updates, and important notifications.",
      color: "orange",
    },
    {
      icon: FileText,
      title: "Organized Workspace",
      description:
        "Keep lessons, assignments, tests, attendance, and certificates organized in one modern dashboard.",
      color: "pink",
    },
    {
      icon: ShieldCheck,
      title: "Secure Platform",
      description:
        "Cloud-based authentication, protected student data, and reliable access across devices.",
      color: "cyan",
    },
  ];

  return (
    <PageReveal>
      <section className="bg-theme min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-theme bg-theme-secondary px-5 py-2 text-sm font-semibold primary-text mb-6">
              <Sparkles size={16} />
              About SyVA
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-theme">
              Synergy
              <span className="primary-text"> Virtual Academy</span>
            </h1>

            <p className="mt-8 text-xl text-theme-muted leading-9">
              A modern digital learning ecosystem where students, educators, and
              technology work together in{" "}
              <strong className="text-theme">synergy</strong>
              to create a smarter, more connected, and personalized learning
              experience.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-8 mt-20">
            <div className="card-theme rounded-3xl p-8 border border-theme shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <Users className="text-blue-600" size={28} />
              </div>

              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>

              <p className="text-theme-muted leading-8">
                To simplify online education by bringing courses, assessments,
                attendance, announcements, certificates, and progress tracking
                into one seamless platform that empowers every learner to
                succeed.
              </p>
            </div>

            <div className="card-theme rounded-3xl p-8 border border-theme shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                <Trophy className="text-purple-600" size={28} />
              </div>

              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>

              <p className="text-theme-muted leading-8">
                To become a collaborative virtual academy where learning is not
                limited by location, time, or resources, and every student can
                grow beyond traditional boundaries.
              </p>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-24">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-theme">
                Why Students Choose SyVA
              </h2>

              <p className="mt-4 text-lg text-theme-muted max-w-3xl mx-auto">
                Everything needed for a complete academic journey, from
                enrollment to certification, is available in one intelligent
                workspace.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={index}
                    className="group card-theme rounded-3xl p-8 border border-theme shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                        feature.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : feature.color === "green"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : feature.color === "purple"
                              ? "bg-purple-100 dark:bg-purple-900/30"
                              : feature.color === "orange"
                                ? "bg-orange-100 dark:bg-orange-900/30"
                                : feature.color === "pink"
                                  ? "bg-pink-100 dark:bg-pink-900/30"
                                  : "bg-cyan-100 dark:bg-cyan-900/30"
                      }`}
                    >
                      <Icon
                        size={28}
                        className={`${
                          feature.color === "blue"
                            ? "text-blue-600"
                            : feature.color === "green"
                              ? "text-green-600"
                              : feature.color === "purple"
                                ? "text-purple-600"
                                : feature.color === "orange"
                                  ? "text-orange-600"
                                  : feature.color === "pink"
                                    ? "text-pink-600"
                                    : "text-cyan-600"
                        }`}
                      />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 group-hover:primary-text transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-theme-muted leading-7">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand Story */}
          <div className="mt-24 card-theme rounded-4xl p-10 lg:p-14 border border-theme shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-theme-secondary border border-theme px-4 py-2 text-sm font-semibold primary-text mb-6">
                The Meaning Behind SyVA
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-theme">
                Where Learning Meets
                <span className="primary-text"> Synergy</span>
              </h2>

              <p className="text-lg text-theme-muted leading-9">
                The name <strong className="text-theme">SyVA</strong> comes from
                <strong className="text-theme"> Synergy Virtual Academy</strong>
                . Synergy represents the combined power of students, teachers,
                and technology working together to achieve better learning
                outcomes than any of them could achieve alone. SyVA transforms
                education into a connected, collaborative, and growth-oriented
                experience.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-sm font-medium text-theme">
                  Courses
                </span>
                <span className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-sm font-medium text-theme">
                  Exams
                </span>
                <span className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-sm font-medium text-theme">
                  Attendance
                </span>
                <span className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-sm font-medium text-theme">
                  Certificates
                </span>
                <span className="px-4 py-2 rounded-full bg-theme-secondary border border-theme text-sm font-medium text-theme">
                  Progress Tracking
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageReveal>
  );
}

export default About;
