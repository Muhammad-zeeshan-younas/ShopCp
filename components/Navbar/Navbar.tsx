"use client";

import React, { useState } from "react";
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
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser, user } from "@/Redux/reducers/slices/userSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AnimatePresence, motion } from "framer-motion";
import CustomDropzone from "../Dropzone/DropZone";
import { signupUser, signinUser } from "../../serverActions/userActions";
import { PhoneInput } from "../PhoneInput.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
type NavbarProps = {};

const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const Navbar = React.memo(function Navbar({}: NavbarProps) {
  const [darkMode, setDarkMode] = React.useState(false);
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();
  const NavLinks = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "Products",
      link: "/product",
    },
    { name: "Best Sellers", link: "/best-sellers" },
  ];
  const { setTheme } = useTheme();
  const [file, setFile] = useState<FileList | null>(null);

  React.useEffect(() => {
    setTheme(darkMode ? "dark" : "light");
  }, [darkMode, setTheme]);
  const userLoggedIn = useSelector(user)?.isLoggedIn;

  const [isSignup, setIsSignup] = useState(false);

  const handleSwitch = () => {
    setIsSignup(!isSignup);
  };

  const handleSignInAndSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
    };

    try {
      if (isSignup) {
        // Validate sign-up form
        signUpSchema.parse(formValues);
        console.log("Sign-up form is valid.");
      } else {
        // Validate sign-in form
        signInSchema.parse(formValues);
        console.log("Sign-in form is valid.", signInSchema.parse(formValues));
        console.log(signInSchema.parse(formValues));
        const response = await signinUser(signInSchema.parse(formValues));
        if (!response) {
          throw new Error("Could not login"); // Use Error for better stack trace
        }
        console.log("logged in successfully");
        dispatch(setUser({ ...response, isLoggedIn: true }));
        console.log("user state setted successfully");
        setIsDialogOpen(false);
      }

      // If validation passes, clear errors
      setErrors({});
      console.log("Form is valid, proceed with submission.");

      // Proceed with API calls, etc.
    } catch (error) {}
  };
  return (
    <div className="bg-background w-full shadow-md py-3">
      <nav className="flex justify-between py- items-center text-foreground container">
        <SideDrawer />

        <h2 className="text-3xl font-bold text-foreground">SHOP.CO</h2>
        <ul className="sm:flex gap-5 text-base h-9 text-center hidden">
          {NavLinks.map((nav) => (
            <li key={nav.name} className="h-full grid place-items-center text-muted-foreground ">
              <a className={`${pathname === nav.link ? "text-primary" : ""}`} href={nav.link}>
                {nav.name}
              </a>
            </li>
          ))}
        </ul>
        <SearchComponent />

        <div className="flex items-center gap-4">
          <Switch
            checked={darkMode}
            onCheckedChange={() => {
              setDarkMode((prevMode) => !prevMode);
            }}
          />

          <Button className="p-1 rounded-full bg-transparent border-transparent lg:hidden" variant="outline">
            <SearchIcon className="w-5 h-5" />
          </Button>
          {!userLoggedIn && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Signin / Signup</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center">{isSignup ? "SIGNUP" : "SIGNIN"}</DialogTitle>
                </DialogHeader>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSignup ? "signup" : "signin"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid gap-6">
                      <form onSubmit={handleSignInAndSignUp}>
                        <div className="grid gap-4">
                          {isSignup && (
                            <>
                              <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="name">
                                  Name
                                </Label>
                                <Input id="name" name="name" placeholder="Username" type="text" autoCapitalize="none" autoCorrect="off" />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                              </div>
                            </>
                          )}

                          <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                              Email
                            </Label>
                            <Input id="email" name="email" autoComplete="off" placeholder="name@example.com" type="email" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                          </div>

                          {isSignup && (
                            <div className="grid gap-1">
                              <PhoneInput defaultCountry="PK" international name="phone" />
                              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>
                          )}

                          <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="password">
                              Password
                            </Label>
                            <Input id="password" name="password" placeholder="Password" type="password" autoCapitalize="none" autoCorrect="off" />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                          </div>

                          {isSignup && <CustomDropzone files={file} setFiles={setFile} />}

                          <Button type="submit">{isSignup ? "Signup" : "Signin"}</Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <DialogFooter>
                  <p className="text-sm text-muted-foreground text-left w-full px-4">
                    {isSignup ? (
                      <>
                        Already have an account?{" "}
                        <button type="button" onClick={handleSwitch} className="underline underline-offset-4 hover:text-primary">
                          Signin
                        </button>
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?{" "}
                        <button type="button" onClick={handleSwitch} className="underline underline-offset-4 hover:text-primary">
                          Signup
                        </button>
                      </>
                    )}
                  </p>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {userLoggedIn && (
            <>
              <Button className="p-1 rounded-full bg-transparent border-transparent" variant="outline">
                <IoCartOutline className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-max">
                  <DropdownMenuLabel className="flex gap-3 hover:bg-accent">
                    <UserCog className="w-5 h-5" />
                    Edit Profile
                  </DropdownMenuLabel>

                  <DropdownMenuLabel className="flex gap-3 hover:bg-accent">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </nav>
    </div>
  );
});
