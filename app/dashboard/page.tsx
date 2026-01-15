import React from "react";
import { geteEnrolledCourses } from "../data/user/get-enrolled-courses";
import { getAllCourses } from "../data/course/get-all-courses";
import EmptyState from "@/components/general/EmptyState";
import PublicCourseCard from "../(public)/_components/PublicCourseCard";
import Link from "next/link";
import ProgressCourseCard from "./_components/CourseProgressCard";

const page = async () => {
  const [enrolledCourses, courses] = await Promise.all([
    geteEnrolledCourses(),
    getAllCourses(),
  ]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to.
        </p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You have not purchased any courses yet."
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <ProgressCourseCard key={course.Course.id} data={course} />
          ))}
        </div>
      )}
      <section className="mt-10 space-y-8">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses available.
          </p>
        </div>
        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all the available courses."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
};

export default page;
