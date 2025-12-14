import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { BrandButton } from "@/components/ui/BrandButton";
import { homeConfig } from "@/config/home";
import { interactiveHoverEffect } from "@/config/interactionStyles";
import productImage from "@/assets/childlike 3d model.png";

const Home = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 8; // pixels from top
      setIsAtTop(window.scrollY <= scrollThreshold);
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <Page className="bg-brand-blue overflow-hidden">
      {/* Hero - Viewport Locked */}
      <section className="relative h-[100svh] md:min-h-screen overflow-hidden md:overflow-visible flex items-center justify-center bg-brand-blue">

        {/* Floating shadow behind product for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-black/20 rounded-full blur-[120px]" />

        {/* Product - Centered in safe zone (between header ~80px and mouse ~60px) */}
        <div className="absolute inset-0 -top-16 bottom-16 md:static flex items-center justify-center">
          <Link to="/products/chewy-protein-cookie" className="relative z-10 w-full max-w-2xl px-8">
            <div className="relative aspect-square animate-float">
              {/* Glow effect behind product */}
              <div className="absolute inset-0 bg-brand-white/5 rounded-full blur-3xl scale-110" />

              {/* Product image */}
              <div className="relative w-full h-full flex items-center justify-center group">
                <img
                  src={productImage}
                  alt="Childlike Protein Cookie"
                  className="w-[85%] h-[85%] object-contain drop-shadow-2xl transition-transform duration-300 ease-in-out md:group-hover:scale-110 group-active:scale-[1.03]"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Mouse icon - Fixed at bottom on mobile, absolute on desktop */}
        <div className={`fixed md:absolute bottom-[calc(env(safe-area-inset-bottom)+12px)] md:bottom-12 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-150 ease-out md:opacity-100 ${isAtTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <div className="w-6 h-10 border-2 border-brand-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-brand-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <Section className="bg-brand-blue py-16 md:py-24">
        <Container size="md" className="text-center">
          <div className="px-5 md:px-0 w-full">
            <h2 className="text-[clamp(1.75rem,8vw,3rem)] md:text-[clamp(2.5rem,5vw,3rem)] mb-6 text-brand-white whitespace-nowrap font-black leading-tight">{homeConfig.experienceSection.heading}</h2>
            <p className="text-[clamp(0.875rem,3.5vw,1.125rem)] md:text-[clamp(0.875rem,1.5vw,1rem)] text-brand-white leading-snug md:whitespace-nowrap font-bold">{homeConfig.experienceSection.description}</p>
          </div>
        </Container>
      </Section>
    </Page>
  );
};

export default Home;
