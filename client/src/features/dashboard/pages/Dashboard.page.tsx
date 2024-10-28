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
import { fetchClassrooms } from "@/features/dashboard/api/classroom.api";
import ClassroomList from "../components/ClassromsList";
import ClassroomForm from "../components/ClassroomForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/common/providers/AuthProvider";

export const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

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

  const handleManageStudents = () => {
    router.push("/dashboard/student-management");
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom color="primary">
        Classroom Dashboard
      </Typography>
      {user?.role === "teacher" && (
        <Box display="flex" gap={2} mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateClassroom}
            sx={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            Create New Classroom
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleManageStudents}
            sx={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            Manage Students
          </Button>
        </Box>
      )}


      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
            },
          }}
        >
          <Tab label="Upcoming Classes" />
          <Tab label="Past Classes" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#ffffff",
              }}
            >
              {isLoadingUpcoming ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress color="primary" />
                </Box>
              ) : isErrorUpcoming ? (
                <Typography color="error" align="center">
                  Error loading upcoming classes.
                </Typography>
              ) : (
                <ClassroomList
                  classrooms={upcomingClassrooms?.data}
                  onEdit={handleEditClassroom}
                />
              )}
            </Paper>
          )}
          {tabValue === 1 && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#ffffff",
              }}
            >
              {isLoadingPast ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress color="primary" />
                </Box>
              ) : isErrorPast ? (
                <Typography color="error" align="center">
                  Error loading past classes.
                </Typography>
              ) : (
                <ClassroomList
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
            backgroundColor: "#ffffff",
            borderRadius: 2,
          }}
        >
          <ClassroomForm
            classroom={selectedClassroom}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </Paper>
      </Modal>
    </Box>
  );
};
