import { Page } from "@/components/layout/Page";

const Blog = () => {
  return (
    <Page className="bg-brand-blue">
      <div className="bg-brand-blue pb-16 sm:pb-24">
        <div className="container mx-auto px-4 pt-4 sm:pt-6">
          <h1 className="text-[clamp(2rem,8vw,3rem)] md:text-h1 text-brand-white font-black">Blog</h1>
          <p className="mt-4 mb-8 text-[clamp(0.875rem,3.5vw,1rem)] md:text-body text-brand-white/70 max-w-2xl leading-relaxed">
            Evidence-based nutrition, stories, and playful insights 🥶
          </p>

          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article
                key={i}
                className="border border-brand-white/10 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-40 md:h-48 bg-brand-white/5" />
                <div className="p-4 md:p-6">
                  <p className="text-[clamp(0.625rem,2vw,0.75rem)] md:text-xs font-semibold text-brand-white/70 uppercase tracking-wide">
                    Article {i}
                  </p>
                  <h2 className="mt-2 md:mt-3 text-[clamp(1rem,4vw,1.25rem)] md:text-xl font-semibold text-brand-white leading-tight">
                    Blog post title here
                  </h2>
                  <p className="mt-2 md:mt-3 text-[clamp(0.75rem,3vw,0.875rem)] md:text-sm text-brand-white/60 leading-relaxed">
                    A brief excerpt of the blog post will appear here. This is a placeholder for upcoming content.
                  </p>
                  <button className="mt-3 md:mt-4 text-[clamp(0.75rem,3vw,0.875rem)] md:text-sm font-semibold text-brand-white hover:text-brand-white/70 transition-colors">
                    Read more →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Blog;
