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
  subtitle?: string;
  viewAllLink?: string;
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} !flex items-center justify-center h-full w-12 !right-0 before:hidden`} style={{ ...style }} onClick={onClick}>
      <div className="bg-background rounded-full p-1 shadow-lg border flex items-center justify-center hover:bg-accent transition-colors">
        <ChevronRight className="w-6 h-6 text-foreground" />
      </div>
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={`${className} !flex items-center justify-center h-full w-12 !left-0 z-10 before:hidden`} style={{ ...style }} onClick={onClick}>
      <div className="bg-background rounded-full p-1 shadow-lg border flex items-center justify-center hover:bg-accent transition-colors">
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </div>
    </div>
  );
};

const HighlightSection: React.FC<HighlightSectionProps> = React.memo(function HighlightSection({
  title,
  subtitle,
  items,
  viewAllLink = "/products",
}) {
  const router = useRouter();

  if (!items?.length) return null;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <section className="container w-full px-4 py-12 sm:px-6 lg:px-8 ">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2 max-w-xl">{subtitle}</p>}
          </div>
          <button onClick={() => router.push(viewAllLink)} className="text-primary hover:underline font-medium flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative px-1">
          <Slider {...sliderSettings} className="px-1">
            {items.map((product) => (
              <div key={product.sku} className="px-2 pb-2">
                <Card
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-[400px] flex flex-col border border-border/50"
                  onClick={() => router.push(`/products/${product.sku}`)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <CardContent className="p-0 h-full">
                      <Image
                        src={product?.images?.[0] || "/placeholder.svg"}
                        alt={product?.name || "Product image"}
                        fill
                        className="object-cover transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </CardContent>

                    <div className="absolute top-3 right-3 space-y-1">
                      {product.isNew && <Badge className="bg-green-500 hover:bg-green-500 text-white px-2 py-1">New</Badge>}
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <Badge variant="destructive" className="px-2 py-1">
                          {product.discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="px-4 pb-2 pt-4 flex-1">
                    <CardTitle className="text-xl  font-bold truncate">{product.name}</CardTitle>
                    <CardDescription className="text-sm mt-1 line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>

                  <CardFooter className="px-4 pb-4">
                    <div className="w-full">
                      {product.discountPercentage && product.discountPercentage > 0 ? (
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-foreground">${product.finalPrice?.toFixed(2)}</span>
                            <span className="text-sm line-through text-muted-foreground">${product.basePrice?.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            You save ${((product?.basePrice ?? 0) - (product?.finalPrice ?? 0)).toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-foreground">${product.basePrice?.toFixed(2)}</span>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
});

export default HighlightSection;
