"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassroom } from "@/api/classrooms";

interface Classroom {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  capacity: number;
}

interface ClassroomsListProps {
  classrooms: Classroom[];
  onEdit: (classroom: Classroom) => void;
}

export default function ClassroomsList({
  classrooms,
  onEdit,
}: ClassroomsListProps) {
  const queryClient = useQueryClient();

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
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
