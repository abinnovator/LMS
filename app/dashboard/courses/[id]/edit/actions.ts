"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";
import { tryCatch } from "@/hooks/try-catch";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType, courseSchema } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow, request } from "@arcjet/next";
import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 2,
      characteristics: ["userId"],
    }),
  ],
});

export async function editCourse(
  data: CourseSchemaType,
  id: string
): Promise<ApiResponse> {
  const user = await RequireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      userId: user?.user.id as string,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later",
        };
      } else {
        return {
          status: "error",
          message: "Hmmmm. You look like a bot.",
        };
      }
    }
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

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  try {
    if (!lessons || lessons.length === 0 || !chapterId || !courseId) {
      return { status: "error", message: "No lessons provided for reordering" };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,

          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`/dashboard/courses/${courseId}/edit`);
    return { status: "success", message: "Lessons reordered successfully" };
  } catch (error) {
    return { status: "error", message: "Something went wrong" };
  }
}
export async function reorderChapter(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    if (!chapters || chapters.length === 0 || !courseId) {
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`/dashboard/courses/${courseId}/edit`);
    return { status: "success", message: "Chapters reordered successfully" };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}
