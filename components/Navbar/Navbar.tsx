"use client";

import React from "react";
import { SearchComponent } from "../Search";
import { IoCartOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, SearchIcon, UserCog } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { SideDrawer } from "../SideDrawer/SideDrawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type NavbarProps = {};

export const Navbar = React.memo(function Navbar({}: NavbarProps) {
  const [darkMode, setDarkMode] = React.useState(false);

  const NavLinks = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Products",
      link: "/product",
    },
    { name: "Best Sellers", link: "/best-sellers" },
  ];
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="bg-background py-4 px-4 sm:px-10 w-full m-auto shadow-md">
      <nav className="flex justify-between items-center text-foreground max-w-[1500px] w-full m-auto">
        <SideDrawer />

        <h2 className="text-3xl rubik-wet-paint-regular text-foreground">SHOP.CO</h2>
        <ul className="sm:flex gap-5 text-base h-9 text-center hidden">
          {NavLinks.map((nav) => (
            <li key={nav.name} className="h-full grid place-items-center text-muted-foreground ">
              <a href={nav.link}>{nav.name}</a>
            </li>
          ))}
        </ul>
        <SearchComponent />

        <div className="flex items-center">
          <Switch
            checked={darkMode}
            onCheckedChange={() => {
              setDarkMode((prevMode) => !prevMode);
            }}
          />

          <Button className="p-1 rounded-full bg-transparent border-transparent lg:hidden" variant="outline">
            <SearchIcon className="w-5 h-5" />
          </Button>
          <Button className="p-1 rounded-full bg-transparent border-transparent" variant="outline">
            <IoCartOutline className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="p-1 rounded-full bg-transparent border-transparent" variant="outline">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-max">
              <DropdownMenuLabel className="flex gap-3 hover:bg-accent">
                <UserCog className="w-5 h-5" />
                Edit Profile
              </DropdownMenuLabel>

              <DropdownMenuLabel className="flex gap-3 hover:bg-accent">
                <LogIn className="w-5 h-5" />
                Sign In
              </DropdownMenuLabel>

              <DropdownMenuLabel className="flex gap-3 hover:bg-accent">
                <LogOut className="w-5 h-5" />
                Sign Out
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  );
});
