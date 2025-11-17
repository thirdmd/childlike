import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { productsConfig } from "@/config/products";

const Products = () => {
  return (
    <Page>
      <Section className="pt-24">
        <Container size="xl">
          <div className="mb-12">
            <h1 className="text-h1 mb-4">Products</h1>
            <p className="text-body text-foreground/70">
              Engineered nutrition designed for humans.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsConfig.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </Section>
    </Page>
  );
};

export default Products;
