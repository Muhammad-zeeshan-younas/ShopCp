"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "sonner";
import { getUser } from "@/serverActions/userActions";
import { useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserStore } from "@/Zustand/store/user.store";

const inter = Inter({ subsets: ["latin"] });

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RootContent>{children}</RootContent>
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

  const retrieveUser = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      clearUser();
      return;
    }

    try {
      const response = await getUser();

      // Ensure required fields are present
      if (!response.id) {
        throw new Error("Invalid user data received");
      }

      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
      clearUser();
      localStorage.removeItem("accessToken");
    }
  }, [setUser, clearUser]);

  useEffect(() => {
    retrieveUser();

    // Optional: Set up token expiration check
    const checkTokenExpiration = () => {
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
        clearUser();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExpiry");
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [retrieveUser, clearUser]);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};
