"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { LiveMap } from "@liveblocks/core";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  roomId: string;
  loading: ReactNode;
  error: ReactNode;
  children: ReactNode;
}

export const LiveblocksRoomProvider = ({
  roomId,
  loading,
  error,
  children,
}: Props) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ presence: undefined }}
      initialStorage={{ records: new LiveMap() }}
    >
      <ErrorBoundary fallback={error}>
        <ClientSideSuspense fallback={loading}>{children}</ClientSideSuspense>
      </ErrorBoundary>
    </RoomProvider>
  );
};
