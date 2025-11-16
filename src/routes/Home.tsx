import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

const Home = () => {
  return (
    <Page>
      <Section>
        <Container>
          <h1 className="text-h1">Home Page Placeholder</h1>
          <p className="mt-4 text-body text-foreground/70">
            This is where the hero section and main content will go.
          </p>
        </Container>
      </Section>
    </Page>
  );
};

export default Home;
