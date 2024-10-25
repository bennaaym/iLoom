"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Stack,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassroom } from "@/features/dashboard/api/classroom.api";
import { useRouter } from "next/navigation";
import { Classroom } from "@/features/classroom/types";

interface ClassroomListProps {
  classrooms: Classroom[];
  onEdit: (classroom: Classroom) => void;
}

export default function ClassroomList({
  classrooms,
  onEdit,
}: ClassroomListProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteClassroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingClassrooms"] });
      queryClient.invalidateQueries({ queryKey: ["pastClassrooms"] });
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  const handleJoin = (shareableCode: string) => {
    router.push(`/classroom/${shareableCode}`);
  };

  return (
    <List>
      {classrooms.map((classroom) => (
        <ListItem key={classroom.id}>
          <ListItemText
            primary={classroom.name}
            secondary={`Start: ${new Date(
              classroom.startDate
            ).toLocaleString()} - End: ${new Date(
              classroom.endDate
            ).toLocaleString()}`}
          />
          <ListItemSecondaryAction>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleJoin(classroom.shareableCode)}
              >
                Join
              </Button>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => onEdit(classroom)}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(classroom.id)}
              >
                <Delete />
              </IconButton>
            </Stack>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
