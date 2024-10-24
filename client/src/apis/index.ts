import axios from "axios";
import lodash from "lodash";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
  withCredentials: true,
});

export const handleApiError = (error: any) => {
  if (error.response) {
    const message = (error.response.data as any)?.message;
    if (lodash.isString(message)) return { message };
    if (lodash.isArray(message)) return { message: message.join("\n") };
    return { message: "Unexpected error, please try again" };
  }

  if (error.request) {
    return { message: "Please check your network or try again later" };
  }

  return { message: "Unexpected error occurred, please try again" };
};
