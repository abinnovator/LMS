import { ModeToggle } from "@/components/theme-toggle";
import { ReactNode } from "react";
import Navbar from "./_components/Navbar";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[url(/Section.png)] bg-no-repeat bg-cover">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8">{children}</main>
    </div>
  );
}
