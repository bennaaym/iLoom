import React, { useState, ChangeEvent } from "react";
import { Box, TextField, Button, Stack, CircularProgress } from "@mui/material";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudents } from "../api/studentManegement.api";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";

const schema = yup.object().shape({
  name: yup.string().min(3).max(30).required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().min(8).max(16).required("Password is required"),
});

interface StudentFormProps {
  onSuccess: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (
      students: Array<{ name: string; email: string; password: string }>
    ) => createStudents(students),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setFormData({ name: "", email: "", password: "" });
      setErrors([]);
      onSuccess();
    },
    onError: (error: any) => {
      setErrors([error?.message || "An error occurred"]);
    },
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      mutation.mutate([formData]);
    } catch (validationErrors) {
      if (validationErrors instanceof yup.ValidationError) {
        setErrors(validationErrors.inner.map((error) => error.message));
      }
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        <TextField
          label="Student Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Student Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <CircularProgress size={24} /> : "Add Student"}
        </Button>
        {errors.length > 0 && <ErrorMessage message={errors.join(", ")} />}
      </Stack>
    </Box>
  );
};
