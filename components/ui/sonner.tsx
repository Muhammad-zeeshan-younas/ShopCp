"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { useEffect } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.dismiss();
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return <Sonner closeButton={true} {...props} />;
};

export { Toaster };
