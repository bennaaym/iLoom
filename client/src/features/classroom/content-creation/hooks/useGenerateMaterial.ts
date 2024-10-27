import { apiClient, handleApiError } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import { Material, Subject } from "../../types";

interface GenerateMaterialPayload {
  subject: string;
  level: string;
  activity: string;
}

export const useGenerateMaterial = () => {
  const generateMaterialMutation = useMutation({
    mutationKey: ["generateMaterial"],
    mutationFn: async (payload: GenerateMaterialPayload) => {
      try {
        const res = await apiClient.post(
          `/materials/${payload.subject}`,
          payload
        );
        return res.data as Material;
      } catch (err) {
        throw new Error(handleApiError(err).message);
      }
    },
  });

  return {
    generate: generateMaterialMutation.mutate,
    isLoading: generateMaterialMutation.isPending,
    isError: generateMaterialMutation.isError,
    error: generateMaterialMutation.error,
    material: generateMaterialMutation.data,
  };
};
