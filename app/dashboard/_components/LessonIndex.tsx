import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/tiptap-utils";
import { CheckIcon, Play } from "lucide-react";
import Link from "next/link";
interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
}
export function LessonItem({ lesson, slug, isActive, completed }: iAppProps) {
  return (
    <div>
      <Link
        href={`/dashboard/${slug}/${lesson.id}`}
        className={buttonVariants({
          variant: completed ? "secondary" : "outline",
          className: cn(
            "w-full p-2.5 h-auto justify-start transition-all",
            completed &&
              "bg-green dark:bg-green-900/30 border-green-300 dark:border=green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-500 dark:text-green-200",
            isActive &&
              !completed &&
              "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary"
          ),
        })}
      >
        <div className="flex items-center gap-2.5 w-full min-w-0 ">
          <div className="shrink-0">
            {completed ? (
              <div
                className={cn(
                  "size-5 rounded-full border-2 bg-green-600 dark:bg-green-500 flex justify-center items-center"
                )}
              >
                <CheckIcon className={cn("size-2.5 text-white")} />
              </div>
            ) : (
              <div
                className={cn(
                  "size-5 rounded-full border-2 bg-background flex justify-center items-center",
                  isActive
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-muted-foreground/60"
                )}
              >
                <Play
                  className={cn(
                    "size-2.5 text-primary",
                    isActive ? "text-primary " : "text=muted-foreground"
                  )}
                />
              </div>
            )}
          </div>
          <div className="flex-1 text-left">
            <p
              className={cn(
                "text-xs font-medium truncate",
                completed
                  ? "text-green-500 dark:text-green-200"
                  : isActive
                    ? "text-priamry font-semibold"
                    : "text-foreground"
              )}
            >
              {lesson.title}
            </p>
            {completed && (
              <p className="text-[10px] text-green-700 dark:text-green-300">
                Completed
              </p>
            )}
            {isActive && !completed && (
              <p className="text-[10px] text-primary dark:text-primary/60">
                In Progress
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
