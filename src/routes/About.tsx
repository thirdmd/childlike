import { Page } from "@/components/layout/Page";

const About = () => {
  return (
    <Page className="bg-brand-blue">
      <div className="bg-brand-blue pb-16 sm:pb-24">
        <div className="container mx-auto px-4 pt-4 sm:pt-6 ml-4 sm:ml-6">
          <h1 className="text-h1 text-brand-white">About</h1>
          <p className="mt-4 text-body text-brand-white/70">
            Why are you geh?
          </p>
        </div>
      </div>
    </Page>
  );
};

export default About;
