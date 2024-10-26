import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Videocam, VideocamOff, Mic, MicOff } from "@mui/icons-material";
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
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        {user?.role === "teacher" && (
          <IconButton onClick={() => toggleVideo(classroomId)} color="primary">
            {isVideoEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
        )}
        <IconButton onClick={() => toggleAudio(classroomId)} color="primary">
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </IconButton>
      </Box>

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
  );
};
