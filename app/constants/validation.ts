import { z } from "zod";

export const signUpSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    
})

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;