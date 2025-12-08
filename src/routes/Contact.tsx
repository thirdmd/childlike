import { useState } from "react";
import { Page } from "@/components/layout/Page";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ctaPrimaryButtonClassName } from "@/config/ctaStyles";
import { SocialMediaIcons } from "@/components/SocialMediaIcons";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          message,
        });

      if (error) throw error;

      // Clear form
      setName("");
      setEmail("");
      setMessage("");

      // Show success message
      toast({
        title: "Message sent",
        description: "We'll get back to you soon.",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWaitlist(true);

    try {
      const { error } = await supabase
        .from("waitlist_signups")
        .insert({
          email: waitlistEmail,
          source: "website",
        });

      if (error) throw error;

      // Clear form
      setWaitlistEmail("");

      // Show success message
      toast({
        title: "Joined the waitlist",
        description: "We'll email you when we're ready.",
      });
    } catch (error) {
      console.error("Failed to join waitlist:", error);
      toast({
        title: "Join failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  return (
    <Page className="bg-brand-blue">
      <div className="bg-brand-blue pb-16 sm:pb-24">
        <div className="container mx-auto px-4 pt-4 sm:pt-6 ml-4 sm:ml-6">
          <h1 className="text-h1 text-brand-white">Contact Page</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-body text-brand-white/70">
              You can reach out to us through here boy.
            </p>
            <SocialMediaIcons variant="inline" />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={isLoading}
                rows={5}
              />
            </div>
            <button type="submit" disabled={isLoading} className={ctaPrimaryButtonClassName}>
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="mt-12">
            <h2 className="text-h2 text-brand-white">Join the waitlist</h2>
            <p className="mt-2 text-body text-brand-white/70">
              Be the first to know when we launch.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="mt-4 max-w-md space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  required
                  disabled={isSubmittingWaitlist}
                />
              </div>
              <button type="submit" disabled={isSubmittingWaitlist} className={ctaPrimaryButtonClassName}>
                {isSubmittingWaitlist ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Contact;
