import { Link } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { BrandButton } from "@/components/ui/BrandButton";
import { homeConfig } from "@/config/home";
import productImage from "@/assets/childlike 3d model.png";

const Home = () => {
  return (
    <Page className="bg-brand-blue overflow-hidden">
      {/* Hero - Full Viewport */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue via-brand-blue to-[hsl(216,100%,30%)]" />

        {/* Floating shadow behind product for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-black/20 rounded-full blur-[120px]" />

        {/* Product container */}
        <Link to="/products/chewy-protein-cookie" className="relative z-10 w-full max-w-2xl px-8 cursor-pointer group">
          <div className="relative aspect-square animate-float">
            {/* Glow effect behind product */}
            <div className="absolute inset-0 bg-brand-white/5 rounded-full blur-3xl scale-110" />

            {/* Product image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={productImage}
                alt="Childlike Protein Cookie"
                className="w-[85%] h-[85%] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </Link>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brand-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-brand-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <Section className="bg-background">
        <Container size="xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeConfig.pillars.map((pillar) => (
              <div key={pillar.id}>
                <h3 className="text-h3 mb-2">{pillar.title}</h3>
                <p className="text-body text-foreground/70">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Experience Section */}
      <Section className="bg-brand-black/5">
        <Container size="md" className="text-center">
          <h2 className="text-h1 mb-6 text-brand-white">{homeConfig.experienceSection.heading}</h2>
          <p className="text-body text-brand-white leading-relaxed">{homeConfig.experienceSection.description}</p>
        </Container>
      </Section>
    </Page>
  );
};

export default Home;
