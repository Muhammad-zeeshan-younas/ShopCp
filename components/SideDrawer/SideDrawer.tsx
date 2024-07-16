"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { AlignStartVertical, HomeIcon, ShoppingBasket } from "lucide-react";

type SideDrawerProps = {};

export const SideDrawer = React.memo(function SideDrawer({}: SideDrawerProps) {
  const NavLinks = [
    {
      icon: <HomeIcon />,
      name: "Home",
      link: "/",
    },
    {
      icon: <AlignStartVertical />,
      name: "Products",
      link: "/product",
    },
    { icon: <ShoppingBasket />, name: "Best Sellers", link: "/best-sellers" },
  ];
  return (
    <Drawer direction="left">
      <DrawerTrigger className="rounded-full bg-transparent border-transparent sm:hidden hover:bg-secondary/90 text-left">
        <GiHamburgerMenu className="w-5 h-5" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-3xl rubik-wet-paint-regular text-foreground">SHOP.CO</DrawerTitle>
        </DrawerHeader>
        <ul className="grid gap-4 w-full">
          {NavLinks.map((nav) => (
            <li key={nav.name} className="hover:bg-accent">
              <DrawerClose className="flex text-muted-foreground px-6 py-2 items-center gap-3 hover:bg-accent">
                {nav.icon}
                <a className="h-max w-max" href={nav.link}>
                  {nav.name}
                </a>
              </DrawerClose>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
});
