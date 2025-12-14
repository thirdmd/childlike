import { Page } from "@/components/layout/Page";

const FAQ = () => {
  return (
    <Page className="bg-brand-blue">
      <div className="bg-brand-blue pb-16 sm:pb-24">
        <div className="container mx-auto px-4 pt-4 sm:pt-6">
          <h1 className="text-[clamp(2rem,8vw,3rem)] md:text-h1 text-brand-white font-black">FAQs</h1>
          <p className="mt-4 text-[clamp(0.875rem,3.5vw,1rem)] md:text-body text-brand-white/70 leading-relaxed">
            Common Qs
          </p>
        </div>
      </div>
    </Page>
  );
};

export default FAQ;
