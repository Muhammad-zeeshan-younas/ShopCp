"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "next-themes";

import { useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserStore } from "@/Zustand/store/user.store";
import { Toaster } from "sonner";
import { useGetCurrentUser } from "@/Queries";

const inter = Inter({ subsets: ["latin"] });
const safeLocalStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            <RootContent>{children}</RootContent>
            <Toaster
              position="top-right"
              closeButton
              toastOptions={{
                classNames: {
                  toast: "!p-4 !rounded-lg !font-medium",
                  success: "!bg-green-500 !text-white",
                  error: "!bg-red-500 !text-white",
                  warning: "!bg-yellow-500 !text-white",
                  info: "!bg-blue-500 !text-white",
                },
              }}
            />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

interface RootContentProps {
  children: React.ReactNode;
}

const RootContent = ({ children }: RootContentProps) => {
  const { setUser, clearUser } = useUserStore();
  const token = safeLocalStorage.getItem("accessToken");
  const { data: user, error } = useGetCurrentUser(token);

  useEffect(() => {
    if (error) {
      safeLocalStorage.removeItem("accessToken");
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }

    const checkTokenExpiration = () => {
      const tokenExpiry = safeLocalStorage.getItem("tokenExpiry");
      if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
        clearUser();
        safeLocalStorage.removeItem("accessToken");
        safeLocalStorage.removeItem("tokenExpiry");
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [clearUser, setUser, user]);
  useEffect(() => {
    // Remove extension-added attributes after mount
    document.body.removeAttribute("cz-shortcut-listen");
  }, []);

  return (
    <div suppressHydrationWarning>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};
