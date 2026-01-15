"use client";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface iAppProps {
  data: EnrolledCourseType;
}

const ProgressCourseCard = ({ data }: iAppProps) => {
  const thumbnail = useConstructUrl(data.Course.fileKey);
  const { progressPercentage, completedLessons, totalLessons } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useCourseProgress({ courseData: data.Course as any });
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.Course.level}</Badge>

      <Image
        src={thumbnail}
        alt="Thumbnail"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/courses/${data.Course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.Course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.Course.smallDescrption}
        </p>
        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress:</p>
            <p>{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} />
          <p className="text-xs text-muted-foreground">
            {completedLessons}/{totalLessons} Lessons
          </p>
        </div>
        <Link
          href={`/dashboard/${data.Course.slug}`}
          className={buttonVariants({
            variant: "default",
            className: "w-full mt-4",
          })}
        >
          Access Course
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProgressCourseCard;

export function ProgressCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex itesm-center">
        <Skeleton className="h-6 w-20 rounded-full " />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-4 items-center flex gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md " />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md " />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <Skeleton className="mt-4 rounded-md w-full h-10" />
      </CardContent>
    </Card>
  );
}
