"use client";

import React from "react";
import { Box } from "@mui/material";
import {
  LiveblocksProvider,
  LiveblocksRoomProvider,
  TLProvider,
} from "../providers";

interface Props {
  classroom: {
    id: string;
    shareableCode: string;
  };
}

export const Whiteboard = ({ classroom }: Props) => {
  return (
    <Box width="100%" height="90vh">
      <LiveblocksProvider roomId={classroom.shareableCode}>
        <LiveblocksRoomProvider
          roomId={classroom.shareableCode}
          loading={<Box>whiteboard loading</Box>}
          error={<Box>whiteboard error</Box>}
        >
          <TLProvider />
        </LiveblocksRoomProvider>
      </LiveblocksProvider>
    </Box>
  );
};
