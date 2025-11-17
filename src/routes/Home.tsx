import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { BrandButton } from "@/components/ui/BrandButton";
import { homeConfig } from "@/config/home";

const Home = () => {
  return (
    <Page>
      {/* Hero Section */}
      <Section className="pt-24 pb-16">
        <Container size="xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-display mb-6">
                {homeConfig.hero.title}
              </h1>
              <p className="text-h3 text-foreground/70 mb-8 font-normal">
                {homeConfig.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <BrandButton variant="primary" href={homeConfig.hero.primaryCtaHref}>
                  {homeConfig.hero.primaryCtaLabel}
                </BrandButton>
                <BrandButton variant="outline" href={homeConfig.hero.secondaryCtaHref}>
                  {homeConfig.hero.secondaryCtaLabel}
                </BrandButton>
              </div>
            </div>
            <div className="bg-brand-black/5 rounded-lg aspect-square flex items-center justify-center">
              <p className="text-foreground/40 text-small">Hero Product Visual</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Pillars Section */}
      <Section className="bg-brand-blue text-brand-white">
        <Container size="xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeConfig.pillars.map((pillar) => (
              <div key={pillar.id}>
                <h3 className="text-h3 mb-2">{pillar.title}</h3>
                <p className="text-body opacity-90">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Experience Section */}
      <Section>
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
