import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const fetchClassrooms = async (status: string) => {
  const response = await API.get("/classrooms", {
    params: { status },
  });
  return response.data;
};

export const fetchClassroom = async (id: string) => {
  const response = await API.get(`/classrooms/${id}`);
  return response.data;
};

export const createClassroom = async (data: any) => {
  const response = await API.post("/classrooms", data);
  return response.data;
};

export const updateClassroom = async (id: string, data: any) => {
  const response = await API.patch(`/classrooms/${id}`, data);
  return response.data;
};

export const deleteClassroom = async (id: string) => {
  await API.delete(`/classrooms/${id}`);
};
