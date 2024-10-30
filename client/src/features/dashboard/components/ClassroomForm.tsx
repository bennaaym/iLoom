import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassroom, updateClassroom } from "@/features/dashboard/api/classroom.api";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";

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
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState(60);
  const [capacity, setCapacity] = useState(10);
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

  useEffect(() => {
    if (classroom) {
      setName(classroom.name);
      setStartDate(classroom.startDate.substring(0, 16));
      setDuration(classroom.duration);
      setCapacity(classroom.capacity);
    }
  }, [classroom]);

  const currentDateTime = new Date().toISOString().slice(0, 16);

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
        <TextField
          label="Classroom Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Start Date and Time"
          type="datetime-local"
          fullWidth
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: currentDateTime,
          }}
        />
        <FormControl fullWidth>
          <Select
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
        <TextField
          label="Capacity"
          type="number"
          fullWidth
          required
          value={capacity}
          onChange={(e) => {
            const newCapacity = Number(e.target.value);
            if (newCapacity >= 1 && newCapacity <= 12) {
              setCapacity(newCapacity);
            }
          }}
          inputProps={{
            min: 1,
            max: 12,
          }}
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
