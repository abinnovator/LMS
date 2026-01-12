"use server";

import { RequireAdmin } from "@/app/data/admin/require-admin";

import { prisma } from "@/lib/prisma";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
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

export async function CreateCourse(data: CourseSchemaType) {
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
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }
    await prisma.course.create({
      data: { ...validation.data, userId: session?.user?.id as string },
    });
    return { status: "success", message: "Course created successfully" };
  } catch (e) {
    console.log(e);
    return { status: "error", message: "Failed to create course" };
  }
}
