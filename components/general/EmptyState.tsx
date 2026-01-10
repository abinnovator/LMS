import { Ban, PlusIcon } from "lucide-react";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
interface iAppProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}
const EmptyState = ({ title, description, buttonText, href }: iAppProps) => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-15">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-6xl font-semibold">{title}</h2>
      <p className="mb-8 text-center text-sm leading-tight">{description}</p>
      <Link href={href} className={buttonVariants({ variant: "outline" })}>
        <PlusIcon />
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;
