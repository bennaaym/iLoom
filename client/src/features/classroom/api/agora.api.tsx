import { apiClient } from "@/apis";

export const getAgoraToken = async (
  channelName: string,
  uid: string,
  role: string
) => {
  const response = await apiClient.get("/agora/token", {
    params: { channelName, uid, role },
  });
  return response.data.token;
};

