"use client";

import React, { useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCClient, IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import { getAgoraToken } from "../api/agora.api";
import { IconButton, Box, Typography } from "@mui/material";
import { Videocam, VideocamOff } from "@mui/icons-material";
import { Mic, MicOff } from "@mui/icons-material";
import { useAuth } from "@/common/providers/AuthProvider";

interface VideoConferenceProps {
  classroomId: string;
}

export default function VideoConference({ classroomId }: VideoConferenceProps) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [teacherVideoTrack, setTeacherVideoTrack] = useState<IRemoteVideoTrack | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const initAgora = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(agoraClient);

      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
      const uid = user?.role === "teacher" ? Math.floor(Math.random() * 1000) + 1 : Math.floor(Math.random() * 9000) + 1001;

      const token = await getAgoraToken(classroomId, String(uid), "publisher");

      try {
        await agoraClient.join(appId, classroomId, token, uid);
        agoraClient.on("user-published", async (agoraUser, mediaType) => {
          await agoraClient.subscribe(agoraUser, mediaType);

          if (mediaType === "video") {
            const remoteVideoTrack = agoraUser.videoTrack;
            if (remoteVideoTrack) {
              const userUid = parseInt(agoraUser.uid as string, 10);
              if (userUid <= 1000) {
                setTeacherVideoTrack(remoteVideoTrack);
                remoteVideoTrack.play("remote-teacher-player");
              }
            }
          }

          if (mediaType === "audio") {
            const remoteAudioTrack = agoraUser.audioTrack;
            if (remoteAudioTrack) {
              remoteAudioTrack.play();
            }
          }
        });

        agoraClient.on("user-unpublished", (agoraUser, mediaType) => {
          if (mediaType === "video") {
            const userUid = parseInt(agoraUser.uid as string, 10);
            if (userUid <= 1000) {
              teacherVideoTrack?.stop();
              setTeacherVideoTrack(null);
            }
          }
        });

      } catch (error) {
      }
    };

    initAgora();

    return () => {
      localVideoTrack?.stop();
      localVideoTrack?.close();
      localAudioTrack?.stop();
      localAudioTrack?.close();
      client?.leave();
    };
  }, [classroomId]);

  const toggleVideo = async () => {
    if (user?.role !== "teacher") {
      return;
    }

    try {
      if (isVideoEnabled) {
        await client?.unpublish([localVideoTrack]);
        localVideoTrack?.stop();
        localVideoTrack?.close();
        setLocalVideoTrack(null);
        setIsVideoEnabled(false);
      } else {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(videoTrack);
        await client?.publish([videoTrack]);
        setTimeout(() => {
          videoTrack.play("local-player");
        }, 100);
        setIsVideoEnabled(true);
      }
    } catch (error) {
    }
  };

  const toggleAudio = async () => {
    try {
      if (isAudioEnabled) {
        await client?.unpublish([localAudioTrack]);
        localAudioTrack?.stop();
        localAudioTrack?.close();
        setLocalAudioTrack(null);
        setIsAudioEnabled(false);
      } else {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "high_quality_stereo",
          ANS: true,
          AEC: true,
          AGC: true,
        });
        setLocalAudioTrack(audioTrack);
        await client?.publish([audioTrack]);
        setIsAudioEnabled(true);
      }
    } catch (error) {
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        {user?.role === "teacher" && (
          <IconButton onClick={toggleVideo} color="primary">
            {isVideoEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
        )}
        <IconButton onClick={toggleAudio} color="primary">
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </IconButton>
      </Box>

      {teacherVideoTrack && user?.role === "student" && (
        <Box
          id="remote-teacher-player"
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#000",
          }}
        ></Box>
      )}

      {!teacherVideoTrack && user?.role === "student" && (
        <Box
          width="100%"
          height="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#ccc"
        >
          <Typography>No Video</Typography>
        </Box>
      )}

      {isVideoEnabled && user?.role === "teacher" && (
        <Box
          id="local-player"
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#000",
          }}
        ></Box>
      )}

      {!isVideoEnabled && user?.role === "teacher" && (
        <Box
          width="100%"
          height="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#ccc"
        >
          <Typography>Camera Off</Typography>
        </Box>
      )}
    </Box>
  );
}
