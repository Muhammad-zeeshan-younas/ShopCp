import { StarRating } from "@/components/StarRating";
import { useCallback } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { ProductVO } from "@/utils/parsers";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useUserStore } from "@/Zustand/store/user.store";
import { canAddToCart } from "@/utils/permissions/permissions";
import { toast } from "sonner";
import { useModalStore } from "@/Zustand/store/modal.store";

interface ProductInfoProps {
  product: ProductVO;
  reviewsCount: number;
  availableColors: string[]; // Hex codes or color names
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  availableSizes: string[];
  size: string;
  setSize: (size: string) => void;
  /* Cart quantity */
  count: number;
  incrementCount: () => void;
  decrementCount: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  reviewsCount,
  availableColors,
  selectedColor,
  setSelectedColor,
  availableSizes,
  size,
  setSize,
  count,
  incrementCount,
  decrementCount,
}) => {
  /* ————————————————————————————————————————————— Pricing helpers */
  const hasDiscount = typeof product.discountPercentage === "number";
  const finalPrice = product.finalPrice ?? 0;
  const originalPrice = product.basePrice ?? finalPrice;
  const { openModal } = useModalStore((modal) => modal);
  const user = useUserStore((state) => state.user);
  /* ————————————————————————————————————————————— Stock helpers */
  const inStock = product.inStock ?? true;
  const totalStock = product.totalStock ?? Infinity;
  const handleAddToCartClick = useCallback(() => {
    if (!canAddToCart(user)) {
      openModal();
    }
  }, [user, openModal]);
  /* ————————————————————————————————————————————— Render */
  return (
    <div className="flex flex-col gap-6">
      {/* ───────────────────────────────── Title */}
      <div className="space-y-2">
        {product.isNew && (
          <Badge variant="outline" className="text-primary border border-border">
            New Arrival
          </Badge>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{product.name}</h1>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(product.rating ?? 0)} />
          <span className="text-sm text-muted-foreground">
            ({reviewsCount} review{reviewsCount === 1 ? "" : "s"})
          </span>
        </div>
      </div>

      {/* ───────────────────────────────── Pricing */}
      <div className="space-y-2">
        <div className="flex items-end gap-3">
          <p className="text-3xl font-semibold text-primary">${finalPrice.toFixed(2)}</p>
          {hasDiscount && <p className="text-lg line-through text-muted-foreground">${originalPrice.toFixed(2)}</p>}
        </div>
        {hasDiscount && (
          <p className="text-sm text-emerald-600">
            Save {product.discountPercentage}% (you save $&quot;
            {(product.discountAmount ?? 0).toFixed(2)}&quot;)
          </p>
        )}
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <Separator />

      {/* ───────────────────────────────── Color selection */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <Label>Color</Label>
          <div className="flex gap-3">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <Button
                  key={color}
                  variant={isSelected ? "default" : "outline"}
                  size="icon"
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                  className="rounded-full h-10 w-10 p-0 border-2 border-muted-foreground/20"
                  style={{ backgroundColor: color }}
                >
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {availableColors.length > 0 && <Separator />}

      {/* ───────────────────────────────── Size selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <Label>Size</Label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((currentSize) => (
              <Button
                key={currentSize}
                variant={size === currentSize ? "default" : "outline"}
                onClick={() => setSize(currentSize)}
                className="px-4 py-2 text-sm"
              >
                {currentSize}
              </Button>
            ))}
          </div>
        </div>
      )}

      {availableSizes.length > 0 && <Separator />}

      {/* ───────────────────────────────── Quantity / Cart */}
      <div className="flex items-center gap-4">
        {/* Quantity picker */}
        <div className="flex items-center  border border-border/50 rounded-md">
          <Button variant="ghost" size="icon" onClick={decrementCount} disabled={count <= 1} className="rounded-r-none">
            <MinusIcon className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 w-12 text-center select-none">{count}</div>
          <Button variant="ghost" size="icon" onClick={incrementCount} disabled={count >= totalStock} className="rounded-l-none">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to cart */}
        <Button onClick={handleAddToCartClick} className="flex-1" disabled={!inStock} aria-disabled={!inStock}>
          {inStock ? "Add to cart" : "Out of stock"}
        </Button>
      </div>
    </div>
  );
};
