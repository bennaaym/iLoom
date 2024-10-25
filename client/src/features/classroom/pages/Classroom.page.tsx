"use client";

import { useRouter, useParams } from "next/navigation";
import { Box } from "@mui/material";
import VideoConference from "../video-conference/VideoConference";
import Chat from "../components/Chat";
import { Whiteboard } from "../whiteboard/components";
import { PageLoading } from "@/common/loaders";
import { useJoinClassroom } from "../hooks";
import { useAuth } from "@/common/providers/AuthProvider";

export default function Classroom() {
  const { user } = useAuth();
  const { id } = useParams();
  const { classroom, isLoading, isError } = useJoinClassroom(id as string);
  const router = useRouter();

  if (isLoading) return <PageLoading />;
  if (isError) {
    router.replace("/dashboard");
    return;
  }

  if (!classroom) return <></>;

  return (
    <Box display="flex" height="100%" pl={2}>
      <Box
        width="25%"
        minWidth="300px"
        display="flex"
        flexDirection="column"
        mr={2}
      >
        <VideoConference classroomId={classroom.id} />

        <Box flexGrow={1} mt={2}>
          <Chat classroomId={classroom.id} userId={user?.id!} />
        </Box>
      </Box>

      <Box flexGrow={1}>
        <Whiteboard
          classroom={{
            id: classroom.id,
            shareableCode: classroom.shareableCode,
          }}
        />
      </Box>
    </Box>
  );
};