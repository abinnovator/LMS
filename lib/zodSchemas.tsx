import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseCategories = [
  "Development",
  "Design",
  "Business",
  "Marketing",
  "Finance",
  "It&Software",
  "Personal Development",
  "Health and Fitness",
  "Music",
  "Teaching",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),

  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(100, { message: "Description must be at most 100 characters long" }),

  fileKey: z.string().min(1, { message: "File is required" }),

  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),

  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hours" }),

  level: z.enum(courseLevels),

  category: z.enum(courseCategories),

  smallDescrption: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters long" })
    .max(200, {
      message: "Small description must be at most 200 characters long",
    }),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(50, { message: "Slug must be at most 50 characters long" }),

  status: z.enum(courseStatus),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
