import { prisma } from "@/lib/prisma";
import { RequireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetlesson(id: string) {
  await RequireAdmin();
  const data = prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      id: true,
      position: true,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetlesson>>;
