import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
export async function getCourse(slug: string) {
  const data = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      smallDescrption: true,
      category: true,
      chapter: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export type CourseType = Awaited<ReturnType<typeof getCourse>>;
