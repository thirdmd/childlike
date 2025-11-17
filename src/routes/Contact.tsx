import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

const Contact = () => {
  return (
    <Page>
      <Section>
        <Container>
          <h1 className="text-h1">Contact Page Placeholder</h1>
          <p className="mt-4 text-body text-foreground/70">
            Contact form and waitlist will be displayed here.
          </p>
        </Container>
      </Section>
    </Page>
  );
};

export default Contact;
