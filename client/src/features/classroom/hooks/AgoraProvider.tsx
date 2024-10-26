import React, { createContext, useContext, useEffect, useState } from "react";
import type { IAgoraRTCClient, IRemoteVideoTrack, ILocalVideoTrack, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { getAgoraToken } from "../api/agora.api";
import { useAuth } from "@/common/providers/AuthProvider";

const AgoraRTC = typeof window !== "undefined" ? require("agora-rtc-sdk-ng") : null;

interface AgoraContextProps {
  client: IAgoraRTCClient | null;
  joinClassroom: (classroomId: string) => Promise<void>;
  leaveClassroom: () => Promise<void>;
  toggleAudio: (classroomId: string) => Promise<void>;
  toggleVideo: (classroomId: string) => Promise<void>;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  teacherVideoTrack: IRemoteVideoTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
}

const AgoraContext = createContext<AgoraContextProps | undefined>(undefined);

export const AgoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [teacherVideoTrack, setTeacherVideoTrack] = useState<IRemoteVideoTrack | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setClient(agoraClient);

    AgoraRTC.onAutoplayFailed = () => {
      alert("Please toggle the microphone on and off to enable audio and video playback.");
    };

    agoraClient.on("user-published", async (agoraUser: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
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

    agoraClient.on("user-unpublished", (agoraUser: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      if (mediaType === "video") {
        teacherVideoTrack?.stop();
        setTeacherVideoTrack(null);
      }
    });

    return () => {
      leaveClassroom();
    };
  }, []);

  const joinClassroom = async (classroomId: string) => {
    if (!client || !user) return;
    
    if (client.connectionState === "CONNECTED") {
      await leaveClassroom();
    }

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
    const uid = user.role === "teacher" ? Math.floor(Math.random() * 1000) + 1 : Math.floor(Math.random() * 9000) + 1001;
    const token = await getAgoraToken(classroomId, String(uid), "publisher");

    await client.join(appId, classroomId, token, uid);
  };

  const leaveClassroom = async () => {
    if (client) {
      await client.leave();
      localAudioTrack?.stop();
      localAudioTrack?.close();
      localVideoTrack?.stop();
      localVideoTrack?.close();
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
    }
  };

  const toggleAudio = async (classroomId: string) => {
    if (!client) return;

    if (client.connectionState !== "CONNECTED") {
      await joinClassroom(classroomId);
    }

    if (isAudioEnabled) {
      await client.unpublish([localAudioTrack]);
      localAudioTrack?.stop();
      localAudioTrack?.close();
      setLocalAudioTrack(null);
      setIsAudioEnabled(false);
    } else {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        AGC: true,
        ANS: true,
        encoderConfig: {
          bitrate: 48,
          sampleRate: 48000,
          stereo: true,
        },
      });
      setLocalAudioTrack(audioTrack);
      await client.publish([audioTrack]);
      setIsAudioEnabled(true);
    }
  };

  const toggleVideo = async (classroomId: string) => { 
    if (!client || user?.role !== "teacher") return;

    if (client.connectionState !== "CONNECTED") {
      await joinClassroom(classroomId);
    }

    if (isVideoEnabled && localVideoTrack) {
      await client.unpublish([localVideoTrack]);
      localVideoTrack.stop();
      localVideoTrack.close();
      setLocalVideoTrack(null);
      setIsVideoEnabled(false);
    } else if (!isVideoEnabled) {
      try {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(videoTrack);
        await client.publish([videoTrack]);
        setTimeout(() => {
          videoTrack.play("local-player");
        }, 100);
        setIsVideoEnabled(true);
      } catch (error) {
      }
    }
  };

  return (
    <AgoraContext.Provider
      value={{
        client,
        joinClassroom,
        leaveClassroom,
        toggleAudio,
        toggleVideo,
        isAudioEnabled,
        isVideoEnabled,
        teacherVideoTrack,
        localVideoTrack,
      }}
    >
      {children}
    </AgoraContext.Provider>
  );
};

export const useAgora = () => {
  const context = useContext(AgoraContext);
  if (context === undefined) {
    throw new Error("useAgora must be used within an AgoraProvider");
  }
  return context;
};
