import { AdminKitType } from "@/app/data/admin/admin-get-kits";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  MoreVerticalIcon,
  PencilIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface iAppProps {
  kit: AdminKitType;
}

const AdminKitCard = ({ kit }: iAppProps) => {
  return (
    <Card className="group relative py-0 gap-0">
      {/* Dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="outline">{kit.status}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Edit */}
            <DropdownMenuItem asChild>
              <Link href={`/admin/kits/${kit.id}/edit`}>
                <PencilIcon className="size-4 mr-2" /> Edit Kit
              </Link>
            </DropdownMenuItem>
            {/* Preview */}
            <DropdownMenuItem asChild>
              <Link href={`/kits/${kit.slug}`}>
                <Eye className="size-4 mr-2" /> Preview Kit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Delete */}
            <DropdownMenuItem asChild>
              <Link href={`/admin/kits/${kit.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" /> Delete Kit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Image */}

      <Image
        src={useConstructUrl(kit.fileKey)}
        alt={kit.title}
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/admin/kits/${kit.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {kit.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {kit.smallDescrption}
        </p>
        {/* Edit Kit Button */}
        <Link
          href={`/admin/kits/${kit.id}/edit`}
          className={cn(
            "flex items-center gap-x-2 w-full mt-4",
            buttonVariants({ variant: "default" })
          )}
        >
          Edit Kit
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
};
export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute  top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className=" w-full rounded-t-lg aspect-video h-[250px] object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="mt-4 h-10 w-full rounded" />
      </CardContent>
    </Card>
  );
}
export default AdminKitCard;
