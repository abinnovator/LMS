import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Your Courses</h1>
        <Link href="/dashboard/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>
      <div className="">
        <h1>Here you will see all of your courses</h1>
      </div>
    </>
  );
};

export default page;
