import { AuthGuard } from "@/components/auth/auth-guard";

export default function Dashboard() {
  return (
    <AuthGuard allowedRoles={["admin", "employee"]}>
      <h1>Hello</h1>
    </AuthGuard>
  );
}
