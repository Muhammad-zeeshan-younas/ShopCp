"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUserStore } from "@/Zustand/store/user.store";
import { useModalStore } from "@/Zustand/store/modal.store";
import { useSignInMutation } from "@/mutations";
import { useSignUpMutation } from "@/mutations/useSignupMutation";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignupForm";

interface AuthDialogProps {
  children: React.ReactNode;
}
type SignInFormValues = {
  email: string;
  password: string;
};
// Define the exact type expected by your signUp mutation
type SignUpFormValues = {
  username: string;
  email: string;
  password: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  avatar?: File;
};

export const AuthDialog = ({ children }: AuthDialogProps) => {
  const { modal, closeModal, openModal } = useModalStore((modal) => modal);
  const [isSignUp, setIsSignUp] = useState(false);
  const { setUser } = useUserStore();

  const signIn = useSignInMutation();
  const signUp = useSignUpMutation();

  const handleSignIn = async (values: SignInFormValues) => {
    console.log("signing in ");
    try {
      await signIn.mutateAsync(values, {
        onSuccess: (user) => {
          setUser(user);
          closeModal();
        },
      });
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const handleSignUp = async (values: SignUpFormValues) => {
    console.log("signup is requiredx");
    try {
      if (!values.avatar) {
        console.error("Avatar is required");
        return;
      }

      // Transform the form values to match what your API expects
      const signUpCredentials = {
        email: values.email,
        password: values.password,
        username: values.username,
        avatar: values.avatar,
        address: `${values.streetAddress},${values.city},${values.state},${values.country}`,
        phone: values.phone,
      };

      await signUp.mutateAsync(signUpCredentials, {
        onSuccess: (user) => {
          setUser(user);
          closeModal();
        },
      });
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };

  return (
    <Dialog
      open={modal}
      onOpenChange={(open) => {
        if (!open) closeModal();
        else openModal();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-border/50">
        <div className="flex border-b border-border/50">
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
          <SignInForm onSubmit={handleSignIn} onSwitchToSignUp={() => setIsSignUp(true)} isLoading={signIn.isPending} />
        ) : (
          <SignUpForm onSubmit={handleSignUp} onSwitchToSignIn={() => setIsSignUp(false)} isLoading={signUp.isPending} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
