"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";
import { tryCatch } from "@/hooks/try-catch";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import {
  ChapterSchemaType,
  CourseSchemaType,
  LessonSchemaType,
  chapterSchema,
  courseSchema,
  lessonSchema,
} from "@/lib/zodSchemas";
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
    revalidatePath(`/admin/courses/${courseId}/edit`);
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
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { status: "success", message: "Chapters reordered successfully" };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}
export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const result = chapterSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: result.error.message };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: { courseId: values.courseId },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      await tx.chapter.create({
        data: {
          title: result.data.title,
          courseId: result.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    return { status: "success", message: "Chapter created successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Something went wrong" };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: result.error.message };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: { chapterId: values.chapterId },
        orderBy: { position: "desc" },
        select: { position: true },
      });
      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
          chapterId: result.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    return { status: "success", message: "Lesson created successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Something went wrong" };
  }
}

export async function deleteLesson(
  chapterId: string,
  courseId: string,
  lessonId: string
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!chapterWithLessons) {
      return { status: "error", message: "Chapter not found" };
    }
    const lessons = chapterWithLessons.lessons;
    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);
    if (!lessonToDelete) {
      return { status: "error", message: "Lesson not found" };
    }
    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);
    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      });
    });
    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({ where: { id: lessonId, chapterId: chapterId } }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Lesson deleted successfully" };
  } catch {
    return { status: "error", message: "Failed to delete lesson" };
  }
}

export async function deleteChapter(
  chapterId: string,
  courseId: string
): Promise<ApiResponse> {
  await RequireAdmin();
  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapter: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!courseWithChapters) {
      return { status: "error", message: "Course not found" };
    }

    const chapters = courseWithChapters.chapter;
    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (!chapterToDelete) {
      return { status: "error", message: "Chapter not found" };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: { id: chapterId, courseId: courseId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Chapter deleted successfully" };
  } catch (error) {
    console.error("Delete chapter error:", error);
    return { status: "error", message: "Failed to delete chapter" };
  }
}
