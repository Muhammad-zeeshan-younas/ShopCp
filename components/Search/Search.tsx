import { SearchIcon } from "lucide-react";
import React from "react";

type SearchProps = {};

export const SearchComponent: React.FC<SearchProps> = React.memo(function Search({}) {
  return (
    <form className="hidden lg:block">
      <div className="h-7 relative hidden lg:flex items-center justify-center rounded-full flex-grow xl:w-[580px]">
        <SearchIcon className="w-5 h-5 absolute left-3 pointer-events-none" />
        <input
          type="text"
          className="w-full px-2 pl-10 border-none rounded-full py-1 bg-accent focus:border-none focus-within:border-none focus-within:ring-ring"
          placeholder="Search for products"
        />
        <button type="submit">
          <i className="lucide-search"></i>
        </button>
      </div>
    </form>
  );
});
