"use client";
import React from "react";
import { Typography, Paper, Button, Stack, Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";

const modules = [
  {
    title: "English",
    description: "Generate English learning activities with AI assistance.",
    path: "/subjects/english",
    icon: "📘",
  },
  {
    title: "Algorithm",
    description: "Create algorithm and coding exercises for students.",
    path: "/subjects/algorithm",
    icon: "💻",
  },
];

const GenerateContent = () => {
  const router = useRouter();

  const handleModuleSelect = (path: string) => {
    router.push(path);
  };

  return (
    <Stack p={4} gap={4}>
      <Typography variant="h4" gutterBottom color="primary">
        Generate Materials
      </Typography>

      <Grid2 container columns={{ sm: 1, md: 2, lg: 3 }} spacing={4}>
        {modules.map((module) => (
          <Grid2 key={module.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                width: 250,
                height: 150,
                py: 2,
              }}
              onClick={() => handleModuleSelect(module.path)}
            >
              <Typography variant="h5" gutterBottom>
                {module.icon} {module.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {module.description}
              </Typography>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Stack>
  );
};

export default GenerateContent;
