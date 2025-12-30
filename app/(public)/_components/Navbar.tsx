"use client";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import AvatarDropdown from "./Avatar";

const Navbar = () => {
  const { data, isPending } = authClient.useSession();

  return (
    <nav className="flex flex-row justify-between items-center px-20 py-4 sticky top-0 backdrop-blur-lg bg-[#020013]/50">
      <div className="flex flex-row gap-4">
        <h1 className="text-bold text-3xl">RM</h1>
      </div>
      <nav className="flex flex-row gap-4 justify-center  text-center items-center">
        <Link href="/">Home</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
      <div className="flex flex-row gap-4">
        {isPending ? (
          <Loader2 className="size-4 text-center justify-center animate-spin" />
        ) : data ? (
          <AvatarDropdown
            userImage={
              data.user.image
                ? data.user.image
                : `https://avatar.vercel.sh/vercel.svg?text=${data.user.name.charAt(0).toUpperCase()}`
            }
          />
        ) : (
          <>
            <Link
              href="/sign-in"
              className={buttonVariants({
                size: "lg",
                className: "hover:shadow-xl w-36 text-black",
              })}
            >
              <span className="font-geist px-4 py-4">
                Login to your account
              </span>
            </Link>
            {/* <Link
              href="/sign-up"
              className={buttonVariants({
                size: "lg",
                className: "hover:shadow-xl",
                variant: "outline",
              })}
            >
              Get Started
            </Link> */}
          </>
        )}
        {/* <ModeToggle /> */}
      </div>
    </nav>
  );
};

export default Navbar;
