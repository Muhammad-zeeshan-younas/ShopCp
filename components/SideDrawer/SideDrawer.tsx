"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { cn } from "@/lib/utils";

type SideDrawerProps = {
  links: Array<{
    name: string;
    link: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
};

export const SideDrawer = React.memo(function SideDrawer({
  links,
  className,
}: SideDrawerProps) {
  return (
    <Drawer direction="left">
      <DrawerTrigger
        className={cn(
          "p-2 rounded-md hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <GiHamburgerMenu className="w-5 h-5 text-foreground" />
        <span className="sr-only">Open menu</span>
      </DrawerTrigger>
      <DrawerContent className="h-full top-0 right-auto left-0 w-[300px] max-w-full rounded-none">
        <div className="h-full flex flex-col">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-2xl font-bold text-foreground">
              SHOP.CO
            </DrawerTitle>
          </DrawerHeader>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map((nav) => (
                <li key={nav.name}>
                  <DrawerClose asChild>
                    <a
                      href={nav.link}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md",
                        "text-muted-foreground hover:text-foreground hover:bg-accent",
                        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      {nav.icon && (
                        <span className="[&>svg]:w-5 [&>svg]:h-5">
                          {nav.icon}
                        </span>
                      )}
                      <span className="text-sm font-medium">{nav.name}</span>
                    </a>
                  </DrawerClose>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close Menu
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
});
