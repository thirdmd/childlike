import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { contactConfig } from "@/config/contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { submitContactMessage, joinWaitlist } from "@/lib/contact";
import { BrandButton } from "@/components/ui/BrandButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
});

const waitlistFormSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;
type WaitlistFormData = z.infer<typeof waitlistFormSchema>;

const Contact = () => {
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const waitlistForm = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onContactSubmit = async (data: ContactFormData) => {
    setIsSubmittingContact(true);
    try {
      const result = await submitContactMessage({
        name: data.name,
        email: data.email,
        message: data.message
      });
      
      if (result.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        contactForm.reset();
      } else {
        toast.error(result.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("We're having trouble saving your message right now. Please try again later.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const onWaitlistSubmit = async (data: WaitlistFormData) => {
    setIsSubmittingWaitlist(true);
    try {
      const result = await joinWaitlist({ email: data.email, source: "contact_page" });
      
      if (result.success) {
        toast.success("You're on the list! We'll be in touch soon.");
        waitlistForm.reset();
      } else {
        toast.error(result.error || "Failed to join waitlist. Please try again.");
      }
    } catch (error) {
      toast.error("We're having trouble saving your email right now. Please try again later.");
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  return (
    <Page>
      <Section className="bg-primary">
        <Container size="lg">
          <div className="text-center space-y-4">
            <h1 className="text-h1 text-primary-foreground">
              {contactConfig.headline}
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {contactConfig.description}
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-panel p-8 rounded-lg border border-border/50">
              <h2 className="text-h3 text-foreground mb-2">
                {contactConfig.contactSection.title}
              </h2>
              <p className="text-body text-foreground/70 mb-6">
                {contactConfig.contactSection.description}
              </p>

              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...contactForm.register("name")}
                    placeholder="Your name"
                    disabled={isSubmittingContact}
                  />
                  {contactForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {contactForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    {...contactForm.register("email")}
                    placeholder="your@email.com"
                    disabled={isSubmittingContact}
                  />
                  {contactForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {contactForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    {...contactForm.register("message")}
                    placeholder="Tell us what's on your mind..."
                    rows={5}
                    disabled={isSubmittingContact}
                  />
                  {contactForm.formState.errors.message && (
                    <p className="text-sm text-destructive">
                      {contactForm.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <BrandButton 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmittingContact}
                >
                  {isSubmittingContact ? "Sending..." : "Send Message"}
                </BrandButton>
              </form>
            </div>

            {/* Waitlist Form */}
            <div className="glass-panel p-8 rounded-lg border border-border/50">
              <h2 className="text-h3 text-foreground mb-2">
                {contactConfig.waitlistSection.title}
              </h2>
              <p className="text-body text-foreground/70 mb-6">
                {contactConfig.waitlistSection.description}
              </p>

              <form onSubmit={waitlistForm.handleSubmit(onWaitlistSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="waitlist-email">Email</Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    {...waitlistForm.register("email")}
                    placeholder="your@email.com"
                    disabled={isSubmittingWaitlist}
                  />
                  {waitlistForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {waitlistForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <BrandButton 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmittingWaitlist}
                >
                  {isSubmittingWaitlist ? "Joining..." : "Join Waitlist"}
                </BrandButton>
              </form>

              <div className="mt-6 pt-6 border-t border-border/30">
                <p className="text-sm text-foreground/60">
                  Questions? Email us at{" "}
                  <a 
                    href={`mailto:${contactConfig.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {contactConfig.contactEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
};

export default Contact;
