"use client";

import React, { useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import {
  LiveblocksProvider,
  LiveblocksRoomProvider,
  TLProvider,
} from "../providers";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";

interface Props {
  classroom: {
    id: string;
    shareableCode: string;
  };
}

export const Whiteboard = ({ classroom }: Props) => {
  const { whiteboardPdf, whiteboardMaterial } = useClassroomMaterial();

  const renderTLDraw = useCallback(() => {
    return <TLProvider key={whiteboardMaterial?.id} pdf={whiteboardPdf} />;
  }, [whiteboardPdf]);

  return (
    <Box width="100%" height="100%">
      <LiveblocksProvider roomId={classroom.shareableCode}>
        <LiveblocksRoomProvider
          roomId={classroom.shareableCode}
          loading={<Box>whiteboard loading</Box>}
          error={<Box>whiteboard error</Box>}
        >
          {renderTLDraw()}
        </LiveblocksRoomProvider>
      </LiveblocksProvider>
    </Box>
  );
};
