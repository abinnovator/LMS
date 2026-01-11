"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import arcjet, { detectBot, fixedWindow, request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { env } from "process";
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
      max: 5,
      characteristics: ["userId"],
    }),
  ],
});

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await RequireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      userId: session?.user.id as string,
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
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/dashboard/courses");
    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}
