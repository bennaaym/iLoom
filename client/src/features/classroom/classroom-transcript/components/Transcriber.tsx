"use client";
import { Box, Button } from "@mui/material";
import React from "react";
import { useSTT, useTranscribeClassroom } from "../hooks";
import { ScaleLoader } from "react-spinners";
import { red } from "@/common/theme";
import { useInterval } from "usehooks-ts";

export const Transcriber = ({ roomId }: { roomId: string }) => {
  const {
    isListening,
    isAvailable,
    finalTranscript,
    startListening,
    stopListening,
    reset,
  } = useSTT();

  const {
    transcribe,
    isLoading,
    reset: resetApiCall,
  } = useTranscribeClassroom();

  useInterval(
    () => {
      if (finalTranscript && !isLoading) {
        transcribe(
          { id: roomId, transcript: finalTranscript },
          {
            onSuccess() {
              reset();
            },
            onError() {
              resetApiCall();
            },
          }
        );
      }
    },
    isListening && isAvailable ? 10_000 : null
  );

  if (!isAvailable) return <></>;

  return (
    <Box>
      <Button
        variant="contained"
        onClick={isListening ? stopListening : startListening}
        sx={{
          bgcolor: isListening ? red[400] : "primary",
          textTransform: "capitalize",
          fontWeight: "bold",
        }}
        fullWidth
      >
        {isListening ? (
          <ScaleLoader color="white" height={20} />
        ) : (
          "start transcribing"
        )}
      </Button>
    </Box>
  );
};
