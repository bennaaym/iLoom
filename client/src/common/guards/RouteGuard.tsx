import { ReactNode, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

export const RouteGuard = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return router.replace("/auth/sign-in");
    router.replace("/dashboard");
  }, [user]);

  return children;
};
