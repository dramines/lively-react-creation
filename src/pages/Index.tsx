import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Newsletter } from "../components/Newsletter";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Newsletter />
    </main>
  );
};

export default Index;