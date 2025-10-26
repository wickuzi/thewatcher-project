import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),

  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const watchSchema = z.object({
  name: z.string().trim().min(2).max(100),
  brand: z.string().trim().min(10).max(1000),
  price: z.coerce.number().min(1),
  category: z.string().trim().min(2).max(100),
  rating: z.coerce.number().min(1).max(5),
  availableStock: z.coerce.number().int().positive().lte(10000),
  description: z.string().nonempty(),
  colorTheme: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i),
  imageUrl: z.string().nonempty(),
  summary: z.string().trim().min(10),
  videoUrl: z.string().nonempty(),
});