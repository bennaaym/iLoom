import { apiClient, handleApiError } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import { User } from "../types";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponsePayload extends User {}

export const useSignIn = () => {
  const signInMutation = useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (payload: SignInPayload) => {
      try {
        const res = await apiClient.post("/auth/sign-in", payload);
        return res.data as SignInResponsePayload;
      } catch (err) {
        throw new Error(handleApiError(err).message);
      }
    },
  });

  return {
    signIn: signInMutation.mutate,
    reset: signInMutation.reset,
    isLoading: signInMutation.isPending,
    isError: signInMutation.isError,
    error: signInMutation.error,
    user: signInMutation.data,
  };
};
