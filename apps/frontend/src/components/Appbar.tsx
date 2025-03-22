import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import ThemeToggle from "./ThemeToggle";
export const Appbar = () => {
  return (
    <div className="flex justify-between items-center p-4  bg-white dark:bg-black" >
      <div>
        <h1>Depin-Pulse</h1>
      </div>

      <div className="flex gap-4">
        <div>
          <ThemeToggle/>
        </div>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};
