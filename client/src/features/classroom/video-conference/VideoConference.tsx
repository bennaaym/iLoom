"use client";

import React, { useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
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

  const { user } = useAuth();

  useEffect(() => {
    const initAgora = async () => {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(client);

      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
      const uid = user?.id!;
      const token = await getAgoraToken(classroomId, uid, "publisher");

      try {
        await client.join(appId, classroomId, token, uid);
        // Listen participants
        client.on("user-published", async (agoraUser, mediaType) => {
          await client.subscribe(agoraUser, mediaType);
          if (mediaType === "video") {
            const remoteVideoTrack = agoraUser.videoTrack;
            if (remoteVideoTrack) {
              remoteVideoTrack.play(`remote-player-${agoraUser.uid}`);
            }
          }
          if (mediaType === "audio") {
            const remoteAudioTrack = agoraUser.audioTrack;
            if (remoteAudioTrack) {
              remoteAudioTrack.play();
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
    try {
      if (isVideoEnabled) {
        await client?.unpublish([localVideoTrack]);
        localVideoTrack?.stop();
        localVideoTrack?.close();
        setLocalVideoTrack(null);
        setIsVideoEnabled(false);
      } else {
        if (user?.role !== "teacher") {
          return;
        }
        if (localVideoTrack) {
          await client?.unpublish([localVideoTrack]);
          localVideoTrack.stop();
          localVideoTrack.close();
        }
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(videoTrack);
        await client?.publish([videoTrack]);
        videoTrack.play("local-player");
        setIsVideoEnabled(true);
      }
    } catch (error) {
    }
  };

  const toggleAudio = async () => {
    if (isAudioEnabled) {
      localAudioTrack.stop();
      localAudioTrack.close();
      setLocalAudioTrack(null);
      setIsAudioEnabled(false);
    } else {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "high_quality_stereo",
        ANS: true,
        AEC: true,
        AGC: true
      });
      setLocalAudioTrack(audioTrack);
      await client?.publish([audioTrack]);
      setIsAudioEnabled(true);
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

      <div
        id="local-player"
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#000",
          display: isVideoEnabled ? "block" : "none",
        }}
      ></div>

      {!isVideoEnabled && (
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

      <div id="remote-player-container"></div>
    </Box>
  );
}
