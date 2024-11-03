"use client";
import React, { useState } from "react";
import { Box, Typography, Paper, Snackbar, Alert, Stack } from "@mui/material";
import { useAuth } from "@/common/providers/AuthProvider";
import { redirect } from "next/navigation";
import { StudentForm } from "../components/StudentForm";
import { CsvUpload } from "../components/CsvUpload";
import { StudentList } from "../components/StudentList";

const StudentManagement = () => {
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  if (!user || user.role !== "teacher") {
    redirect("/classrooms");
  }

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2} color="primary">
        Student Management
      </Typography>
      <Box display="flex" gap={4}>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          gap={3}
          maxWidth="500px"
        >
          <Paper sx={{ padding: 3 }} elevation={0}>
            <Typography variant="h6" mb={2}>
              Add Student Manually
            </Typography>
            <StudentForm
              onSuccess={() =>
                setSnackbar({
                  open: true,
                  message: "Student added successfully!",
                  severity: "success",
                })
              }
            />
          </Paper>
          <Paper sx={{ padding: 3 }} elevation={0}>
            <Typography variant="h6" mb={2}>
              Add Students from CSV
            </Typography>
            <CsvUpload />
          </Paper>
        </Box>

        <Box flex={1}>
          <Typography variant="h6" mb={2}>
            Student List
          </Typography>
          <StudentList />
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;
