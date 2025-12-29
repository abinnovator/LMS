import "server-only";
import { RequireAdmin } from "./require-admin";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
export async function adminGetCourse(id: string) {
  await RequireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescrption: true,
      category: true,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourse>>;
