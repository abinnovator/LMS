"use client";
import { Button } from "@/components/tiptap-ui-primitive/button";
import React, { useTransition } from "react";
import { enrollInCourse } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { error } from "console";

const EnrollementButton = ({ courseId }: { courseId: string }) => {
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(enrollInCourse(courseId));
      if (error) {
        toast.error("Something Went Wrong. Please try again");
        console.log(error);
        return;
      }
      if (data.status === "success") {
        toast.success("Course Created Successfully");
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }
  return (
    <Button className="w-full" onClick={onSubmit} disabled={isPending}>
      {isPending ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        "Enroll now"
      )}
    </Button>
  );
};

export default EnrollementButton;
