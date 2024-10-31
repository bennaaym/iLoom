import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createClassroom,
  updateClassroom,
} from "@/features/dashboard/api/classroom.api";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";
import { dayjs } from "@/common/libs";
import { gray } from "@/common/theme";

interface ClassroomFormProps {
  classroom?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClassroomForm({
  classroom,
  onSuccess,
  onCancel,
}: ClassroomFormProps) {
  const [name, setName] = useState(() => classroom?.name ?? "");
  const [startDate, setStartDate] = useState(() => {
    return classroom
      ? dayjs(classroom.startDate).local().format("YYYY-MM-DDTHH:MM")
      : dayjs().local().format("YYYY-MM-DDTHH:MM");
  });
  const [duration, setDuration] = useState(() => classroom?.duration ?? 60);
  const [capacity, setCapacity] = useState(() => classroom?.capacity ?? 10);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const isEditMode = Boolean(classroom);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEditMode ? updateClassroom(classroom.id, data) : createClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingClassrooms"] });
      onSuccess();
    },
    onError: (error: any) => {
      setError(error.message || "An unexpected error occurred");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate({ name, startDate, duration, capacity });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3, maxWidth: 400, mx: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        {isEditMode ? "Edit Classroom" : "Create Classroom"}
      </Typography>
      <Stack spacing={2}>
        <InputLabel htmlFor="name">Class Name</InputLabel>
        <TextField
          id="name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="class name"
          size="small"
          autoComplete="off"
        />
        <InputLabel htmlFor="startDate">Start Date and Time</InputLabel>
        <input
          id="startDate"
          type="datetime-local"
          min={dayjs().local().format("YYYY-MM-DDTHH:MM")}
          value={startDate}
          required
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            borderRadius: "5px",
            border: `2px solid ${gray[400]}`,
            padding: "5px",
          }}
        />

        <InputLabel htmlFor="duration">Class Duration</InputLabel>
        <FormControl fullWidth>
          <Select
            id="duration"
            value={duration}
            label="Duration (minutes)"
            onChange={(e) => setDuration(Number(e.target.value))}
            displayEmpty
            inputProps={{ "aria-label": "Duration" }}
          >
            <MenuItem value="" disabled>
              Duration (minutes)
            </MenuItem>
            {[15, 30, 45, 60, 90, 120].map((time) => (
              <MenuItem key={time} value={time}>
                {time} minutes
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <InputLabel htmlFor="duration">Class Capacity</InputLabel>

        <TextField
          id="capacity"
          type="number"
          fullWidth
          required
          value={capacity}
          onChange={(e) => {
            const newCapacity = Number(e.target.value);
            if (newCapacity >= 1 && newCapacity <= 10) {
              setCapacity(newCapacity);
            }
          }}
          size="small"
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
        {error && (
          <Box mt={2}>
            <ErrorMessage message={error} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
