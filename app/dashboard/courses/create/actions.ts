"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourse(data: CourseSchemaType) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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
