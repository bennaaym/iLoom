"use client";

import { useRouter, useParams } from "next/navigation";
import { Box } from "@mui/material";
import { VideoConference } from "../video-conference/components";
import { Chat } from "../classroom-chat/components";
import { Whiteboard } from "../whiteboard/components";
import { PageLoading } from "@/common/loaders";
import { useJoinClassroom } from "../hooks";
import { useAuth } from "@/common/providers/AuthProvider";
import { CreateContentModal } from "../content-creation/components";
import { ClassroomMaterialProvider } from "../providers";

export const Classroom = () => {
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

        {user && (
          <Box flexGrow={1} mt={2}>
            <Chat roomId={classroom.shareableCode} userId={user.id} />
          </Box>
        )}
      </Box>

      <ClassroomMaterialProvider>
        <Box flexGrow={1}>
          <Whiteboard
            classroom={{
              id: classroom.id,
              shareableCode: classroom.shareableCode,
            }}
          />
        </Box>
        {user?.role === "teacher" && <CreateContentModal />}
      </ClassroomMaterialProvider>
    </Box>
  );
};
