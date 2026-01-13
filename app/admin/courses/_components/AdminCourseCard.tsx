import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
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
  ArrowLeft,
  ArrowRight,
  Eye,
  MoreVerticalIcon,
  PencilIcon,
  School,
  TimerIcon,
  Trash,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface iAppProps {
  course: AdminCourseType;
}

const AdminCourseCard = ({ course }: iAppProps) => {
  return (
    <Card className="group relative py-0 gap-0">
      {/* Dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="outline">{course.status}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Edit */}
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <PencilIcon className="size-4 mr-2" /> Edit Course
              </Link>
            </DropdownMenuItem>
            {/* Preview */}
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.slug}`}>
                <Eye className="size-4 mr-2" /> Preview Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Delete */}
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" /> Delete
                Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Image */}

      <Image
        src={useConstructUrl(course.fileKey)}
        alt={course.title}
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${course.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {course.smallDescrption}
        </p>
        <div className="flex mt-4 items-center gap-x-5">
          {/* Duration */}
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">
              {course.duration} Hours
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.level}</p>
          </div>
        </div>
        {/* Edit Course Button */}
        <Link
          href={`/admin/courses/${course.id}/edit`}
          className={cn(
            "flex items-center gap-x-2 w-full",
            buttonVariants({ variant: "default" })
          )}
        >
          Edit Course
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
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded" />
      </CardContent>
    </Card>
  );
}
export default AdminCourseCard;
