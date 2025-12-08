import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

const Blog = () => {
  return (
    <Page className="bg-brand-blue">
      <Section className="bg-brand-blue py-16 sm:py-24">
        <Container>
          <h1 className="text-h1 text-brand-white">Blog</h1>
          <p className="mt-4 text-body text-brand-white/70 max-w-2xl">
          Evidence-based nutrition, stories, and playful insights 🥶.
          </p>
        </Container>
      </Section>

      <Section className="bg-brand-blue py-16 sm:py-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article
                key={i}
                className="border border-brand-white/10 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-brand-white/5" />
                <div className="p-6">
                  <p className="text-xs font-semibold text-brand-white/70 uppercase tracking-wide">
                    Article {i}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-brand-white">
                    Blog post title here
                  </h2>
                  <p className="mt-3 text-sm text-brand-white/60">
                    A brief excerpt of the blog post will appear here. This is a placeholder for upcoming content.
                  </p>
                  <button className="mt-4 text-sm font-semibold text-brand-white hover:text-brand-white/70 transition-colors">
                    Read more →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </Page>
  );
};

export default Blog;
