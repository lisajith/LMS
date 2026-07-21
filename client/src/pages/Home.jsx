import PageReveal from "../components/common/PageReveal";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";
import Instructor from "../components/home/Instructor";
import Journey from "../components/home/Journey";

function Home() {
  return (
    <PageReveal>
      <Hero />
      <Features />
      <Journey />
      <Instructor />
    </PageReveal>
  );
}

export default Home;