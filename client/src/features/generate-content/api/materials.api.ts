import { apiClient } from "@/apis";
import { handleApiError } from "@/apis";

export const createEnglishMaterial = async (data: any) => {
  try {
    const response = await apiClient.post("/materials/english", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createEnglishStoryMaterial = async (data: FormData) => {
  try {
    const response = await apiClient.post("/materials/english/story", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
