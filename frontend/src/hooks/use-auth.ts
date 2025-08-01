import { AuthContext } from "@/contexts/auth-context";
import { useContext } from "react";

// HOOK to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
