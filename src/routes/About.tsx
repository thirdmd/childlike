import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { aboutConfig } from "@/config/about";

const About = () => {
  return (
    <Page>
      <Section className="bg-primary">
        <Container size="lg">
          <div className="text-center space-y-4">
            <h1 className="text-h1 text-primary-foreground">
              {aboutConfig.headline}
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              {aboutConfig.subheadline}
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <div className="space-y-16">
            {aboutConfig.sections.map((section, index) => (
              <div 
                key={index}
                className="glass-panel p-8 rounded-lg border border-border/50"
              >
                <h2 className="text-h2 text-foreground mb-4">
                  {section.title}
                </h2>
                <p className="text-body text-foreground/80 leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Page>
  );
};

export default About;
