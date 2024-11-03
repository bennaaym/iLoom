import { apiClient, handleApiError } from "@/apis";
import { useMutation } from "@tanstack/react-query";
import { Material } from "../../types";

interface GenerateMaterialPayload {
  classroom?: string;
  subject: string;
  level: string;
  activity: string;
  ageGroup?: string;
  description?: string;
  image?: File | null;
  numberOfWords?: string;
}

export const useGenerateMaterial = () => {
  const generateMaterialMutation = useMutation({
    mutationKey: ["generateMaterial"],
    mutationFn: async (payload: GenerateMaterialPayload) => {
      try {
        let res;
        if (payload.subject === "english" && payload.activity === "story") {
          const formData = new FormData();
          if (payload.classroom)
            formData.append("classroom", payload.classroom);
          formData.append("level", payload.level);
          formData.append("activity", payload.activity);
          if (payload.numberOfWords)
            formData.append("numberOfWords", payload.numberOfWords);
          if (payload.ageGroup) formData.append("ageGroup", payload.ageGroup);
          if (payload.description)
            formData.append("description", payload.description);
          if (payload.image) formData.append("image", payload.image);

          res = await apiClient.post("/materials/english/story", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          res = await apiClient.post(`/materials/${payload.subject}`, payload);
        }
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
