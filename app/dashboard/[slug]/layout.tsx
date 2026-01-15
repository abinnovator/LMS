import { ReactNode } from "react";
import CourseSidebar from "../_components/CourseSidebar";
import { getSidebarCourseData } from "@/app/data/course/get-sidebar-data";
interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;
  const course = await getSidebarCourseData(slug);
  return (
    <div className="flex flex-1">
      {/* sidebar - 30% */}
      <div className="w-80 border-4 border-border shrink-0">
        <CourseSidebar course={course.course} />
      </div>
      {/* main content - 70% */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
