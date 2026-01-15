import { getLessonContent } from "@/app/data/course/get-lesson-content";
import React, { Suspense } from "react";
import CourseContent from "./_components/CourseContent";
import LessonSkeleton from "./_components/LessonSkeleton";

type Params = Promise<{ lessonId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { lessonId } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
};

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);
  return <CourseContent data={data} />;
}

export default page;
