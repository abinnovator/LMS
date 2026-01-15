"use server";

import { RequireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse> {
  const session = await RequireUser();
  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId: lessonId,
        },
      },
      create: {
        lessonId,
        userId: session.id,
        completed: true,
      },
      update: {
        completed: true,
      },
    });
    revalidatePath(`/dashboard/${slug}`);
    return {
      status: "success",
      message: "Lesson marked as complete",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to mark lesson as complete",
    };
  }
}
