"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";
import { tryCatch } from "@/hooks/try-catch";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { CourseSchemaType, courseSchema } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow, request } from "@arcjet/next";
import { env } from "@/lib/env";

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
