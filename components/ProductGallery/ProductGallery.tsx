import { Button } from "@/components/ui/button"; // (optional—remove if unused elsewhere)
import { ChevronLeft, ChevronRight, Expand, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  className?: string;
}

export const ProductGallery = ({ images, className }: ProductGalleryProps) => {
  /* ─────────────────────────────── state ─────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  /* ───────────────────── navigation helpers (click / touch) ────────────────── */
  const goToPrevious = useCallback(() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)), [images.length]);

  const goToNext = useCallback(() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)), [images.length]);

  const goToImage = (index: number) => setCurrentIndex(index);

  /* ───────────────────────────── touch swipe ──────────────────────────── */
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) goToNext();
    if (touchStart - touchEnd < -50) goToPrevious();
  };

  /* ─────────────────────────── keyboard support ───────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToNext, goToPrevious]);

  /* ─────────────────────────── fullscreen toggle ──────────────────────── */
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(console.log);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  /* ─────────────────────────────── empty state ────────────────────────── */
  if (!images.length) {
    return (
      <div
        className={cn(
          "aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-xl flex items-center justify-center",
          "border border-muted-foreground/10",
          className
        )}
      >
        <p className="text-muted-foreground/70">No images available</p>
      </div>
    );
  }

  /* ───────────────────────────── component UI ─────────────────────────── */
  return (
    <div className={cn("relative group w-full", isFullscreen ? "fixed inset-0 z-50 bg-background p-4 flex flex-col" : "", className)}>
      {/* ────────────────────── main image container ────────────────────── */}
      <div
        className={cn(
          // Fixed height per breakpoint, instead of aspect-square
          "relative w-full h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px]",
          "rounded-xl overflow-hidden",
          "bg-gradient-to-br from-muted/30 to-muted",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
          "border border-muted-foreground/10"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={images[currentIndex]}
          alt={`Product view ${currentIndex + 1}`}
          fill
          priority
          quality={100}
          className={cn("object-contain transition-transform duration-300 ease-in-out", isZoomed ? "scale-150" : "scale-100")}
        />

        {/* ◀ / ▶ navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
                "flex items-center justify-center shadow-sm",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "border border-muted-foreground/10 hover:bg-background/90"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
                "flex items-center justify-center shadow-sm",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "border border-muted-foreground/10 hover:bg-background/90"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* zoom / fullscreen controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <button
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className={cn(
              "h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm",
              "flex items-center justify-center shadow-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "border border-muted-foreground/10 hover:bg-background/90"
            )}
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>
          <button
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className={cn(
              "h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm",
              "flex items-center justify-center shadow-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "border border-muted-foreground/10 hover:bg-background/90"
            )}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </button>
        </div>

        {/* image counter */}
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

      {/* ───────────────────────── thumbnail strip ──────────────────────── */}
      {showThumbnails && images.length > 1 && (
        <div
          className={cn(
            "mt-4 w-full",
            // responsive column width + smooth scroll
            "grid grid-flow-col",
            "auto-cols-[minmax(80px,1fr)] sm:auto-cols-[minmax(100px,1fr)] md:auto-cols-[minmax(120px,1fr)] lg:auto-cols-[minmax(140px,1fr)]",
            "gap-3 overflow-x-auto pb-2",
            "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
          )}
        >
          {images.map((image, index) => (
            <button
              key={index}
              aria-label={`View image ${index + 1}`}
              onClick={() => goToImage(index)}
              className={cn(
                // taller thumbnails on md / lg screens
                "relative h-20 sm:h-24 md:h-28 lg:h-32 w-full rounded-lg overflow-hidden",
                "border-2 aspect-square transition-all duration-200 ease-in-out",
                currentIndex === index ? "border-primary shadow-md" : "border-transparent hover:border-muted-foreground/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              {currentIndex === index && <div className="absolute inset-0 bg-primary/10" />}
            </button>
          ))}
        </div>
      )}

      {/* ──────────────────── mobile thumbnail toggle button ─────────────── */}
      {images.length > 1 && (
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          className={cn(
            "lg:hidden mt-2 w-full py-1.5 rounded-md",
            "bg-muted hover:bg-muted/80 transition-colors",
            "text-sm font-medium text-muted-foreground flex items-center justify-center gap-1"
          )}
        >
          {showThumbnails ? "Hide thumbnails" : "Show thumbnails"}
        </button>
      )}
    </div>
  );
};
