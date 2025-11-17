import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

const FAQ = () => {
  return (
    <Page>
      <Section>
        <Container>
          <h1 className="text-h1">FAQ Page Placeholder</h1>
          <p className="mt-4 text-body text-foreground/70">
            Frequently asked questions will be displayed here.
          </p>
        </Container>
      </Section>
    </Page>
  );
};

export default FAQ;
