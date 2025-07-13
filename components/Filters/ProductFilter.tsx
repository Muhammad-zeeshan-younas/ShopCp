// components/product-filters.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "books", name: "Books" },
  { id: "home", name: "Home & Garden" },
];

export function ProductFilters({ searchParams }: { searchParams: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();

  const updateSearchParams = useDebouncedCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParamsObj);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to first page when filters change
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <Select value={searchParams.sort || ""} onValueChange={(value) => updateSearchParams("sort", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={searchParams.category === category.id}
                onCheckedChange={(checked) => {
                  updateSearchParams("category", checked ? category.id : null);
                }}
              />
              <label htmlFor={category.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={searchParams.price_min || ""}
            onChange={(e) => updateSearchParams("price_min", e.target.value)}
          />
          <Input
            placeholder="Max"
            type="number"
            value={searchParams.price_max || ""}
            onChange={(e) => updateSearchParams("price_max", e.target.value)}
          />
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => router.replace(pathname)}>
        Clear Filters
      </Button>
    </div>
  );
}
