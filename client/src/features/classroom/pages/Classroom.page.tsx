"use client";
import { useRouter, useParams } from "next/navigation";
import { Box, Stack, Typography } from "@mui/material";
import { VideoConference } from "../video-conference/components";
import { Chat } from "../classroom-chat/components";
import { Whiteboard } from "../whiteboard/components";
import { PageLoading } from "@/common/loaders";
import { useJoinClassroom } from "../hooks";
import { useAuth } from "@/common/providers/AuthProvider";
import {
  CreateContentModal,
  ListClassroomMaterials,
} from "../content-creation/components";
import {
  ClassroomMaterialProvider,
  ClassroomSocketProvider,
} from "../providers";
import { Fragment } from "react";
import { ClassroomQuiz } from "../classroom-quizzes/components";
import { Transcriber } from "../classroom-transcript/components";
import { ClassroomPanel } from "../classroom-control/components";

export const Classroom = () => {
  const { user, isStudent } = useAuth();
  const { id } = useParams();
  const { classroom, isLoading, isError } = useJoinClassroom(id as string);
  const router = useRouter();

  if (isLoading) return <PageLoading />;
  if (isError) {
    router.replace("/classrooms");
    return;
  }

  if (!classroom) return <></>;

  if (classroom.isFinished) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Typography variant="h6" color="error">
          This classroom has expired.
        </Typography>
      </Box>
    );
  }
  return (
    <ClassroomSocketProvider roomId={classroom.id}>
      <Box display="flex" height="100vh" pb={2} pl={2}>
        <Stack width="25%" minWidth="300px" mr={2} gap={2}>
          <ClassroomPanel classroom={classroom} />
          <VideoConference classroomId={classroom.id} />
          {user && !isStudent() && <Transcriber roomId={classroom.id} />}
          {user && (
            <Box flexGrow={1}>
              <Chat roomId={classroom.id} userId={user.id} />
            </Box>
          )}
        </Stack>

        <ClassroomMaterialProvider>
          <Box flexGrow={1}>
            <Whiteboard
              classroom={{
                id: classroom.id,
                shareableCode: classroom.shareableCode,
              }}
            />
          </Box>
          {user && !isStudent() && (
            <Fragment>
              <CreateContentModal roomId={classroom.id} />
              <ListClassroomMaterials roomId={classroom.id} />
            </Fragment>
          )}
          <ClassroomQuiz roomId={classroom.id} />
        </ClassroomMaterialProvider>
      </Box>
    </ClassroomSocketProvider>
  );
};
