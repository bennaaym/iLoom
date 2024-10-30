import { apiClient, handleApiError } from "@/apis";
import { useMutation } from "@tanstack/react-query";

interface SubmitQuizPayload {
  teacher: string;
  classroom: string;
  material: string;
  answers: Record<string, string>;
}

export const useSubmitQuiz = () => {
  const submitQuizMutation = useMutation({
    mutationKey: ["submitQuiz"],
    mutationFn: async (payload: SubmitQuizPayload) => {
      try {
        await apiClient.post("/classroom-quizzes", payload);
      } catch (err) {
        throw new Error(handleApiError(err).message);
      }
    },
  });

  return {
    submit: submitQuizMutation.mutate,
    isLoading: submitQuizMutation.isPending,
    isError: submitQuizMutation.isError,
    error: submitQuizMutation.error,
  };
};
