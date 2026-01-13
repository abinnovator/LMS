import "server-only";

import { prisma } from "@/lib/prisma";
import { RequireAdmin } from "./require-admin";

export async function adminGetDasboardStats() {
  await RequireAdmin();
  const [totalUsers, totalEnrollments, totalCourses, totalLessons] =
    await Promise.all([
      // Total Users
      prisma.user.count(),
      // Total Enrollments
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),
      // Total Courses
      prisma.course.count(),

      // Total Lessons
      prisma.lesson.count(),
    ]);
  return {
    totalUsers,
    totalEnrollments,
    totalCourses,

    totalLessons,
  };
}
