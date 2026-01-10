"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";

const DeleteCoursePage = () => {
  const [isPending, startTransition] = useTransition();
  const { id } = useParams();
  const router = useRouter();
  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(id as string));
      if (error) {
        toast.error("Something Went Wrong. Please try again");
        return;
      }
      if (data.status === "success") {
        toast.success("Course Deleted Successfully");
        router.push("/dashboard/courses");
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="space-x-4 ">
          <Link
            href={"/dashboard/courses"}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button
            variant={"destructive"}
            className="cursor-pointer"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteCoursePage;
