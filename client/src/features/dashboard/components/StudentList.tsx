import React from "react";
import { Paper, Stack, Button, Typography } from "@mui/material";
import { User } from "@/features/auth/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudents, deleteStudent } from "../api/studentManegement.api";
import { PageLoading } from "@/common/loaders";

export const StudentList: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery<User[]>({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const deleteMutation = useMutation({
    mutationFn: (studentId: string) => deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <Stack spacing={2}>
      {students?.map((student) => (
        <Paper
          key={student.id}
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>
            {student.name} - {student.email}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => deleteMutation.mutate(student.id)}
          >
            Delete
          </Button>
        </Paper>
      ))}
    </Stack>
  );
};
