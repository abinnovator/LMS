import { getCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { CheckIcon, ChevronDownIcon, School } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CheckIfCourseBoughtBy } from "@/app/data/user/user-is-enrolled";
import Link from "next/link";
import EnrollementButton from "./_components/EnrollementButton";
type Params = Promise<{ slug: string }>;

const CoursePage = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  console.log("Fetching course for slug:", slug);
  let course;
  try {
    course = await getCourse(slug);
    console.log("Course fetched successfully:", course?.id);
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }

  console.log("Checking enrollment for course:", course.id);
  let isEnrolled = false;
  try {
    isEnrolled = await CheckIfCourseBoughtBy(course.id);
    console.log("Enrollment checked:", isEnrolled);
  } catch (error) {
    console.error("Error checking enrollment:", error);
    // Don't crash the page if enrollment check fails, just assume false?
    // Or throw if critical. Let's log and let it bubble for now to match 500 behavior.
  }
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={`https://reactmastery.t3.storage.dev/${course.fileKey}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.title}
            </h1>
            <p className="text-muted-foreground">{course.smallDescrption}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <School className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration}h</span>
            </Badge>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Course Description</h2>
            <div>
              <RenderDescription description={course.description} />
            </div>
          </div>
          <Separator className="my-8" />

          <div className="mt-12 space-y-6 w-full">
            <div className="flex items-center justify-between ">
              <h2 className="text-3xl font-semibold  tracking-tight">
                Course Content
              </h2>
              <div>
                {course.chapter.length} chapters |{" "}
                {course.chapter.reduce(
                  (total, chapter) => total + chapter.lessons.length,
                  0
                )}{" "}
                Lessons
              </div>
            </div>
            <div className="space-y-6">
              {course.chapter.map((chapter, index) => (
                <Collapsible key={chapter.id} defaultOpen={index === 0}>
                  <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                    <CollapsibleTrigger>
                      <div>
                        <CardContent className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              <p className="flex size-10 items-center justify-center rounded-full bg-primary ">
                                {index + 1}.
                              </p>
                              <div className="flex items-center">
                                <h3 className="text-xl font-semibold text-center">
                                  {chapter.title}
                                </h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className="text-xs" variant={"outline"}>
                                {chapter.lessons.length} Lesson
                                {chapter.lessons.length !== 1 ? "s" : ""}
                              </Badge>
                              <ChevronDownIcon />
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-5 bg-muted/20 ">
                        <div className="p-6 pt-4 space-y-3">
                          {chapter.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent"
                            >
                              <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-muted">
                                <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-priamry transition-colors" />
                                {/* <p>{lesson.title}</p> */}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {lesson.title}
                                </p>
                                <p className="text-xs mt-1">
                                  Lesson {lessonIndex + 1}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Enrollement Card */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div
                className="flex items-center justify-between mb cl
              -6"
              >
                <span className="text-lg font-medium">Price: </span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(course.price)}
                </span>
              </div>
              {/* What you will get */}
              <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                <h4 className="font-medium">What you will get:</h4>
                <div className="flex flex-col gap-3">
                  {/* Duration */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {course.duration}h
                      </p>
                    </div>
                  </div>
                  {/* Level */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Level</p>
                      <p className="text-sm text-muted-foreground">
                        {course.level}
                      </p>
                    </div>
                  </div>
                  {/* Category */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconCategory className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {course.category}
                      </p>
                    </div>
                  </div>
                  {/* Total Lessons */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Lessons</p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapter.reduce(
                          (total, chapter) => total + chapter.lessons.length,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Features */}
              <div className="mb-6 space-y-3">
                <h4>This course includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-2">
                      <CheckIcon className="size-3 " />
                    </div>
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-2">
                      <CheckIcon className="size-3 " />
                    </div>
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-2">
                      <CheckIcon className="size-3 " />
                    </div>
                    <span>Cerificate of completion</span>
                  </li>
                </ul>
              </div>
              {/* <Button className="w-full">Enroll now</Button> */}
              {isEnrolled ? (
                <Link
                  href="/admin"
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full",
                  })}
                >
                  Go to dashboard
                </Link>
              ) : (
                <EnrollementButton courseId={course.id} />
              )}

              <p className="mt-3 text-center text-xs text-muted-foreground">
                30 day money back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
