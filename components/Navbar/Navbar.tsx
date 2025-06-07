"use client";
import React, { useState } from "react";
import { SearchComponent } from "../Search";
import { IoCartOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { LogIn, LogOut, UserCog, ShoppingBag, Home, Star } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { SideDrawer } from "../SideDrawer/SideDrawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useUserStore } from "@/Zustand/store/user.store";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PhoneInput } from "../PhoneInput.tsx";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(5, "Invalid phone number"),
  streetAddress: z.string().min(5, "Address too short"),
  city: z.string().min(2, "City name too short"),
  state: z.string().min(2, "State name too short"),
  country: z.string().min(2, "Please select a country"),
});

export const Navbar = React.memo(function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setTheme } = useTheme();
  const { clearUser, user } = useUserStore(); // Zustand action
  const [isSignUp, setIsSignUp] = useState(false);
  const isUserLoggedIn = user;

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
    },
  });

  // Simplified e-commerce navigation links (only essential pages)
  const mainLinks = [
    { name: "Home", link: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: "Shop",
      link: "/products",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    { name: "Sale", link: "/sale", icon: <Star className="w-4 h-4" /> },
  ];

  const accountLinks = [
    {
      name: "Account",
      link: "/account",
      icon: <UserCog className="w-4 h-4" />,
    },
    {
      name: "Orders",
      link: "/orders",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
  ];

  React.useEffect(() => {
    setTheme(darkMode ? "dark" : "light");
  }, [darkMode, setTheme]);

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    try {
      // const response = await fetch("/auth/signin", values);
      // if (response.data.success) {
      //   // Handle successful sign in (e.g., redirect or update state)
      // }
    } catch (error) {}
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    try {
      // const response = await api.post("/auth/signup", values);
      // if (response.data.success) {
      //   // toast({ title: "Account created successfully" });
      //   setIsSignUp(false); // Switch to sign in after successful registration
      // }
    } catch (error) {}
  };

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo and Mobile Menu - visible on all screens */}
        <div className="flex items-center gap-4">
          <SideDrawer
            links={[...mainLinks, ...accountLinks]}
            className="xl:hidden" // Only show hamburger on mobile
          />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground cursor-pointer" onClick={() => router.push("/")}>
            SHOP.CO
          </h2>
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden xl:flex items-center gap-6">
          <ul className="flex gap-4 lg:gap-6">
            {mainLinks.map((nav) => (
              <li key={nav.name}>
                <a
                  className={`flex items-center gap-1 text-sm lg:text-base font-medium transition-colors hover:text-primary ${
                    pathname === nav.link ? "text-primary" : "text-muted-foreground"
                  }`}
                  href={nav.link}
                >
                  {nav.icon}
                  <span className="ml-1">{nav.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <SearchComponent className="hidden sm:flex" />

          <div className="flex items-center gap-2 sm:gap-3">
            <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} className="flex" />

            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={() => router.push("/cart")}>
              <IoCartOutline className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sr-only">Cart</span>
            </Button>

            {!isUserLoggedIn ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <div className="flex border-b">
                    <button
                      className={`flex-1 py-2 font-medium ${!isSignUp ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                      onClick={() => setIsSignUp(false)}
                    >
                      Sign In
                    </button>
                    <button
                      className={`flex-1 py-2 font-medium ${isSignUp ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign Up
                    </button>
                  </div>

                  {!isSignUp ? (
                    <Form {...signInForm}>
                      <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Sign In
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="shopfan123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Address</h4>
                          <FormField
                            control={signUpForm.control}
                            name="streetAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={signUpForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={signUpForm.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="State" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={signUpForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Create Account
                        </Button>
                      </form>
                    </Form>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    {!isSignUp ? (
                      <>
                        Don't have an account?{" "}
                        <button type="button" className="text-primary hover:underline" onClick={() => setIsSignUp(true)}>
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button type="button" className="text-primary hover:underline" onClick={() => setIsSignUp(false)}>
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <DropdownMenuLabel className="text-xs sm:text-sm">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountLinks.map((link) => (
                    <DropdownMenuItem key={link.name} onClick={() => router.push(link.link)} className="cursor-pointer text-xs sm:text-sm">
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 text-xs sm:text-sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});
