import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { BrandButton } from "@/components/ui/BrandButton";
import { homeConfig } from "@/config/home";

const Home = () => {
  return (
    <Page>
      {/* Hero Section - Full Viewport, Product-Focused */}
      <Section className="min-h-screen bg-brand-blue flex items-center justify-center py-0">
        <Container size="xl">
          <div className="flex items-center justify-center min-h-screen">
            {/* Large Product Image Placeholder */}
            <div className="w-full max-w-xl aspect-square bg-brand-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <p className="text-brand-white/40 text-small">3D Product Visual</p>
            </div>
          </div>
        </Container>
      </Section>

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
          <h2 className="text-h1 mb-6">
            {homeConfig.experienceSection.heading}
          </h2>
          <p className="text-body text-foreground/70 leading-relaxed">
            {homeConfig.experienceSection.description}
          </p>
        </Container>
      </Section>
    </Page>
  );
};

export default Home;
