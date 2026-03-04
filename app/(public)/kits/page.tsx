import { getAllKits, KitType } from "./get-all-kits";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DownloadIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

export default function KitsPage() {
  return (
    <div className="min-h-screen mt-5 space-y-5">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Free Resource Kits
        </h1>
        <p className="text-muted-foreground">
          Download free source code, Figma designs, CSS files, and more to
          accelerate your learning.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderKits />
      </Suspense>
    </div>
  );
}

async function RenderKits() {
  const kits = await getAllKits();

  if (kits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageIcon className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">No kits available yet</h2>
        <p className="text-muted-foreground mt-1">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kits.map((kit) => (
        <KitCard key={kit.id} kit={kit} />
      ))}
    </div>
  );
}

function KitCard({ kit }: { kit: KitType }) {
  const thumbnail = `https://reactmastery.t3.storage.dev/${kit.fileKey}`;
  const downloadUrl = kit.downloadKey
    ? `https://reactmastery.t3.storage.dev/${kit.downloadKey}`
    : null;

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 left-2 z-10">{kit.category}</Badge>
      <Link href={`/kits/${kit.slug}`}>
        <Image
          src={thumbnail}
          alt={kit.title}
          width={600}
          height={400}
          className="w-full rounded-t-lg aspect-video h-full object-cover"
        />
      </Link>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {kit.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-1">
            {kit.smallDescrption}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Free
          </Badge>
        </div>
        {downloadUrl ? (
          <Link
            href={`/kits/${kit.slug}`}
            className={buttonVariants({
              variant: "default",
              className: "w-full gap-2",
            })}
          >
            <DownloadIcon className="size-4" />
            View &amp; Download
          </Link>
        ) : (
          <div
            className={buttonVariants({
              variant: "outline",
              className: "w-full opacity-50 cursor-not-allowed",
            })}
          >
            Coming Soon
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="py-0 gap-0">
          <Skeleton className="w-full rounded-t-lg aspect-video" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
