import { Page } from "@/components/layout/Page";

const Blog = () => {
  return (
    <Page className="bg-brand-blue">
      <div className="bg-brand-blue pb-16 sm:pb-24">
        <div className="container mx-auto px-4 pt-4 sm:pt-6 ml-4 sm:ml-6">
          <h1 className="text-h1 text-brand-white">Blog</h1>
          <p className="mt-4 mb-8 text-body text-brand-white/70 max-w-2xl">
            Evidence-based nutrition, stories, and playful insights 🥶
          </p>

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
        </div>
      </div>
    </Page>
  );
};

export default Blog;
