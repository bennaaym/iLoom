"use client";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Modal,
  Button,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClassrooms } from "@/features/dashboard/api/classroom.api";
import ClassroomList from "../components/ClassromsList";
import ClassroomForm from "../components/ClassroomForm";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";
import { PageLoading } from "@/common/loaders";
import { gray } from "@/common/theme";
import { Classroom } from "@/features/classroom/types";
import { useAuth } from "@/common/providers/AuthProvider";

interface TabProps {
  onEdit(classroom: Classroom): void;
}

const UpcomingClassesTab = ({ onEdit }: TabProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["upcomingClassrooms"],
    queryFn: () => fetchClassrooms("upcoming"),
  });

  const renderContent = () => {
    if (isLoading) return <PageLoading />;
    if (isError)
      return (
        <ErrorMessage message="Failed to load upcoming classes, please try again." />
      );
    if (!data?.data.length)
      return <Typography color={gray[400]}>No classes scheduled</Typography>;

    return <ClassroomList classrooms={data.data} onEdit={onEdit} />;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "5px",
        backgroundColor: "#ffffff",
      }}
    >
      {renderContent()}
    </Paper>
  );
};

const PastClassesTab = ({ onEdit }: TabProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pastClassrooms"],
    queryFn: () => fetchClassrooms("past"),
  });

  const renderContent = () => {
    if (isLoading) return <PageLoading />;
    if (isError)
      return (
        <ErrorMessage message="Failed to load upcoming classes, please try again." />
      );
    if (!data?.data.length)
      return <Typography color={gray[400]}>No past classes found</Typography>;

    return <ClassroomList classrooms={data.data} onEdit={onEdit} />;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "5px",
        backgroundColor: "#ffffff",
      }}
    >
      {renderContent()}
    </Paper>
  );
};

export const Dashboard = () => {
  const { user, isStudent } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
    <Stack p={4} gap={4}>
      <Stack gap={2}>
        <Typography variant="h4" gutterBottom color="primary">
          Classrooms
        </Typography>

        {user && !isStudent() && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateClassroom}
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              width: "fit-content",
            }}
          >
            Create New Classroom
          </Button>
        )}
      </Stack>

      <Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "600",
            },
          }}
        >
          {["Upcoming Classes", "Past Classes"].map((tab, index) => {
            return (
              <Tab
                key={index}
                label={tab}
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              />
            );
          })}
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && (
            <UpcomingClassesTab onEdit={handleEditClassroom} />
          )}
          {tabValue === 1 && <PastClassesTab onEdit={handleEditClassroom} />}
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
    </Stack>
  );
};
