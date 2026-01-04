import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { PrismaClient } = await import("@/lib/generated/prisma");
    const prisma = new PrismaClient();

    await prisma.$connect();
    await prisma.$disconnect();

    return NextResponse.json({
      status: "ok",
      nodeVersion: process.version,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
