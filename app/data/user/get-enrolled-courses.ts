import "server-only";
import { RequireUser } from "./require-user";
import { prisma } from "@/lib/prisma";

export async function geteEnrolledCourses() {
  const user = await RequireUser();
  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      Course: {
        select: {
          id: true,
          title: true,
          slug: true,
          fileKey: true,
          smallDescrption: true,
          level: true,
          duration: true,
          category: true,
          chapter: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return data;
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof geteEnrolledCourses>
>[0];
