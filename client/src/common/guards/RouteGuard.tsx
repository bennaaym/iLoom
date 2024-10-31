import { ReactNode, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";

export const RouteGuard = ({ children }: { children: ReactNode }) => {
  const { isStudent, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    if (!user) return router.replace("/auth/sign-in");
    if (user && isStudent()) return router.replace("/classrooms");
    router.replace(
      pathname && !pathname.includes("/auth") ? pathname : "/classrooms"
    );
  }, [user]);

  return children;
};
