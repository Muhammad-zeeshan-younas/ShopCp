import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  className?: string;
}

export const ProductGallery = ({ images, className }: ProductGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) goToNext();
    if (touchStart - touchEnd < -50) goToPrevious();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(console.log);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!images.length) {
    return (
      <div
        className={cn(
          "aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-xl flex items-center justify-center",
          "border border-muted-foreground/10",
          className
        )}
      >
        <div className="text-center space-y-2">
          <p className="text-muted-foreground/70">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group w-full",
        isFullscreen
          ? "fixed inset-0 z-50 bg-background p-4 flex flex-col"
          : "",
        className
      )}
    >
      {/* Main Image Container */}
      <div
        className={cn(
          "relative aspect-square w-full rounded-xl overflow-hidden",
          "bg-gradient-to-br from-muted/30 to-muted",
          "border border-muted-foreground/10",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={images[currentIndex]}
          alt={`Product view ${currentIndex + 1}`}
          fill
          className={cn(
            "object-contain transition-transform duration-300 ease-in-out",
            isZoomed ? "scale-150" : "scale-100"
          )}
          priority
          quality={100}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
                "flex items-center justify-center shadow-sm",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "border border-muted-foreground/10",
                "hover:bg-background/90"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
                "flex items-center justify-center shadow-sm",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "border border-muted-foreground/10",
                "hover:bg-background/90"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className={cn(
              "h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm",
              "flex items-center justify-center shadow-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "border border-muted-foreground/10",
              "hover:bg-background/90"
            )}
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? (
              <ZoomOut className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className={cn(
              "h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm",
              "flex items-center justify-center shadow-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "border border-muted-foreground/10",
              "hover:bg-background/90"
            )}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Expand className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div
            className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2",
              "bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full",
              "text-sm font-medium text-foreground shadow-sm",
              "border border-muted-foreground/10"
            )}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - Now takes full width */}
      {showThumbnails && images.length > 1 && (
        <div
          className={cn(
            "mt-4 w-full grid grid-flow-col auto-cols-[minmax(80px,1fr)] gap-3 overflow-x-auto pb-2",
            "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
          )}
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "relative h-20 w-full rounded-lg overflow-hidden",
                "transition-all duration-200 ease-in-out",
                "border-2 aspect-square",
                currentIndex === index
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-muted-foreground/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover"
              />
              {currentIndex === index && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Thumbnail Toggle (Mobile) */}
      {images.length > 1 && (
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          className={cn(
            "lg:hidden mt-2 w-full py-1.5 rounded-md",
            "bg-muted hover:bg-muted/80 transition-colors",
            "text-sm font-medium text-muted-foreground",
            "flex items-center justify-center gap-1"
          )}
        >
          {showThumbnails ? "Hide thumbnails" : "Show thumbnails"}
        </button>
      )}
    </div>
  );
};
