import { apiClient } from "@/apis";
import { handleApiError } from "@/apis";
import { IMaterial, IPaginatedResponse } from "@/common/interfaces";

export const fetchMaterials = async (): Promise<IMaterial[]> => {
  try {
    const response = await apiClient.get<IPaginatedResponse<IMaterial>>(
      "/materials"
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchMaterialById = async (id: string): Promise<IMaterial> => {
  try {
    const response = await apiClient.get<IMaterial>(`/materials/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
