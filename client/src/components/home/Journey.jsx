import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import JourneyStep from "./JourneyStep";

import journey from "../../data/journey";

function Journey() {
  return (
    <section className="py-24 bg-slate-50">

      <Container>

        <SectionTitle
          badge="Learning Journey"
          title="Your Path to Success"
          subtitle="Follow a step-by-step learning process designed to help you become industry-ready."
        />

        <div className="space-y-6">
          {journey.map((step) => (
            <JourneyStep
              key={step.title}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

      </Container>

    </section>
  );
}

export default Journey;