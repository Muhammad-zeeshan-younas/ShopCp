"use client";
import { SearchIcon, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/debouncer";

interface SearchProps {
  className?: string;
  variant?: "default" | "expanded";
}

export const SearchComponent: React.FC<SearchProps> = React.memo(
  function Search({ className = "", variant = "default" }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(searchQuery, 500);

    // Handle search when query changes
    useEffect(() => {
      if (debouncedQuery.trim()) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", debouncedQuery);
        router.push(`/search?${params.toString()}`);
      } else if (searchParams.has("q")) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        router.push(`/search?${params.toString()}`);
      }
    }, [debouncedQuery, router, searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      inputRef.current?.blur();
    };

    const clearSearch = () => {
      setSearchQuery("");
      if (searchParams.has("q")) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        router.push(`/search?${params.toString()}`);
      }
      inputRef.current?.focus();
    };

    return (
      <form
        onSubmit={handleSubmit}
        className={`relative ${
          variant === "expanded" ? "w-full" : ""
        } ${className}`}
      >
        <div
          className={`
        relative flex items-center 
        ${
          variant === "expanded"
            ? "w-full"
            : "w-[200px] md:w-[300px] lg:w-[400px]"
        }
        rounded-full border transition-all duration-200
        ${isFocused ? "border-primary ring-2 ring-primary/20" : "border-input"}
      `}
        >
          <SearchIcon
            className={`
          absolute left-3 h-4 w-4 
          ${isFocused ? "text-primary" : "text-muted-foreground"}
          transition-colors duration-200
        `}
          />

          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            className={`
            pl-10 pr-8 py-5 border-0 bg-transparent
            ${variant === "expanded" ? "text-base" : "text-sm"}
            focus-visible:ring-0 focus-visible:ring-offset-0
          `}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search products"
          />

          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 h-6 w-6 rounded-full"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </Button>
          )}
        </div>
      </form>
    );
  }
);
