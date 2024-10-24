import { apiClient } from "@/apis";
import { handleApiError } from "@/apis"; 

export const fetchClassrooms = async (status: string) => {
  try {
    const response = await apiClient.get("/classrooms", {
      params: { status },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchClassroom = async (id: string) => {
  try {
    const response = await apiClient.get(`/classrooms/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createClassroom = async (data: any) => {
  try {
    const response = await apiClient.post("/classrooms", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateClassroom = async (id: string, data: any) => {
  try {
    const response = await apiClient.patch(`/classrooms/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteClassroom = async (id: string) => {
  try {
    await apiClient.delete(`/classrooms/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};
