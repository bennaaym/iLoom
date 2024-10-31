import React, { Fragment, useEffect, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Videocam, VideocamOff, Mic, MicOff } from "@mui/icons-material";
import { useAgora } from "../providers/AgoraProvider";
import { useAuth } from "@/common/providers/AuthProvider";
import { brand } from "@/common/theme";
import { FloatingButton } from "@/common/components";

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

  const { user, isStudent } = useAuth();

  const localPlayerRef = useRef<HTMLDivElement>(null);
  const remotePlayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    joinClassroom(classroomId);

    return () => {
      leaveClassroom();
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

  return (
    <Fragment>
      {user && isStudent() && (
        <Box position="absolute" bottom={20} right={10}>
          <FloatingButton
            icon={isAudioEnabled ? <Mic /> : <MicOff />}
            onClick={() => toggleAudio(classroomId)}
          />
        </Box>
      )}
      <Box position="relative">
        {user && !isStudent() && (
          <Box
            display="flex"
            alignItems="center"
            mb={2}
            position="absolute"
            bottom={-8}
            justifyContent="center"
            width="100%"
            gap={1}
            zIndex={5}
          >
            <IconButton
              onClick={() => toggleVideo(classroomId)}
              sx={{ border: 1, bgcolor: brand[400], color: "white" }}
            >
              {isVideoEnabled ? <Videocam /> : <VideocamOff />}
            </IconButton>
            <IconButton
              onClick={() => toggleAudio(classroomId)}
              sx={{ border: 1, bgcolor: brand[400], color: "white" }}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </IconButton>
          </Box>
        )}

        {user?.role === "teacher" &&
          (isVideoEnabled && localVideoTrack ? (
            <Box
              ref={localPlayerRef}
              id="local-player"
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#000",
              }}
            ></Box>
          ) : (
            <Box
              width="100%"
              height="200px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="#ccc"
            >
              <Typography>No Video Shared</Typography>
            </Box>
          ))}

        {user?.role === "student" &&
          (teacherVideoTrack ? (
            <Box
              ref={remotePlayerRef}
              id="remote-teacher-player"
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#000",
              }}
            ></Box>
          ) : (
            <Box
              width="100%"
              height="200px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="#ccc"
            >
              <Typography>No Video Shared</Typography>
            </Box>
          ))}
      </Box>
    </Fragment>
  );
};
