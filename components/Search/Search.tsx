import { SearchIcon } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

type SearchProps = {};

export const SearchComponent: React.FC<SearchProps> = React.memo(function Search({}) {
  return (
    <form className="hidden lg:block">
      <div className="h-7 relative hidden lg:flex items-center justify-center rounded-full flex-grow xl:w-[580px]">
        <SearchIcon className="w-5 h-5 absolute left-3 pointer-events-none" />

        <input
          type="text"
          className="w-full pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search for products"
        />
        <button type="submit">
          <i className="lucide-search"></i>
        </button>
      </div>
    </form>
  );
});
