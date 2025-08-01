import { AuthGuard } from "@/components/auth/auth-guard";

export default function Dashboard() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <h1>Hello</h1>
    </AuthGuard>
  );
}
