import { Page } from "@/components/layout/Page";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { galleryAlbums } from "@/galleryConfig";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AlbumView = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const navigate = useNavigate();

  const album = galleryAlbums.find(
    (a) => a.name === decodeURIComponent(albumName || "")
  );

  if (!album) {
    return (
      <Page className="bg-brand-blue">
        <Section className="bg-brand-blue py-16 sm:py-24">
          <Container>
            <h1 className="text-h1 text-brand-white">Album not found</h1>
            <button
              onClick={() => navigate("/gallery")}
              className="mt-4 text-brand-white hover:text-brand-white/70 transition-colors"
            >
              ← Back to Gallery
            </button>
          </Container>
        </Section>
      </Page>
    );
  }

  return (
    <Page className="bg-brand-blue">
      <Section className="bg-brand-blue py-16 sm:py-24">
        <Container>
          <button
            onClick={() => navigate("/gallery")}
            className="flex items-center gap-2 text-brand-white/70 hover:text-brand-white transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Gallery
          </button>

          <h1 className="text-h1 text-brand-white">{album.name}</h1>
          <p className="mt-2 text-body text-brand-white/70">
            {album.imageCount} {album.imageCount === 1 ? "image" : "images"}
          </p>
        </Container>
      </Section>

      <Section className="bg-brand-blue py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
            {album.images.map((image, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={image.src}
                  alt={image.fileName}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Page>
  );
};

export default AlbumView;
