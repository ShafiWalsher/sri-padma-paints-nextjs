import { z } from "zod";

// Define the validation schema for credentials, which we can reuse
export const loginSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(1, { message: "Password is required." }),
});
