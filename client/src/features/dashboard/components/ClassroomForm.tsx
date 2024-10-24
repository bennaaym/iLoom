"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassroom, updateClassroom } from "@/features/dashboard/api/classroom.api";

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
  const queryClient = useQueryClient();

  const isEditMode = Boolean(classroom);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEditMode
        ? updateClassroom(classroom.id, data)
        : createClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingClassrooms"] });
      onSuccess();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, startDate, duration, capacity });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {isEditMode ? "Edit Classroom" : "Create New Classroom"}
      </Typography>
      <TextField
        label="Classroom Name"
        fullWidth
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
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
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="duration-label">Duration (minutes)</InputLabel>
        <Select
          labelId="duration-label"
          value={duration}
          label="Duration (minutes)"
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={45}>45</MenuItem>
          <MenuItem value={60}>60</MenuItem>
          <MenuItem value={90}>90</MenuItem>
          <MenuItem value={120}>120</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="capacity-label">Capacity</InputLabel>
        <Select
          labelId="capacity-label"
          value={capacity}
          label="Capacity"
          onChange={(e) => setCapacity(Number(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {isEditMode ? "Update Classroom" : "Create Classroom"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
