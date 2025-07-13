"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Upload, X, Crop, Check, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";

interface ImageUploaderProps {
  className?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string[];
  maxSize?: number;
  disabled?: boolean;
}

export function ImageUploader({
  onChange,
  className,
  value = null,
  accept = ["image/*"],
  maxSize = 4 * 1024 * 1024,
  disabled = false,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({
    x: 25,
    y: 25,
    size: 50, // For circular crop (percentage)
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Sync with external value
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setFile(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
      setOriginalImage(null);
      setFile(null);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!disabled && acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0];
        setFile(newFile);
        const url = URL.createObjectURL(newFile);
        setOriginalImage(url);
        setPreview(null);
        setIsCropping(true);
      }
    },
    [disabled]
  );

  const clearFile = () => {
    if (!disabled) {
      setFile(null);
      setPreview(null);
      setOriginalImage(null);
      setIsCropping(false);
      onChange(null);
    }
  };

  // Handle image load to get dimensions
  const onImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });

      // Initialize crop area to be centered
      setCrop({
        x: 25,
        y: 25,
        size: 50,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCropping) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isCropping || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const dx = ((e.clientX - dragStart.x) / containerRect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / containerRect.height) * 100;

    setCrop((prev) => {
      let newX = prev.x + dx;
      let newY = prev.y + dy;

      // Boundary checks to keep crop circle within container
      newX = Math.max(0, Math.min(newX, 100 - prev.size));
      newY = Math.max(0, Math.min(newY, 100 - prev.size));

      return {
        ...prev,
        x: newX,
        y: newY,
      };
    });

    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    if (!imageRef.current || !originalImage || !containerRef.current || !file) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const containerRect = container.getBoundingClientRect();
    const imgAspectRatio = imageDimensions.width / imageDimensions.height;
    let displayedWidth, displayedHeight;

    // Calculate displayed dimensions based on object-contain
    if (containerRect.width / containerRect.height > imgAspectRatio) {
      displayedHeight = containerRect.height;
      displayedWidth = displayedHeight * imgAspectRatio;
    } else {
      displayedWidth = containerRect.width;
      displayedHeight = displayedWidth / imgAspectRatio;
    }

    // Calculate scale factors
    const scaleX = imageDimensions.width / displayedWidth;
    const scaleY = imageDimensions.height / displayedHeight;

    // Calculate crop area in original image pixels
    const cropSizePx = (crop.size / 100) * Math.min(displayedWidth, displayedHeight) * Math.min(scaleX, scaleY);
    const cropXPx = (crop.x / 100) * displayedWidth * scaleX;
    const cropYPx = (crop.y / 100) * displayedHeight * scaleY;

    // Set canvas to the size of our circular crop
    canvas.width = cropSizePx;
    canvas.height = cropSizePx;

    // Create circular mask
    ctx.beginPath();
    ctx.arc(cropSizePx / 2, cropSizePx / 2, cropSizePx / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw the cropped portion
    ctx.drawImage(img, cropXPx, cropYPx, cropSizePx, cropSizePx, 0, 0, cropSizePx, cropSizePx);

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const croppedFile = new File([blob], file.name || "cropped-image", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        const previewUrl = URL.createObjectURL(blob);
        setPreview(previewUrl);
        onChange(croppedFile);
        setIsCropping(false);
      },
      "image/jpeg",
      0.9
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: accept ? generateClientDropzoneAccept(accept) : undefined,
    maxSize,
    disabled,
  });

  return (
    <FormControl>
      <div className="space-y-2">
        {!originalImage && !preview && (
          <div
            {...getRootProps()}
            className={cn(
              "group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-2.5 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-900",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
          >
            <input {...getInputProps()} disabled={disabled} />
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="space-y-1">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Image (up to {maxSize / 1024 / 1024}MB)</p>
            </div>
          </div>
        )}

        {isCropping && originalImage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Adjust your photo</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCropping(false);
                    setOriginalImage(null);
                    setFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={applyCrop}>
                  <Check className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>

            <div
              ref={containerRef}
              className="relative h-56 w-full overflow-hidden rounded-md bg-gray-100"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img ref={imageRef} src={originalImage} alt="Original" className="absolute h-full w-full object-fill" onLoad={onImageLoad} />

              {/* Circular crop indicator */}
              <div
                className="pointer-events-none absolute border-3 border-red-200 shadow-[0_0_0_100vmax_rgba(0,0,0,0.3)] in-[[data-slot=cropper]:focus-visible]:ring-[3px] in-[[data-slot=cropper]:focus-visible]:ring-white/50"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.size}%`,
                  height: `${crop.size}%`,
                  borderRadius: "50%",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Move className="h-6 w-6 text-white opacity-50" />
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Drag the image to position it within the circle</p>
            </div>
          </div>
        )}

        {preview && !isCropping && (
          <div className="relative">
            <img src={preview} alt="Preview" className="h-48 w-48 rounded-full object-cover mx-auto" />
            {!disabled && (
              <div className="absolute right-2 top-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setOriginalImage(url);
                      setIsCropping(true);
                    }
                  }}
                >
                  <Crop className="h-4 w-4" />
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </FormControl>
  );
}
