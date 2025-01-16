import { SearchIcon } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

type SearchProps = {};

export const SearchComponent: React.FC<SearchProps> = React.memo(function Search({}) {
  return (
    <form className="hidden lg:block">
      <div className="h-7 relative hidden lg:flex items-center justify-center rounded-full flex-grow xl:w-[580px]">
        <SearchIcon className="absolute left-2  h-4 w-4 text-muted-foreground" />

        <Input placeholder="Search" className="pl-8" />
        <button type="submit">
          <i className="lucide-search"></i>
        </button>
      </div>
    </form>
  );
});
