import {z} from "zod"

export const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber:z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });