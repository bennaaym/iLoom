import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassroom } from "@/features/dashboard/api/classroom.api";
import { useRouter } from "next/navigation";
import { Classroom } from "@/features/classroom/types";
import { useAuth } from "@/common/providers/AuthProvider";
import { dayjs } from "@/common/libs";

interface ClassroomListProps {
  classrooms: Classroom[];
  onEdit: (classroom: Classroom) => void;
}

export default function ClassroomList({
  classrooms,
  onEdit,
}: ClassroomListProps) {
  const { isStudent } = useAuth();
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
    router.push(`/classrooms/${shareableCode}`);
  };

  return (
    <List>
      {classrooms.map((classroom) => {
        const isClassExpired = dayjs(classroom.endDate)
          .utc()
          .isBefore(dayjs().utc());

        const hasClassStarted =
          dayjs(classroom.startDate).utc().isBefore(dayjs.utc()) &&
          dayjs(classroom.endDate).utc().isAfter(dayjs.utc());

        return (
          <ListItem key={classroom.id}>
            <ListItemText
              primary={
                <Typography fontWeight="800" fontSize={18}>
                  {classroom.name}
                </Typography>
              }
              secondary={`Start: ${new Date(
                classroom.startDate
              ).toLocaleString()} - End: ${new Date(
                classroom.endDate
              ).toLocaleString()}`}
            />
            <Stack direction="row" spacing={1} sx={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleJoin(classroom.shareableCode)}
                disabled={isClassExpired || !hasClassStarted}
              >
                Join
              </Button>
              {!isStudent() && (
                <>
                  {!isClassExpired && (
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => onEdit(classroom)}
                      disabled={hasClassStarted}
                    >
                      <Edit />
                    </IconButton>
                  )}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(classroom.id)}
                  >
                    <Delete />
                  </IconButton>
                </>
              )}
            </Stack>
          </ListItem>
        );
      })}
    </List>
  );
}
