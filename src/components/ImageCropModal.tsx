import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";

interface ImageCropModalProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export const ImageCropModal = ({ image, onCropComplete, onCancel }: ImageCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaChange = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      size,
      size
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/jpeg", 0.9);
    });
  };

  const handleSave = async () => {
    const croppedBlob = await createCroppedImage();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-brand-blue rounded-2xl p-6 max-w-2xl w-full space-y-4">
        <h2 className="text-2xl font-bold text-brand-white">Adjust Profile Picture</h2>

        <div className="relative w-full h-96 bg-brand-white/5 rounded-xl overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-brand-white/60">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-brand-white/20 text-brand-white hover:bg-brand-white/10"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
