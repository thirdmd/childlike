import { Page } from "@/components/layout/Page";
import { galleryImages, galleryAlbums } from "@/galleryConfig";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"feed" | "albums">(
    (searchParams.get("tab") as "feed" | "albums") || "feed"
  );
  const navigate = useNavigate();

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  return (
    <Page className="bg-brand-blue">
      <div className="bg-brand-blue pb-16 sm:pb-24">
        <div className="container mx-auto px-4 pt-4 sm:pt-6 ml-4 sm:ml-6">
          <h1 className="text-h1 text-brand-white">Gallery</h1>
          <p className="mt-4 text-body text-brand-white/70 max-w-2xl">
            Snapshots from the road—unfiltered, unexpected, and oddly charming 🗿
          </p>

          {/* Tabs */}
          <div className="mt-8 mb-8 flex gap-4 border-b border-brand-white/20">
            <button
              onClick={() => setActiveTab("feed")}
              className={`pb-3 px-2 text-lg font-semibold transition-colors relative ${
                activeTab === "feed"
                  ? "text-brand-white"
                  : "text-brand-white/50 hover:text-brand-white/70"
              }`}
            >
              Feed
              {activeTab === "feed" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("albums")}
              className={`pb-3 px-2 text-lg font-semibold transition-colors relative ${
                activeTab === "albums"
                  ? "text-brand-white"
                  : "text-brand-white/50 hover:text-brand-white/70"
              }`}
            >
              Albums
              {activeTab === "albums" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-white" />
              )}
            </button>
          </div>
          {activeTab === "feed" ? (
            // Feed View: All images in masonry layout
            galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                {galleryImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
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
            ) : (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <p className="text-body text-brand-white font-semibold">
                    No images yet
                  </p>
                  <p className="mt-2 text-sm text-brand-white/60">
                    Create a folder under src/assets/Gallery/ and add images to get started
                  </p>
                </div>
              </div>
            )
          ) : (
            // Albums View: Grid of album cards
            galleryAlbums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryAlbums.map((album) => (
                  <button
                    key={album.name}
                    onClick={() => navigate(`/gallery/${encodeURIComponent(album.name)}`)}
                    className="group text-left rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-brand-white/10 hover:border-brand-white/30"
                  >
                    {album.coverImage ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={album.coverImage}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-brand-white/5 flex items-center justify-center">
                        <p className="text-brand-white/40">No images</p>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-brand-white">
                        {album.name}
                      </h3>
                      <p className="mt-1 text-sm text-brand-white/60">
                        {album.imageCount} {album.imageCount === 1 ? "image" : "images"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <p className="text-body text-brand-white font-semibold">
                    No albums yet
                  </p>
                  <p className="mt-2 text-sm text-brand-white/60">
                    Create folders under src/assets/Gallery/ to organize your images into albums
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Page>
  );
};

export default Gallery;
