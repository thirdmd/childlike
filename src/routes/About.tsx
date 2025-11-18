import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

const About = () => {
  return (
    <Page className="bg-brand-blue">
      <Section className="bg-brand-blue">
        <Container>
          <h1 className="text-h1 text-brand-white">About Page Placeholder</h1>
          <p className="mt-4 text-body text-brand-white/70">
            Brand story and mission will be displayed here.
          </p>
        </Container>
      </Section>
    </Page>
  );
};

export default About;
