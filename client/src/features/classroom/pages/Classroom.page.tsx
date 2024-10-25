"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box } from "@mui/material";
import { fetchClassroom } from "@/features/dashboard/api/classroom.api";
import VideoConference from "../video-conference/VideoConference";
import Chat from "../components/Chat";
import { Whiteboard } from "../whiteboard/components";
import { PageLoading } from "@/common/loaders";

export const Classroom = () => {
  const { id } = useParams();
  const router = useRouter();
  const classroomId = Array.isArray(id) ? id[0] : id;

  const [classroom, setClassroom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) {
      router.push("/dashboard");
      return;
    }

    const getClassroom = async () => {
      try {
        const data = await fetchClassroom(classroomId);
        setClassroom(data);
      } catch (error) {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    getClassroom();
  }, [classroomId, router]);

  if (loading) return <PageLoading />;

  return (
    <Box display="flex" height="100%" pl={2}>
      <Box
        width="25%"
        minWidth="300px"
        display="flex"
        flexDirection="column"
        mr={2}
      >
        {classroom && <VideoConference classroomId={classroom?.id} />}

        <Box flexGrow={1} mt={2}>
          <Chat classroomId={classroom.id} />
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
