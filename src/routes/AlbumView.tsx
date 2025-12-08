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
      {/* Back button - positioned tight to logo */}
      <div className="container mx-auto px-4 py-0">
        <button
          onClick={() => navigate("/gallery?tab=albums")}
          className="flex items-center gap-2 text-brand-white/70 hover:text-brand-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Gallery
        </button>
      </div>

      {/* Main content section */}
      <div className="bg-brand-blue pb-16 sm:pb-24">
        <div className="container mx-auto px-4 pt-4 sm:pt-6 ml-4 sm:ml-6">
          <h1 className="text-h1 text-brand-white">{album.name}</h1>
          <p className="mt-2 mb-8 text-body text-brand-white/70">
            {album.imageCount} {album.imageCount === 1 ? "image" : "images"}
          </p>

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
        </div>
      </div>
    </Page>
  );
};

export default AlbumView;
