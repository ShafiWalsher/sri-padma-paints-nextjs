import { z } from "zod";
import { loginSchema } from "@/schemas/auth-schemas";
import axioInstance from "@/lib/axios";

// Define the type for the credentials based on the schema
export type LoginCredentials = z.infer<typeof loginSchema>;

// The login function
async function login(credentials: LoginCredentials) {
  const response = await axioInstance.post("/auth/login.php", credentials);
  return response.data;
}

// Export all auth-related functions
export const authService = {
  login,
};
