import FeatureCard from "./FeatureCard";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

import features from "../../data/features";

function Features() {
  return (
    <section className="py-24 bg-theme">

      <Container>

        <SectionTitle
          badge="Why Choose Us"
          title="Why Learn With Us?"
          subtitle="Learn practical skills through live classes, real projects, personal mentorship, and industry-focused training."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

      </Container>

    </section>
  );
}

export default Features;