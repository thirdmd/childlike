import { useParams, Link } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { BrandButton } from "@/components/ui/BrandButton";
import { getProductBySlug } from "@/config/products";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <Page>
        <Section className="pt-24">
          <Container className="text-center">
            <h1 className="text-h1 mb-4">Product Not Found</h1>
            <p className="text-body text-foreground/70 mb-8">
              The product you're looking for doesn't exist.
            </p>
            <BrandButton variant="outline" href="/products">
              Back to Products
            </BrandButton>
          </Container>
        </Section>
      </Page>
    );
  }

  return (
    <Page>
      <Section className="pt-24">
        <Container size="lg">
          <Link 
            to="/products" 
            className="inline-flex items-center text-small text-foreground/60 hover:text-brand-blue mb-8 transition-colors"
          >
            ← Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-brand-black/5 rounded-lg aspect-square flex items-center justify-center">
              <p className="text-foreground/40 text-small">Product Image</p>
            </div>

            <div>
              <div className="mb-6">
                <span 
                  className={`inline-block text-small px-3 py-1 rounded-full mb-4 ${
                    product.status === "available" 
                      ? "bg-brand-blue text-brand-white" 
                      : "bg-brand-black/5 text-foreground/60"
                  }`}
                >
                  {product.status === "available" ? "Available" : "Coming Soon"}
                </span>
                <h1 className="text-h1 mb-2">{product.name}</h1>
                <p className="text-h3 text-foreground/70 font-normal">{product.tagline}</p>
              </div>

              <p className="text-body text-foreground/70 mb-8">
                {product.description}
              </p>

              <div className="border border-brand-black/10 rounded-lg p-6 mb-8">
                <h3 className="text-h3 mb-4">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-small text-foreground/60">Protein</p>
                    <p className="text-h3">{product.macros.protein}g</p>
                  </div>
                  <div>
                    <p className="text-small text-foreground/60">Carbs</p>
                    <p className="text-h3">{product.macros.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-small text-foreground/60">Fat</p>
                    <p className="text-h3">{product.macros.fat}g</p>
                  </div>
                  <div>
                    <p className="text-small text-foreground/60">Sugar</p>
                    <p className="text-h3">{product.macros.sugar}g</p>
                  </div>
                </div>
              </div>

              <BrandButton 
                variant="primary" 
                href={product.status === "available" ? "/contact" : "/contact"}
                className="w-full sm:w-auto"
              >
                {product.status === "available" ? "Buy Now" : "Join the Waitlist"}
              </BrandButton>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
};

export default ProductDetail;
