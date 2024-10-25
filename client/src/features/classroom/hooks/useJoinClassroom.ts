import { useQuery } from "@tanstack/react-query";
import { Classroom } from "../types";
import { apiClient, handleApiError } from "@/apis";

interface JoinClassroomResponsePayload extends Classroom {}

export const useJoinClassroom = (code: string) => {
  const joinClassQuery = useQuery({
    enabled: Boolean(code),
    queryKey: ["joinClassroom"],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/classrooms/${code}/join`);
        return res.data as JoinClassroomResponsePayload;
      } catch (err) {
        throw new Error(handleApiError(err).message);
      }
    },
  });

  return {
    isLoading: joinClassQuery.isPending,
    isError: joinClassQuery.isError,
    error: joinClassQuery.error,
    classroom: joinClassQuery.data,
  };
};
