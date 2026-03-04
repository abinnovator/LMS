import "server-only";
import { RequireAdmin } from "./require-admin";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function adminGetKit(id: string) {
  await RequireAdmin();

  const data = await prisma.kit.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      downloadKey: true,
      status: true,
      slug: true,
      smallDescrption: true,
      category: true,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminKitDetailType = Awaited<ReturnType<typeof adminGetKit>>;
