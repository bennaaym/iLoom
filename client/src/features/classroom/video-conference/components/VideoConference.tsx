import React, { useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
} from "@mui/icons-material";
import { useAgora } from "../providers/AgoraProvider";
import { useAuth } from "@/common/providers/AuthProvider";

interface VideoConferenceProps {
  classroomId: string;
}

export const VideoConference = ({ classroomId }: VideoConferenceProps) => {
  const {
    joinClassroom,
    leaveClassroom,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
    teacherVideoTrack,
    localVideoTrack,
  } = useAgora();

  const { user } = useAuth();

  const localPlayerRef = useRef<HTMLDivElement>(null);
  const remotePlayerRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let hasJoined = false;

    const join = async () => {
      try {
        await joinClassroom(classroomId);
        hasJoined = true;
      } catch (error) {
      }
    };

    join();

    return () => {
      if (hasJoined) {
        leaveClassroom()
      }
    };
  }, [classroomId]);


  useEffect(() => {
    if (localVideoTrack && localPlayerRef.current) {
      localVideoTrack.play(localPlayerRef.current);
    }

    return () => {
      localVideoTrack?.stop();
    };
  }, [localVideoTrack]);

  useEffect(() => {
    if (teacherVideoTrack && remotePlayerRef.current) {
      teacherVideoTrack.play(remotePlayerRef.current);
    }

    return () => {
      teacherVideoTrack?.stop();
    };
  }, [teacherVideoTrack]);

  const videoContainerStyles = {
    width: "100%",
    height: isSmallScreen ? "180px" : "250px",
    position: "relative",
    backgroundColor: "#000",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "16px",
  };

  const controlButtonStyles = {
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    margin: "0 8px",
  };

  return (
    <Box>
      <Box sx={videoContainerStyles}>
        {user?.role === "teacher" &&
          (isVideoEnabled && localVideoTrack ? (
            <Box
              ref={localPlayerRef}
              id="local-player"
              sx={{ width: "100%", height: "100%", position: "relative" }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                spacing={2}
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                }}
              >
                <Tooltip title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}>
                  <IconButton
                    onClick={() => toggleVideo(classroomId)}
                    sx={controlButtonStyles}
                  >
                    {isVideoEnabled ? <Videocam /> : <VideocamOff />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}>
                  <IconButton
                    onClick={() => toggleAudio(classroomId)}
                    sx={controlButtonStyles}
                  >
                    {isAudioEnabled ? <Mic /> : <MicOff />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ) : (
            <Box
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="#333"
              position="relative"
            >
              <Typography color="#fff">Camera is Off</Typography>
              <Stack
                direction="row"
                justifyContent="center"
                spacing={2}
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                }}
              >
                <Tooltip title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}>
                  <IconButton
                    onClick={() => toggleVideo(classroomId)}
                    sx={controlButtonStyles}
                  >
                    {isVideoEnabled ? <Videocam /> : <VideocamOff />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}>
                  <IconButton
                    onClick={() => toggleAudio(classroomId)}
                    sx={controlButtonStyles}
                  >
                    {isAudioEnabled ? <Mic /> : <MicOff />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))}

        {user?.role === "student" &&
          (teacherVideoTrack ? (
            <Box
              ref={remotePlayerRef}
              id="remote-teacher-player"
              sx={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Box
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="#333"
            >
              <Typography color="#fff">Teacher&apos;s Camera is Off</Typography>
            </Box>
          ))}
      </Box>

      {user?.role === "student" && (
        <Box
          sx={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 5,
          }}
        >
          <Tooltip title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}>
            <IconButton
              onClick={() => toggleAudio(classroomId)}
              sx={{
                ...controlButtonStyles,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              }}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};
