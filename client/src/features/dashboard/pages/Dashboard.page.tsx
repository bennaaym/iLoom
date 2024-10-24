"use client";

import DashboardLayout from "@/features/dashboard/components/DashboardLayout";
import {
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  Modal,
} from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClassrooms } from "@/features/dashboard/api/classrooms";
import ClassroomsList from "../components/ClassromsList";
import ClassroomForm from "../components/ClassroomForm";

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    data: upcomingClassrooms,
    isLoading: isLoadingUpcoming,
    isError: isErrorUpcoming,
  } = useQuery({
    queryKey: ["upcomingClassrooms"],
    queryFn: () => fetchClassrooms("upcoming"),
  });
  
  const {
    data: pastClassrooms,
    isLoading: isLoadingPast,
    isError: isErrorPast,
  } = useQuery({
    queryKey: ["pastClassrooms"],
    queryFn: () => fetchClassrooms("past"),
  });
  

  const handleCreateClassroom = () => {
    setSelectedClassroom(null);
    setIsFormOpen(true);
  };

  const handleEditClassroom = (classroom: any) => {
    setSelectedClassroom(classroom);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClassroom(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedClassroom(null);
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Classroom Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateClassroom}
        sx={{ mb: 2 }}
      >
        Create New Classroom
      </Button>
      <Box sx={{ width: "100%" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Upcoming Classes" />
          <Tab label="Past Classes" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && (
            <Paper sx={{ p: 2 }}>
              {isLoadingUpcoming ? (
                <CircularProgress />
              ) : isErrorUpcoming ? (
                <Typography color="error">
                  Error loading upcoming classes.
                </Typography>
              ) : (
                <ClassroomsList
                  classrooms={upcomingClassrooms?.data}
                  onEdit={handleEditClassroom}
                />
              )}
            </Paper>
          )}
          {tabValue === 1 && (
            <Paper sx={{ p: 2 }}>
              {isLoadingPast ? (
                <CircularProgress />
              ) : isErrorPast ? (
                <Typography color="error">
                  Error loading past classes.
                </Typography>
              ) : (
                <ClassroomsList
                  classrooms={pastClassrooms?.data}
                  onEdit={handleEditClassroom}
                />
              )}
            </Paper>
          )}
        </Box>
      </Box>
      <Modal open={isFormOpen} onClose={handleFormClose}>
        <Paper
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            padding: 4,
          }}
        >
          <ClassroomForm
            classroom={selectedClassroom}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </Paper>
      </Modal>
    </DashboardLayout>
  );
}
