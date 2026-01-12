import { adminGetlesson } from "@/app/data/admin/admin-get-lesson";
import React from "react";
import LessonForm from "./_components/LessonForm";

type Params = Promise<{ id: string; chapterId: string; lessonId: string }>;
const page = async ({ params }: { params: Params }) => {
  const { lessonId, id } = await params;
  const lesson = await adminGetlesson(lessonId);

  return (
    <div>
      <LessonForm data={lesson} chapterId={lessonId} courseId={id} />
    </div>
  );
};

export default page;
