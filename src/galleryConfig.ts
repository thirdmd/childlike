/**
 * Centralized Gallery Configuration
 *
 * This file automatically discovers all images under src/assets/Gallery/
 * and groups them by folder (album/category).
 *
 * To add a new album:
 * 1. Create a new folder under src/assets/Gallery/<AlbumName>
 * 2. Add images to that folder
 * 3. Done! The album will automatically appear in the UI
 *
 * Supported formats: .jpg, .jpeg, .png, .webp, .gif
 */

export interface GalleryImage {
  src: string;
  fileName: string;
  album: string;
  uploadedAt: Date;
}

export interface Album {
  name: string;
  coverImage: string | null;
  imageCount: number;
  images: GalleryImage[];
}

// Dynamically import all images from Gallery subfolders
const imageModules = import.meta.glob<{ default: string }>(
  "/src/assets/Gallery/**/*.{jpg,jpeg,png,webp,gif}",
  { eager: true }
);

// Process and group images by album (folder name)
function processGalleryImages(): { images: GalleryImage[]; albums: Album[] } {
  const imagesMap = new Map<string, GalleryImage[]>();
  const rootImages: GalleryImage[] = [];

  // Process each image
  Object.entries(imageModules).forEach(([path, module]) => {
    // Extract album name from path
    // Path format: /src/assets/Gallery/AlbumName/image.jpg (subfolder) or /src/assets/Gallery/image.jpg (root)
    const pathParts = path.split("/");
    const galleryIndex = pathParts.findIndex((part) => part === "Gallery");

    if (galleryIndex === -1) {
      // Skip images not in Gallery folder
      return;
    }

    const fileName = pathParts[pathParts.length - 1];

    // Check if this is a root-level image or subfolder image
    if (galleryIndex === pathParts.length - 2) {
      // Root-level image: /src/assets/Gallery/image.jpg
      // Include in feed, but don't create an album
      const image: GalleryImage = {
        src: module.default,
        fileName,
        album: "root", // Mark as root
        uploadedAt: new Date(),
      };
      rootImages.push(image);
    } else {
      // Subfolder image: /src/assets/Gallery/AlbumName/image.jpg
      const albumName = pathParts[galleryIndex + 1];
      const image: GalleryImage = {
        src: module.default,
        fileName,
        album: albumName,
        uploadedAt: new Date(),
      };

      // Group by album
      if (!imagesMap.has(albumName)) {
        imagesMap.set(albumName, []);
      }
      imagesMap.get(albumName)!.push(image);
    }
  });

  // Convert to albums array (only from subfolders, not root)
  const albums: Album[] = Array.from(imagesMap.entries()).map(
    ([albumName, images]) => ({
      name: albumName,
      coverImage: images[0]?.src || null,
      imageCount: images.length,
      images: images.sort(
        (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
      ),
    })
  );

  // Get all images sorted by uploadedAt (for Feed view)
  // Include both root images and subfolder images
  const allImages = [
    ...rootImages,
    ...Array.from(imagesMap.values()).flat(),
  ].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

  return { images: allImages, albums };
}

// Export processed data
const { images, albums } = processGalleryImages();

export const galleryImages = images;
export const galleryAlbums = albums;
