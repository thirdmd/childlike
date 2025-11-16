import { useParams } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

const ProductDetail = () => {
  const { slug } = useParams();
  
  return (
    <Page>
      <Section>
        <Container>
          <h1 className="text-h1">Product Detail Placeholder</h1>
          <p className="mt-4 text-body text-foreground/70">
            Product slug: {slug}
          </p>
        </Container>
      </Section>
    </Page>
  );
};

export default ProductDetail;
