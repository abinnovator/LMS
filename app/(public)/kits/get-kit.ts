import "server-only";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getKit(slug: string) {
  const data = await prisma.kit.findUnique({
    where: {
      slug,
      status: "Published",
    },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescrption: true,
      fileKey: true,
      downloadKey: true,
      category: true,
      slug: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type KitDetailType = Awaited<ReturnType<typeof getKit>>;
