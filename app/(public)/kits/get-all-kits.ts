import "server-only";

import { prisma } from "@/lib/prisma";

export async function getAllKits() {
  const data = await prisma.kit.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescrption: true,
      slug: true,
      fileKey: true,
      downloadKey: true,
      category: true,
    },
  });
  return data;
}

export type KitType = Awaited<ReturnType<typeof getAllKits>>[0];
