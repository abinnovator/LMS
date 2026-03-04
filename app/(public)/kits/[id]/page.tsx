import { getKit } from "../get-kit";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DownloadIcon, PackageIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Params = Promise<{ id: string }>;

const KitPage = async ({ params }: { params: Params }) => {
  const { id: slug } = await params;
  const kit = await getKit(slug);

  const thumbnailUrl = `https://reactmastery.t3.storage.dev/${kit.fileKey}`;
  const downloadUrl = kit.downloadKey
    ? `https://reactmastery.t3.storage.dev/${kit.downloadKey}`
    : null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      {/* Left: main content */}
      <div className="order-1 lg:col-span-2 space-y-8">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailUrl}
            alt={kit.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{kit.title}</h1>
          <p className="text-muted-foreground">{kit.smallDescrption}</p>
          <div className="flex flex-wrap gap-2">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <TagIcon className="size-3" />
              {kit.category}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              Free
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">About this kit</h2>
          <RenderDescription description={kit.description} />
        </div>
      </div>

      {/* Right: download card */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-3xl font-bold text-primary">Free</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">What&apos;s included:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <PackageIcon className="size-4 text-primary" />
                    Source code &amp; assets
                  </li>
                  <li className="flex items-center gap-2">
                    <DownloadIcon className="size-4 text-primary" />
                    Instant download
                  </li>
                </ul>
              </div>

              {downloadUrl ? (
                <Link
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full gap-2",
                  })}
                >
                  <DownloadIcon className="size-4" />
                  Download Kit
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

              <p className="text-center text-xs text-muted-foreground">
                No sign-up required
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KitPage;
