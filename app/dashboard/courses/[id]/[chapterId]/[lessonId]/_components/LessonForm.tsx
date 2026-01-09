"use client";
import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CourseSchemaType,
  LessonSchemaType,
  courseSchema,
  lessonSchema,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { startTransition, useTransition } from "react";
import { useForm } from "react-hook-form";
import Editor from "@/components/rich-text-editor/Editor";

interface iAppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}
const LessonForm = ({ data, chapterId, courseId }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      id: data?.id,
      name: data?.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data?.description || undefined,
      thumbnailKey: data?.thumbnailKey || undefined,
      videoKey: data?.videoKey || undefined,
    },
  });
  return (
    <div>
      {/* Back to course button */}
      <Link
        href={`/dashboard/courses/${courseId}/edit`}
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>Configure the video for this lesson</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              {/* title */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Description</FormLabel>
                    <FormControl>
                      <Editor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonForm;
