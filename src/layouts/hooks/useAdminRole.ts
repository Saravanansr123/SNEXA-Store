import { useAuth } from "../../contexts/AuthContext";

export function useAdminRole() {
  const { role, loading } = useAuth();
  return { isAdmin: role === "admin", loading };
}
