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
  brand: z.string().trim().min(2).max(1000), // Reduced min length
  price: z.coerce.number().min(1),
  cost: z.coerce.number().min(0).default(0), // Costo del producto
  category: z.string().trim().min(2).max(100),
  rating: z.coerce.number().min(1).max(5).default(3),
  availableStock: z.coerce.number().int().min(0).default(0),
  description: z.string().min(1, "La descripción es requerida"),
  imageUrl: z.string().min(1, "La imagen es requerida"),
  summary: z.string().trim().min(10, "El resumen debe tener al menos 10 caracteres"),
  videoUrl: z.string().min(1, "Video URL is required"),});

