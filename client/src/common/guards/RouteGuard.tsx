import { ReactNode, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";

export const RouteGuard = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return router.replace("/");
    else {
      router.replace(
        pathname && pathname !== "/" && !pathname.includes("/auth")
          ? pathname
          : "/dashboard"
      );
    }
  }, [user]);

  return children;
};
