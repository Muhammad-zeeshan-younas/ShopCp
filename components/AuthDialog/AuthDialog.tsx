"use client";
import * as z from "zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/Zustand/store/user.store";
import { useState } from "react";

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

interface AuthDialogProps {
  children: React.ReactNode;
}

export const AuthDialog = ({ children }: AuthDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { setUser } = useUserStore();

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

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    try {
      //   // Mock successful login
      //   setUser({ email: values.email, name: "User" });
      //   setIsDialogOpen(false);
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    try {
      //   // Mock successful registration
      //   setUser({ email: values.email, username: values.username });
      //   setIsSignUp(false);
      //   setIsDialogOpen(false);
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 font-medium ${
              !isSignUp
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 font-medium ${
              isSignUp
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        {!isSignUp ? (
          <Form {...signInForm}>
            <form
              onSubmit={signInForm.handleSubmit(handleSignIn)}
              className="space-y-4"
            >
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
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
            <form
              onSubmit={signUpForm.handleSubmit(handleSignUp)}
              className="space-y-4"
            >
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
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
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
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
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsSignUp(false)}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
