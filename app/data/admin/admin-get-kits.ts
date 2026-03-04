import "server-only";

import { prisma } from "@/lib/prisma";
import { RequireAdmin } from "./require-admin";

export async function adminGetKits() {
  await RequireAdmin();
  const data = await prisma.kit.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescrption: true,
      status: true,
      fileKey: true,
      slug: true,
    },
  });
  return data;
}

export type AdminKitType = Awaited<ReturnType<typeof adminGetKits>>[0];
