import { apiClient, handleApiError } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import { Classroom } from "../../types";

interface TranscribeClassroomPayload {
  id: string;
  transcript: string;
}

export const useTranscribeClassroom = () => {
  const transcribeMutation = useMutation({
    mutationKey: ["transcribeClassroom"],
    mutationFn: async (payload: TranscribeClassroomPayload) => {
      try {
        const res = await apiClient.post(
          `classrooms/${payload.id}/transcribe`,
          payload
        );
        return res.data as Classroom;
      } catch (err) {}
    },
  });

  return {
    transcribe: transcribeMutation.mutate,
    isLoading: transcribeMutation.isPending,
    isError: transcribeMutation.isError,
    error: transcribeMutation.error,
    reset: transcribeMutation.reset,
  };
};
