import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "lucide-react";
import { ProductVO } from "@/utils/parsers";

interface ProductCardProps {
  product: ProductVO;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  return (
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
            {product.discountPercentage && product.discountPercentage > 0 && <Badge className="px-2 py-1">{product.discountPercentage}% OFF</Badge>}
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
  );
}
