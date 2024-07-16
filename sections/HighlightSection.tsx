import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types/Product";
import React from "react";
import { useRouter } from "next/navigation";

type HeighlightSectionProps = {
  items?: Product[];
  title: string;
};

export const HeighlightSection: React.FC<HeighlightSectionProps> = React.memo(function HeighlightSection({ title, items }) {
  const router = useRouter();
  if (!!items?.length) {
    return (
      <div className="py-10 sm:py-14 bg-background px-12 sm:px-16 md:px-24">
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-8 sm:mb-12">{title}</h3>
        <Carousel orientation="horizontal" className="w-full m-auto">
          <CarouselContent>
            {items.map((product: Product, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                <Card
                 className="cursor-pointer"
                  onClick={() => {
                    router.push(`/products/${product.sku}`);
                  }}
                >
                  <CardContent className="grid w-full p-0">
                    <img
                      src={"https://i.pinimg.com/236x/4a/0b/8b/4a0b8b45c38872ebcee989a1ede0235f.jpg"}
                      alt=""
                      className="w-full aspect-square object-cover object-top"
                    />
                  </CardContent>
                  <CardHeader className="px-3 pb-2">
                    <CardTitle> {product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-1 pb-3 px-3">
                    <span className="text-xl font-semibold">$ {product.price}</span>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <Button variant="outline" className="sm:w-max px-14 py-5 m-auto flex items-center justify-center mt-6 w-full">
          View All
        </Button>
      </div>
    );
  }
});

export default HeighlightSection;
