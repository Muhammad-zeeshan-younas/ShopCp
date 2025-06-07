import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductVO } from "@/utils/parsers";

type HighlightSectionProps = {
  items?: ProductVO[];
  title: string;
  viewAllLink?: string;
};

// Custom arrow components
const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} !flex items-center justify-center h-full w-12 !right-0 before:hidden`} style={{ ...style }} onClick={onClick}>
      <ChevronRight className="w-8 h-8 text-foreground bg-background/80 hover:bg-background rounded-full p-1 shadow-md border" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} !flex items-center justify-center h-full w-12 !left-0 z-10 before:hidden`} style={{ ...style }} onClick={onClick}>
      <ChevronLeft className="w-8 h-8 text-foreground bg-background/80 hover:bg-background rounded-full p-1 shadow-md border" />
    </div>
  );
};

const HighlightSection: React.FC<HighlightSectionProps> = React.memo(function HighlightSection({ title, items, viewAllLink = "/products" }) {
  const router = useRouter();

  if (!items?.length) return null;

  const sliderSettings = {
    // Keep all your original slider settings exactly as they were
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      // Keep your original responsive settings
    ],
  };

  return (
    <section className="bg-background w-full px-4 sm:px-8 py-8">
      {/* Keep your original heading */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
      </div>

      <div className="relative">
        <Slider {...sliderSettings} className="px-2">
          {items.map((product) => (
            <div key={product.sku} className="px-2">
              <Card
                className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full"
                onClick={() => router.push(`/products/${product.sku}`)}
              >
                <div className="relative">
                  <CardContent className="p-0 aspect-square">
                    <Image
                      src={product?.images?.[0] || ""}
                      alt={product?.name || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </CardContent>

                  {/* ONLY ADDED BADGES HERE - PRESERVED POSITIONING */}
                  <div className="absolute top-2 right-2 space-y-1">
                    {product.isNew && (
                      <Badge variant="secondary" className="animate-pulse">
                        New
                      </Badge>
                    )}
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <Badge variant="destructive">{product.discountPercentage}% OFF</Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="px-4 pb-2 pt-4">
                  <CardTitle className="truncate">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>

                <CardFooter className="px-4 pb-4">
                  {/* MODIFIED PRICE DISPLAY ONLY */}
                  {product.discountPercentage && product.discountPercentage > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">${product.finalPrice?.toFixed(2)}</span>
                      <span className="text-sm line-through text-gray-500">${product.basePrice?.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold">${product.basePrice?.toFixed(2)}</span>
                  )}
                </CardFooter>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
});

export default HighlightSection;
