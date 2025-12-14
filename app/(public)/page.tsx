"use client";
import { ModeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: "Comprehenive Courses",
    description:
      "Access a wide range of carefully created courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive learning",
    description:
      "Engage with interactive content, quizes, and assignments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description:
      "Moniter your progress through detailed analytic and through personalized dashboards",
    icon: "📈",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant comunity of learners and instructors to collaborate and share knowledge",
    icon: "👥",
  },
];

export default function Home() {
  const router = useRouter();
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();
  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-center gap-y-5 text-center">
          <Badge variant={"outline"}>The Gateway To Mastering React</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Go From<br></br> <span className="text-[#FFBE53]">I Know This</span>{" "}
            to <span className="text-[#6CFF7B]">I Built This</span>{" "}
          </h1>
          <p className="max-w-[700px] md:text-xl text-white text-bold">
            Stop consuming. Start creating. Build real projects that get you
            hired.
          </p>

          <Image src="/hero.png" alt="hero" width={300} height={300} />
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
                className: "",
              })}
            >
              Explore courses
            </Link>
            {!session && (
              <Link
                href="/sign-in"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "",
                })}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>
      {/* Courses */}
      <section className="py-20">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
            Stop Just Learning. Start Actually Making.
          </h1>
          <p className=" text-center">
            Stop consuming. Start creating. Build real projects that get you
            hired.
          </p>
        </div>
      </section>
    </div>
  );
}
