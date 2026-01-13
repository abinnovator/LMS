import "server-only";

import { prisma } from "@/lib/prisma";
import { RequireAdmin } from "./require-admin";

export async function adminGetCourses() {
  await RequireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescrption: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });
  return data;
}
export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
