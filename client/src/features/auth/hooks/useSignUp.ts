import { apiClient, handleApiError } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import { User } from "../types";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

interface SignUpResponsePayload extends User {}

export const useSignUp = () => {
  const signUpMutation = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (payload: SignUpPayload) => {
      try {
        const res = await apiClient.post("/auth/sign-up", payload);
        return res.data as SignUpResponsePayload;
      } catch (err) {
        throw new Error(handleApiError(err).message);
      }
    },
  });

  return {
    signUp: signUpMutation.mutate,
    reset: signUpMutation.reset,
    isLoading: signUpMutation.isPending,
    isError: signUpMutation.isError,
    error: signUpMutation.error,
    user: signUpMutation.data,
  };
};
