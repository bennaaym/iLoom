import { apiClient } from "@/apis";
import { handleApiError } from "@/apis"; 

export const getStudents = async () => {
  try {
    const response = await apiClient.get("/users/students");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createStudents = async (students: Array<{ name: string; email: string; password: string }>) => {
    try {
      const response = await apiClient.post("/users/students", { students });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

export const createStudentsCsv = async (csvFile: File) => {
  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    const response = await apiClient.post("/users/students-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteStudent = async (studentId: string) => {
  try {
    await apiClient.delete(`/users/students/${studentId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};
