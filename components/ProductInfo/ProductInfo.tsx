import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/StarRating";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Product } from "@/types/Product";

interface ProductInfoProps {
  product: Product;
  reviewsCount: number;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  size: string;
  setSize: (size: string) => void;
  count: number;
  incrementCount: () => void;
  decrementCount: () => void;
}

export const ProductInfo = ({
  product,
  reviewsCount,
  selectedColor,
  setSelectedColor,
  size,
  setSize,
  count,
  incrementCount,
  decrementCount,
}: ProductInfoProps) => {
  const sizes = ["Small", "Medium", "Large", "X-Large"];
  const colors = ["Slate", "Emerald", "Rose"];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Badge variant="outline" className="text-primary">
          New Arrival
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">{product?.name}</h1>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.ceil(product?.rating || 0)} />
          <span className="text-sm text-muted-foreground">
            ({reviewsCount} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-3xl font-semibold">${product?.price}</p>
        <p className="text-muted-foreground">{product?.description}</p>
      </div>

      <Separator />

      {/* Color Selection */}
      <div className="space-y-3">
        <Label>Color</Label>
        <div className="flex gap-3">
          {colors.map((color) => (
            <Button
              key={color}
              variant={selectedColor === color ? "default" : "outline"}
              size="icon"
              onClick={() => setSelectedColor(color)}
              className={`rounded-full h-10 w-10 ${
                color === "Slate"
                  ? "bg-slate-400"
                  : color === "Emerald"
                  ? "bg-emerald-400"
                  : "bg-rose-400"
              }`}
            >
              {selectedColor === color && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Size Selection */}
      <div className="space-y-3">
        <Label>Size</Label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((currentSize) => (
            <Button
              key={currentSize}
              variant={size === currentSize ? "default" : "outline"}
              onClick={() => setSize(currentSize)}
              className="px-4 py-2"
            >
              {currentSize}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Add to Cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementCount}
            disabled={count <= 1}
            className="rounded-r-none"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 text-center w-12">{count}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={incrementCount}
            className="rounded-l-none"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button className="flex-1">Add to Cart</Button>
      </div>
    </div>
  );
};
