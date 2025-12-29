"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";
import { tryCatch } from "@/hooks/try-catch";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType, courseSchema } from "@/lib/zodSchemas";
import { id } from "zod/v4/locales";

export async function editCourse(
  data: CourseSchemaType,
  id: string
): Promise<ApiResponse> {
  const user = await RequireAdmin();
  try {
    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }
    await prisma.course.update({
      where: {
        id: id,
        userId: user.session.userId,
      },
      data: { ...result.data },
    });
    return { status: "success", message: "Course updated successfully" };
  } catch (error) {
    return { status: "error", message: "Something went wrong" };
  }
}
