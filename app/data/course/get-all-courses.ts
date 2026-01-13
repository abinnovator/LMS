import "server-only";

import { prisma } from "@/lib/prisma";

export async function getAllCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      title: true,
      price: true,
      smallDescrption: true,
      slug: true,
      fileKey: true,
      id: true,
      level: true,
      duration: true,
      category: true,
    },
  });
  return data;
}
export type CourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
