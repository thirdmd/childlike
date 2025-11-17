import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { faqConfig } from "@/config/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <Page>
      <Section className="bg-primary">
        <Container size="lg">
          <div className="text-center space-y-4">
            <h1 className="text-h1 text-primary-foreground">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Everything you need to know about Childlike
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <Accordion type="single" collapsible className="space-y-4">
            {faqConfig.items.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-panel border border-border/50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>
    </Page>
  );
};

export default FAQ;
