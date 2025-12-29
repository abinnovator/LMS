import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import AdminCourseCard from "./_components/AdminCourseCard";

const page = async () => {
  const data = await adminGetCourses();

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {data?.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
};

export default page;
