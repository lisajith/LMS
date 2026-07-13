import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";

import instructor from "../../data/instructor";

function Instructor() {
  return (
    <section className="py-24 bg-white">
      <Container>

        <SectionTitle
          badge="Meet Your Instructor"
          title={instructor.name}
          subtitle={instructor.tagline}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}

          <div className="flex justify-center">

            <div className="w-72 h-72 rounded-3xl bg-slate-200 flex items-center justify-center text-7xl">

              blaa

            </div>

          </div>

          {/* Right Side */}

          <div>

            <h3 className="text-3xl font-bold text-slate-800">

              {instructor.role}

            </h3>

            <p className="mt-6 text-slate-600 leading-8">

              {instructor.bio}

            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">

              {instructor.skills.map((skill) => (

                <div
                  key={skill}
                  className="bg-blue-50 rounded-xl p-4 font-medium text-blue-700"
                >

                  ✔ {skill}

                </div>

              ))}

            </div>

            <div className="mt-10">

              <Button>

                Know More

              </Button>

            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}

export default Instructor;