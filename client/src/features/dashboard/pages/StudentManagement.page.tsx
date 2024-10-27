import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import * as yup from "yup";
import { useAuth } from "@/common/providers/AuthProvider";
import { redirect } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudentsCsv,
  createStudents,
  getStudents,
  deleteStudent,
} from "../api/studentManegement.api";
import { User } from "@/features/auth/types";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters")
    .required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .required("Password is required"),
});

const StudentManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  if (!user || user.role !== "teacher") {
    redirect("/dashboard");
  }

  const students = useQuery<User[]>({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const createStudentMutation = useMutation({
    mutationFn: (students: Array<{ name: string; email: string; password: string }>) =>
      createStudents(students),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setFormData({ name: "", email: "", password: "" });
      setErrors({});
      setSnackbarMessage("Student added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
  });

  const createStudentsCsvMutation = useMutation({
    mutationFn: (file: File) => createStudentsCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setCsvFile(null);
      setSnackbarMessage("CSV uploaded successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (studentId: string) => deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setSnackbarMessage("Student deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: () => {
      setSnackbarMessage("Failed to delete student.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      setSnackbarMessage("Invalid file type. Please upload a CSV file.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
    event.target.value = "";
  };

  const handleUploadCsv = () => {
    if (csvFile) createStudentsCsvMutation.mutate(csvFile);
  };

  const downloadSampleCsv = () => {
    const sampleCsv = "name,email,password\nJohn Doe,johndoe@example.com,password123";
    const blob = new Blob([sampleCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_students.csv";
    link.click();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      createStudentMutation.mutate([formData]);
    } catch (validationErrors) {
      if (validationErrors instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        validationErrors.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", maxWidth: 1200, margin: "auto" }}>
        <Box sx={{ flex: 1, mr: 4 }}>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            Student Management
          </Typography>

          <Paper sx={{ padding: 4, mb: 4, boxShadow: 3 }}>
            <Typography variant="h6" color="secondary" fontWeight="bold" mb={2}>
              Add Student Manually
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Student Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={createStudentMutation.isPending}
              >
                {createStudentMutation.isPending ? <CircularProgress size={24} /> : "Add Student"}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ padding: 4, boxShadow: 3 }}>
            <Typography variant="h6" color="secondary" fontWeight="bold" mb={2}>
              Add Students from CSV
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="contained" component="label">
                Upload CSV
                <input type="file" hidden accept=".csv" onChange={handleFileChange} />
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUploadCsv}
                disabled={!csvFile || createStudentsCsvMutation.isPending}
              >
                {createStudentsCsvMutation.isPending ? <CircularProgress size={24} /> : "Send"}
              </Button>
              <Button variant="outlined" onClick={downloadSampleCsv}>
                Download Sample CSV
              </Button>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ flex: 0.8, ml: 4 }}>
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            Your Students
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {students.isLoading ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : students.isError ? (
            <Typography color="error">Error loading students.</Typography>
          ) : (
            <Stack spacing={2}>
              {students.data &&
                students.data.map((student) => (
                  <Paper
                    key={student.id}
                    sx={{
                      padding: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">{student.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {student.email}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteStudentMutation.mutate(student.id)}
                      disabled={deleteStudentMutation.isPending}
                    >
                      Delete
                    </Button>
                  </Paper>
                ))}
            </Stack>
          )}
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;
