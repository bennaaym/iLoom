import { apiClient } from "@/apis";
import { User } from "@/features/auth/types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContext {
  user: User | null;
  isStudent(): boolean;
  isAuthenticated(): boolean;
  setUser(user: User): void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) return;
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/users/me");
        setUser(res.data);
      } catch (err) {}
    };
    fetchUser();
  }, []);

  const signOut = async () => {
    try {
      await apiClient.post("/auth/sign-out");
      setUser(null);
    } catch (err) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signOut,
        isStudent: () => user?.role === "student",
        isAuthenticated: () => Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
