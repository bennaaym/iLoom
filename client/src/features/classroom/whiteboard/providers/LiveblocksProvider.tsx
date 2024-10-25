"use client";
import { LiveblocksProvider as LbProvider } from "@liveblocks/react";
import { ReactNode } from "react";
import { apiClient } from "@/apis";

interface Props {
  roomId: string;
  children: ReactNode;
}

export const LiveblocksProvider = ({ roomId, children }: Props) => {
  return (
    <LbProvider
      authEndpoint={async () => {
        const res = await apiClient.post(`classrooms/${roomId}/whiteboard`);
        return res.data;
      }}
      throttle={16}
    >
      {children}
    </LbProvider>
  );
};
